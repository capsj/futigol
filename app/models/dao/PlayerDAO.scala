package models.dao

import models.domain.player.Player
import models.domain.team.Team
import models.ebean.{Player => EPlayer, TeamPlayer => ETeamPlayer}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object PlayerDAO {

  def toEbean(player: Player): EPlayer = {
    new EPlayer(
      if(player.id.isDefined) player.id.get else null,
      player.username,
      player.password,
      player.name,
      player.email,
      player.phone
    )
  }

  def saveOrUpdate(player: Player): Player = {
    player.id match {
      case Some(id) =>
        val ePlayer: EPlayer = toEbean(player)
        ePlayer.update()
        Player(ePlayer)
      case None =>
        val ePlayer: EPlayer = toEbean(player)
        ePlayer.save()
        Player(ePlayer)
    }
  }

  def getById(id: Long): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.getById(id)).map(Player.apply)
  }

  def getByUsername(username: String): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.getByUsername(username)).map(Player.apply)
  }

  def getByEmail(email: String): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.getByEmail(email)).map(Player.apply)
  }

  def getAll: List[Player] = {
    EPlayer.getAll.map(Player.apply).toList
  }

  def delete(player: Player): Option[Boolean] = {
    player.id match {
      case Some(_) =>
        val ePlayer: EPlayer = toEbean(player)
        ePlayer.delete()
        Some(true)
      case None => None
    }
  }

  def authenticate(username: String, password: String): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.authenticatePlayer(username, password)).map(Player.apply)
  }

  def getPlayerTeams(playerId: Long): List[Team] = {
    ETeamPlayer.getPlayerTeams(playerId).map(x => Team.apply(x.getTeam)).toList
  }

}
