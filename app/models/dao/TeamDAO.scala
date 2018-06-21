package models.dao

import models.domain.TeamPlayer
import models.domain.player.Player
import models.domain.team.Team
import models.ebean.{Team => ETeam, TeamPlayer => ETeamPlayer}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object TeamDAO {

  def toEbean(team: Team): ETeam = {
    new ETeam(
      if(team.id.isDefined) team.id.get else null,
      team.name,
      team.location,
      team.size,
      PlayerDAO.toEbean(team.captain)
    )
  }

  def saveOrUpdate(team: Team): Team = {
    team.id match {
      case Some(_) =>
        val eTeam: ETeam = toEbean(team)
        eTeam.update()
        Team(eTeam)
      case None =>
        val eTeam: ETeam = toEbean(team)
        eTeam.save()
        val savedTeam = Team(eTeam)
        addCaptain(savedTeam, team.captain)
        savedTeam
    }
  }

  def getById(id: Long): Option[Team] = {
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

  def delete(team: Team): Option[Boolean] = {
    team.id match {
      case Some(_) =>
        val eTeam: ETeam = toEbean(team)
        eTeam.delete()
        Some(true)
      case None => None
    }
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

  def getTeamPlayers(teamId: Long): List[Player] = {
    ETeamPlayer.getTeamPlayers(teamId).map(x => Player(x.getPlayer)).toList
  }
}
