package controllers

import java.util.UUID
import javax.inject.{Inject, Named}

import akka.actor.ActorRef
import models.domain.authentication.CaseUser
import models.domain.invite.{Invite, RequestType}
import models.domain.matchRequest.{MatchRequest, RequestState, RequestUpdate}
import models.domain.player._
import models.domain.team.Team
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated
import pdi.jwt._
import play.api.libs.mailer.Email

import scala.concurrent.duration._
import utils.EmailActor.SendEmail
import akka.pattern.ask
import akka.util.Timeout

class PlayerController @Inject() (@Named("futigol-email") emailActor: ActorRef) extends Controller {

  implicit val timeout: Timeout = 300.seconds

  def register = Action {
    request =>
      request.body.asJson.get.asOpt[PlayerCreate] match {
        case Some(player) =>
          Player.getByEmail(player.email) match {
            case Some(_) =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Email already in use"
                  )
                )
              )
            case None =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Player saved", Json.toJson(Player.saveOrUpdate(player.toPlayer()))
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def delete(id: UUID) = Action {
    Player.getById(id) match {
      case Some(player) =>
        Player.delete(player) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Player deleted"
                )
              )
            )
          case _ =>
            BadRequest(
              Json.toJson(
                ResponseGenerated(
                  BAD_REQUEST, "Delete error"
                )
              )
            )
        }
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No Player for that id"
            )
          )
        )
    }
  }

  def getById(id: UUID) = Action {
    Player.getById(id) match {
      case Some(player) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Player found", Json.toJson(player)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No player for that id"
            )
          )
        )
    }
  }

  def getByEmail(email: String) = Action {
    Player.getByEmail(email) match {
      case Some(player) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Player found", Json.toJson(player)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No player found"
            )
          )
        )
    }
  }

  def getPlayerTeams(playerId: UUID) = Action {
    Player.getById(playerId) match {
      case Some(_) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "All player teams", Json.toJson(Player.getPlayerTeams(playerId))
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No player for that id"
            )
          )
        )
    }
  }

  def getAll = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All players", Json.toJson(Player.getAll)
        )
      )
    )
  }

  def search = Action {
    request =>
      request.body.asJson.get.asOpt[PlayerSearch] match {
        case Some(playerSearch) =>
          request.jwtSession.getAs[CaseUser]("user") match {
            case Some(user) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Results", Json.toJson(Player.search(playerSearch).filter(_.id != user.id))
                  )
                )
              )
            case None => BadRequest(
              Json.toJson(
                ResponseGenerated(
                  BAD_REQUEST, "No session started"
                )
              )
            )
          }
        case None => BadRequest
      }
  }

  def playerInfo(id: UUID) = Action {
    Player.getById(id) match {
      case Some(player) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Player info", Json.toJson(PlayerInfo(id, player, Player.getPlayerTeams(id)))
            )
          )
        )
      case None => BadRequest
    }
  }

  def invitePlayer = Action {
    request =>
      request.body.asJson.get.asOpt[PlayerInvite] match {
        case Some(playerInvite) =>
          Team.getById(playerInvite.teamId) match {
            case Some(team) =>
              request.jwtSession.getAs[CaseUser]("user") match {
                case Some(user) =>
                  Player.getById(user.id) match {
                    case Some(sender) =>
                      Player.getById(playerInvite.playerId) match {
                        case Some(receiver) =>
                          val invite = Invite.save(sender, receiver, team, RequestType.INVITE.value)
                          val email = Email(
                            "Invitación a equipo",
                            "info@futigol.com <from@email.com>",
                            Seq(receiver.email),
                            bodyHtml = Some("<html>\n" +
                              "<head>\n" +
                              "    <meta http-equiv=\"Content-Type\" content=\"text/html\" charset=\"utf-8\">\n" +
                              "</head>\n" + "<body style=\"font-family: Helvetica Light, Helvetica, sans-serif\">\n" +
                              "<div id=\"full-container\" style=\"width: 90%; margin: 20px auto; ;border: solid 1px #EFEFEF\">\n" +
                              "    <div>\n" +
                              "        <div style=\"padding: 20px\">\n" +
                              "            <h2>Futigol</h2>\n" +
                              "            <p>Recibiste una invitación de " + sender.name + " " + sender.lastName + " para unirte a " + team.name + "</p>\n" +
                              "            <p>Confirmala haciendo click en el siguiente link</p>\n" +
                              "            <p><a href= \"http://localhost:9000/api/invite/accept/team/mail/" + invite.id + "\">Confirmar</a>" +
                              "            <p>O inicia sesión para más opciones</p>\n" +
                              "            <p><a href= \"http://localhost:9000/login\">Iniciar Sesión</a>" +
                              "            <p>Saludos!</p>" +
                              "        </div>\n" +
                              "    </div>\n" +
                              "</body>\n" +
                              "</html>")
                          )
                          emailActor ? SendEmail(email)
                          Ok(
                            Json.toJson(
                              ResponseGenerated(
                                OK, "Invite sent", Json.toJson(invite))
                              )
                            )
                        case None => BadRequest
                      }
                    case None =>
                      BadRequest(
                        Json.toJson(
                          ResponseGenerated(
                            BAD_REQUEST, "No player found for that id"
                          )
                        )
                      )
                  }
                case None => BadRequest
              }
            case None => BadRequest
          }
        case None => BadRequest
      }
  }
  
  def getCaptainTeams(id: UUID) = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "Captain teams", Json.toJson(Team.getByCaptain(id))
        )
      )
    )
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[PlayerUpdate] match {
        case Some(update) =>
          Player.getById(update.id) match {
            case Some(player) =>
              update.email match {
                case Some(email) =>
                  Player.getByEmail(email) match {
                    case Some(eResult) =>
                      if(eResult.id == player.id) {
                        Ok(
                          Json.toJson(
                            ResponseGenerated(
                              OK, "Player updated", Json.toJson(Player.update(update.toPlayer(player)))
                            )
                          )
                        )
                      } else {
                        BadRequest(
                          Json.toJson(
                            ResponseGenerated(
                              BAD_REQUEST, "Email already in use"
                            )
                          )
                        )
                      }
                    case None =>
                      Ok(
                        Json.toJson(
                          ResponseGenerated(
                            OK, "Player updated", Json.toJson(Player.update(update.toPlayer(player)))
                          )
                        )
                      )
                  }
                case None =>
                  Ok(
                    Json.toJson(
                      ResponseGenerated(
                        OK, "Player updated", Json.toJson(Player.update(update.toPlayer(player)))
                      )
                    )
                  )
              }
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "No player found for that id"
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def getPendingMatches(playerId: UUID) = Action {
    Player.getById(playerId) match {
      case Some(player) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Pending requests", Json.toJson(
                Team.getByCaptain(player.id).flatMap(x =>
                  MatchRequest.getPendingRequests(x.id).map(y => {
                    if(y.sender.id == x.id) y.copy(state = "Enviada")
                    else y
                  })
                )
              )
            )
          )
        )
      case None => BadRequest
    }
  }

  def getConfirmedMatches(playerId: UUID) = Action {
    Player.getById(playerId) match {
      case Some(_) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Pending requests", Json.toJson(
                Player.getPlayerTeams(playerId).flatMap(x =>
                  MatchRequest.getConfirmedRequests(x.id)
                ).distinct
              )
            )
          )
        )
      case None => BadRequest
    }
  }

  def confirmMatch = Action {
    request =>
      request.body.asJson.get.asOpt[RequestUpdate] match {
        case Some(requestUpdate) =>
          MatchRequest.getById(requestUpdate.id) match {
            case Some(matchRequest) =>
              requestUpdate.state match {
                case Some(state) =>
                  if(state == RequestState.CONFIRMED.value) {
                    val updatedRequest = MatchRequest.update(requestUpdate.toRequest(matchRequest))
                    val email = Email(
                      "Confirmación de partido",
                      "info@futigol.com <from@email.com>",
                      Seq(matchRequest.receiver.captain.email, matchRequest.sender.captain.email),
                      bodyHtml = Some("<html>\n" +
                        "<head>\n" +
                        "    <meta http-equiv=\"Content-Type\" content=\"text/html\" charset=\"utf-8\">\n" +
                        "</head>\n" + "<body style=\"font-family: Helvetica Light, Helvetica, sans-serif\">\n" +
                        "<div id=\"full-container\" style=\"width: 90%; margin: 20px auto; ;border: solid 1px #EFEFEF\">\n" +
                        "    <div>\n" +
                        "        <div style=\"padding: 20px\">\n" +
                        "            <h2>Futigol</h2>\n" +
                        "            <p>Se confirmó el partido entre " + matchRequest.receiver.name + " y " + matchRequest.sender.name + " para jugar el " + matchRequest.date.toDateString + " en " + matchRequest.location + "</p>\n" +
                        "            <p>Inicia sesión para ver tu calendario</p>\n" +
                        "            <p><a href= \"http://localhost:9000/login\">Iniciar Sesión</a>" +
                        "            <p>Saludos!</p>" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "</html>")
                    )
                    emailActor ? SendEmail(email)
                    Ok(
                      Json.toJson(
                        ResponseGenerated(
                          OK, "Match accepted", Json.toJson(updatedRequest)
                        )
                      )
                    )
                  } else {
                    Ok(
                      Json.toJson(
                        ResponseGenerated(
                          OK, "Match accepted", Json.toJson(MatchRequest.update(requestUpdate.toRequest(matchRequest)))
                        )
                      )
                    )
                  }
                case None =>
                  Ok(
                    Json.toJson(
                      ResponseGenerated(
                        OK, "Match accepted", Json.toJson(MatchRequest.update(requestUpdate.toRequest(matchRequest)))
                      )
                    )
                  )
              }
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "No request found for that id"
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def getNotifications(playerId: UUID) = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "Player notifications", Json.toJson(Invite.getPlayerNotifications(playerId))
        )
      )
    )
  }
}
