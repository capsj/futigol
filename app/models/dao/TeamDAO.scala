package models.dao

import java.util.UUID

import models.domain.TeamPlayer
import models.domain.player.Player
import models.domain.team.{Team, TeamSearch}
import models.ebean.{Team => ETeam, TeamPlayer => ETeamPlayer}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object TeamDAO {

  def toEbean(team: Team): ETeam = {
    new ETeam(
      team.id,
      team.name,
      team.location,
      team.size,
      PlayerDAO.toEbean(team.captain)
    )
  }

  def save(team: Team): Team = {
    val eTeam: ETeam = toEbean(team)
    eTeam.save()
    val savedTeam = Team(eTeam)
    addCaptain(savedTeam, team.captain)
    savedTeam
  }

  def update(team: Team): Team = {
    val eTeam: ETeam = toEbean(team)
    eTeam.update()
    Team(eTeam)
  }

  def getById(id: UUID): Option[Team] = {
    toScalaOption[ETeam](ETeam.getById(id)).map(Team.apply)
  }

  def getByName(name: String): Option[Team] = {
    toScalaOption[ETeam](ETeam.getByName(name)).map(Team.apply)
  }

  def getByLocation(location: String): Option[Team] = {
    toScalaOption[ETeam](ETeam.getByLocation(location)).map(Team.apply)
  }

  def getAll: List[Team] = {
    ETeam.getAll.map(Team.apply).toList
  }

  def getByCaptain(captainId: UUID): List[Team] = {
    ETeam.getByCaptain(captainId).map(Team.apply).toList
  }

  def delete(team: Team): Option[Boolean] = {
    val eTeam: ETeam = toEbean(team)
    eTeam.delete()
    Some(true)
  }

  def addPlayer(team: Team, player: Player): TeamPlayer = {
    val eTeamPlayer: ETeamPlayer = TeamPlayerDAO.toEbean(TeamPlayer(None, player, team, isCaptain = false))
    eTeamPlayer.save()
    TeamPlayer(eTeamPlayer)
  }

  def addCaptain(team: Team, player: Player): TeamPlayer = {
    val eTeamPlayer: ETeamPlayer = TeamPlayerDAO.toEbean(TeamPlayer(None, player, team, isCaptain = true))
    eTeamPlayer.save()
    TeamPlayer(eTeamPlayer)
  }

  def getTeamPlayers(teamId: UUID): List[Player] = {
    ETeamPlayer.getTeamPlayers(teamId).map(x => Player(x.getPlayer)).toList
  }

  def search(teamSearch: TeamSearch): List[Team] = {
    ETeam.search(teamSearch.name.getOrElse(""), teamSearch.location.orNull, teamSearch.size.orNull).map(Team.apply).toList
  }
}
