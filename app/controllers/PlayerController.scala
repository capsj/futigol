package controllers

import models.domain.player.{Player, PlayerUpdate}
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

class PlayerController extends Controller {

  def register = Action {
    request =>
      request.body.asJson.get.asOpt[Player] match {
        case Some(player) =>
          Player.getByUsername(player.username) match {
            case Some(_) =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Username already in use"
                  )
                )
              )
            case None =>
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
                        OK, "Player saved", Json.toJson(Player.saveOrUpdate(player))
                      )
                    )
                  )
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

  def delete(id: Long) = Action {
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

  def getById(id: Long) = Action {
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

  def getByUsername(username: String) = Action {
    Player.getByUsername(username) match {
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
              BAD_REQUEST, "No player with that username"
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

  def getPlayerTeams(playerId: Long) = Action {
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
