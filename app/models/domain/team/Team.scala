package models.domain.team

import java.util.UUID

import models.dao.TeamDAO
import models.domain.player.Player
import models.domain.TeamPlayer
import models.ebean.{Team => ETeam}
import play.api.libs.json.{Json, OFormat}

case class Team(id: UUID, name: String, location: String, size: Int, captain: Player)

object Team extends TeamFormat {

  def apply(eTeam: ETeam): Team = {
    Team(
      eTeam.getId,
      eTeam.getName,
      eTeam.getLocation,
      eTeam.getSize,
      Player(eTeam.getCaptain)
    )
  }

  def saveOrUpdate(team: Team): Team = {
    TeamDAO.saveOrUpdate(team)
  }

  def getById(id: UUID): Option[Team] = {
    TeamDAO.getById(id)
  }

  def getByName(name: String): Option[Team] = {
    TeamDAO.getByName(name)
  }

  def getByLocation(location: String): Option[Team] = {
    TeamDAO.getByLocation(location)
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

  def getTeamPlayers(teamId: UUID): List[Player] = {
    TeamDAO.getTeamPlayers(teamId)
  }

  def getByCaptain(captainId: UUID): List[Team] = {
    TeamDAO.getByCaptain(captainId)
  }

  def search(teamSearch: TeamSearch): List[Team] = {
    TeamDAO.search(teamSearch)
  }
}

trait TeamFormat {
  implicit val teamFormat: OFormat[Team] = Json.format[Team]
}