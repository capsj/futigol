package controllers

import models.domain.authentication.CaseUser
import models.domain.player.Player
import models.domain.team.{Team, TeamCreate}
import pdi.jwt._
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

class TeamController extends Controller {

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

  def delete(id: Long) = Action {
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

  def getById(id: Long) = Action {
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
      request.body.asJson.get.asOpt[Long] match {
        case Some(teamId) =>
          Team.getById(teamId) match {
            case Some(team) =>
              request.jwtSession.getAs[CaseUser]("user") match {
                case Some(user) =>
                  if(Player.getPlayerTeams(user.id).exists(_.id.get == teamId)) {
                    BadRequest(
                      Json.toJson(
                        ResponseGenerated(
                          BAD_REQUEST, "The player is already part of the team"
                        )
                      )
                    )
                  } else {
                    Player.getById(user.id) match {
                      case Some(player) =>
                        Ok(
                          Json.toJson(
                            ResponseGenerated(
                              OK, "Player added", Json.toJson(Team.addPlayer(team, player))
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

  def getTeamPlayers(teamId: Long) = Action {
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

}