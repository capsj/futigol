package models.domain.team

import models.dao.TeamDAO
import models.domain.player.Player
import models.domain.{Location, TeamPlayer}
import models.ebean.{Team => ETeam}
import play.api.libs.json.{Json, OFormat}

case class Team(id: Option[Long], name: String, location: Location, size: Int, captain: Player)

object Team extends TeamFormat {

  def apply(eTeam: ETeam): Team = {
    Team(
      Some(eTeam.getId),
      eTeam.getName,
      Location(eTeam.getLocation),
      eTeam.getSize,
      Player(eTeam.getCaptain)
    )
  }

  def saveOrUpdate(team: Team): Team = {
    TeamDAO.saveOrUpdate(team)
  }

  def getById(id: Long): Option[Team] = {
    TeamDAO.getById(id)
  }

  def getByName(name: String): Option[Team] = {
    TeamDAO.getByName(name)
  }

  def getByLocation(locationId: Long): Option[Team] = {
    TeamDAO.getByLocation(locationId)
  }

  def getAll: List[Team] = {
    TeamDAO.getAll
  }

  def delete(team: Team): Option[Boolean] = {
    TeamDAO.delete(team)
  }

  def addPlayer(team: Team, player: Player): TeamPlayer = {
    TeamDAO.addPlayer(team, player)
  }

  def getTeamPlayers(teamId: Long): List[Player] = {
    TeamDAO.getTeamPlayers(teamId)
  }
}

trait TeamFormat {
  implicit val teamFormat: OFormat[Team] = Json.format[Team]
}