package controllers

import java.util.UUID

import models.domain.authentication.CaseUser
import models.domain.invite.{Invite, RequestType}
import models.domain.player._
import models.domain.team.Team
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated
import pdi.jwt._

class PlayerController extends Controller {

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
                          Ok(
                            Json.toJson(
                              ResponseGenerated(
                                OK, "Invite sent", Json.toJson(Invite.save(sender, receiver, team, RequestType.INVITE.value)))
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
  
//  def update = Action {
//    request =>
//      request.body.asJson.get.asOpt[PlayerUpdate] match {
//        case Some(update) =>
//          Player.getById(update.id) match {
//            case Some(player) =>
//              update.username match {
//                case Some(username) =>
//                  if(username != request.player.username) {
//                    Player.getByUsername(username) match {
//                      case Some(foundPlayer) =>
//                        if(player.equals(foundPlayer)){
//                          update.email match {
//                            case Some(email) =>
//                              Player.getByEmail(email) match {
//                                case Some(mailPlayer) =>
//                                  if(player.equals(mailPlayer)){
//                                    val updatedPlayer = update.toPlayer(player)
//                                    Player.saveOrUpdate(updatedPlayer)
//                                    Ok(
//                                      Json.toJson(
//                                        ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                                      )
//                                    )
//                                  }
//                                  else {
//                                    BadRequest(
//                                      Json.toJson(
//                                        ResponseGenerated(BAD_REQUEST, "Mail already in use")
//                                      )
//                                    )
//                                  }
//                                case None =>
//                                  val updatedPlayer = update.toPlayer(player)
//                                  Player.saveOrUpdate(updatedPlayer)
//                                  Ok(
//                                    Json.toJson(
//                                      ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                                    )
//                                  )
//                              }
//                            case None =>
//                              val updatedPlayer = update.toPlayer(player)
//                              Player.saveOrUpdate(updatedPlayer)
//                              Ok(
//                                Json.toJson(
//                                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                                )
//                              )
//                          }
//                        }
//                        else {
//                          BadRequest(
//                            Json.toJson(
//                              ResponseGenerated(BAD_REQUEST, "Username already in use")
//                            )
//                          )
//                        }
//                      case None =>
//                        Player.getByEmail(player.email) match {
//                          case Some(mailPlayer) =>
//                            if(player.equals(mailPlayer)){
//                              val updatedPlayer = update.toPlayer(player)
//                              Player.saveOrUpdate(updatedPlayer)
//                              Ok(
//                                Json.toJson(
//                                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                                )
//                              )
//                            }
//                            else {
//                              BadRequest(
//                                Json.toJson(
//                                  ResponseGenerated(BAD_REQUEST, "Mail already in use")
//                                )
//                              )
//                            }
//                          case None =>
//                            val updatedPlayer = update.toPlayer(player)
//                            Player.saveOrUpdate(updatedPlayer)
//                            Ok(
//                              Json.toJson(
//                                ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                              )
//                            )
//                        }
//                    }
//                  }
//                  else if(username == request.player.username && !player.equals(request.player)) {
//                    BadRequest(
//                      Json.toJson(
//                        ResponseGenerated(BAD_REQUEST, "Username already in use")
//                      )
//                    )
//                  }
//                  else {
//                    Player.getByEmail(player.email) match {
//                      case Some(mailPlayer) =>
//                        if(mailPlayer.equals(player)){
//                          val updatedPlayer = update.toPlayer(player)
//                          Player.saveOrUpdate(updatedPlayer)
//                          Ok(
//                            Json.toJson(
//                              ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                            )
//                          )
//                        }
//                        else {
//                          BadRequest(
//                            Json.toJson(
//                              ResponseGenerated(BAD_REQUEST, "Mail already in use")
//                            )
//                          )
//                        }
//                      case None =>
//                        val updatedPlayer = update.toPlayer(player)
//                        Player.saveOrUpdate(updatedPlayer)
//                        Ok(
//                          Json.toJson(
//                            ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                          )
//                        )
//                    }
//                  }
//                case None =>
//                  Player.getByEmail(player.email) match {
//                    case Some(mailPlayer) =>
//                      if(mailPlayer.equals(player)){
//                        val updatedPlayer = update.toPlayer(player)
//                        Player.saveOrUpdate(updatedPlayer)
//                        Ok(
//                          Json.toJson(
//                            ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                          )
//                        )
//                      }
//                      else {
//                        BadRequest(
//                          Json.toJson(
//                            ResponseGenerated(BAD_REQUEST, "Mail already in use")
//                          )
//                        )
//                      }
//                    case None =>
//                      val updatedPlayer = update.toPlayer(player)
//                      Player.saveOrUpdate(updatedPlayer)
//                      Ok(
//                        Json.toJson(
//                          ResponseGenerated(OK, "Update successful", Json.toJson(updatedPlayer))
//                        )
//                      )
//                  }
//              }
//            case None =>
//              BadRequest(
//                Json.toJson(
//                  ResponseGenerated(BAD_REQUEST, "No player found")
//                )
//              )
//          }
//        case None =>
//          BadRequest(
//            Json.toJson(
//              ResponseGenerated(BAD_REQUEST, "Invalid data")
//            )
//          )
//      }
//  }
}
