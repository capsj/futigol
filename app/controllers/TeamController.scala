package controllers

import java.util.UUID
import javax.inject.{Inject, Named}

import akka.actor.ActorRef
import akka.util.Timeout
import models.domain.authentication.CaseUser
import models.domain.player.Player
import models.domain.team.{Team, TeamCreate, TeamSearch}
import pdi.jwt._
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

import scala.concurrent.duration._
import utils.EmailActor.SendEmail
import akka.pattern.ask
import models.domain.invite.{Invite, RequestType}
import play.api.libs.mailer.{AttachmentFile, Email}

class TeamController @Inject() (@Named("futigol-email") emailActor: ActorRef)  extends Controller {

  implicit val timeout: Timeout = 300.seconds

  def register = Action {
    request =>
      request.body.asJson.get.asOpt[TeamCreate] match {
        case Some(teamCreate) =>
          Team.getByName(teamCreate.name) match {
            case Some(_) =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Name already in use"
                  )
                )
              )
            case None =>
              request.jwtSession.getAs[CaseUser]("user") match {
                case Some(user) =>
                  Player.getById(user.id) match {
                    case Some(player) =>
                      Ok(
                        Json.toJson(
                          ResponseGenerated(
                            OK, "Team saved", Json.toJson(Team.saveOrUpdate(teamCreate.toTeam(player)))
                          )
                        )
                      )
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
                  BadRequest
              }
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
    Team.getById(id) match {
      case Some(team) =>
        Team.delete(team) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Team deleted"
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
              BAD_REQUEST, "No Team for that id"
            )
          )
        )
    }
  }

  def getById(id: UUID) = Action {
    Team.getById(id) match {
      case Some(team) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Team found", Json.toJson(team)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No team for that id"
            )
          )
        )
    }
  }

  def getByName(name: String) = Action {
    Team.getByName(name) match {
      case Some(team) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Team found", Json.toJson(team)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No team with that username"
            )
          )
        )
    }
  }

  def getByLocation(location: String) = Action {
    Team.getByLocation(location) match {
      case Some(team) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Team found", Json.toJson(team)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No team with that location"
            )
          )
        )
    }
  }

  def getAll = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All teams", Json.toJson(Team.getAll)
        )
      )
    )
  }

  def joinRequest = Action {
    request =>
      request.body.asJson.get.asOpt[UUID] match {
        case Some(teamId) =>
          Team.getById(teamId) match {
            case Some(team) =>
              request.jwtSession.getAs[CaseUser]("user") match {
                case Some(user) =>
                  if(Player.getPlayerTeams(user.id).exists(_.id == teamId)) {
                    BadRequest(
                      Json.toJson(
                        ResponseGenerated(
                          BAD_REQUEST, "The player is already part of the team"
                        )
                      )
                    )
                  } else {
                    Player.getById(user.id) match {
                      case Some(sender) =>
                        val email = Email(
                          "Pedido de Inscripción",
                          "info@futigol.com <from@email.com>",
                          Seq()
                        )
                        emailActor ? SendEmail(email)
                        Ok(
                          Json.toJson(
                            ResponseGenerated(
                              OK, "Request sent", Json.toJson(Invite.save(sender, team.captain, team, RequestType.INVITE.value))
                            )
                          )
                        )
                      case None =>
                        BadRequest(
                          Json.toJson(
                            ResponseGenerated(
                              BAD_REQUEST, "No player found for that id"
                            )
                          )
                        )
                    }
                  }
                case None =>
                  BadRequest(
                    Json.toJson(
                      ResponseGenerated(
                        BAD_REQUEST, "Session error"
                      )
                    )
                  )
              }
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "No team with that id"
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

  def getTeamPlayers(teamId: UUID) = Action {
    Team.getById(teamId) match {
      case Some(_) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Team players", Json.toJson(Team.getTeamPlayers(teamId))
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No team for that id"
            )
          )
        )
    }
  }

  def search = Action {
    request =>
      request.body.asJson.get.asOpt[TeamSearch] match {
        case Some(teamSearch) =>
          request.jwtSession.getAs[CaseUser]("user") match {
            case Some(user) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Team search", Json.toJson(Team.search(teamSearch).filter(_.captain.id != user.id))
                  )
                )
              )
            case None => BadRequest
          }
        case None => BadRequest
      }
  }

  def checkJoinRequests(teamId: UUID, playerId: UUID) = Action {
    Ok
  }
}