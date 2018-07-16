package models.dao

import java.util.UUID

import models.domain.player.{Player, PlayerSearch}
import models.domain.team.Team
import models.ebean.{Player => EPlayer, TeamPlayer => ETeamPlayer}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object PlayerDAO {

  def toEbean(player: Player): EPlayer = {
    new EPlayer(
      player.id,
      player.password,
      player.name,
      player.lastName,
      player.location,
      player.email,
      player.phone,
      player.position
    )
  }

  def saveOrUpdate(player: Player): Player = {
    val ePlayer: EPlayer = toEbean(player)
    ePlayer.save()
    Player(ePlayer)
  }

  def getById(id: UUID): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.getById(id)).map(Player.apply)
  }

  def getByEmail(email: String): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.getByEmail(email)).map(Player.apply)
  }

  def getAll: List[Player] = {
    EPlayer.getAll.map(Player.apply).toList
  }

  def delete(player: Player): Option[Boolean] = {
    val ePlayer: EPlayer = toEbean(player)
    ePlayer.delete()
    Some(true)
  }

  def authenticate(email: String, password: String): Option[Player] = {
    toScalaOption[EPlayer](EPlayer.authenticatePlayer(email, password)).map(Player.apply)
  }

  def getPlayerTeams(playerId: UUID): List[Team] = {
    ETeamPlayer.getPlayerTeams(playerId).map(x => Team.apply(x.getTeam)).toList
  }

  def search(playerSearch: PlayerSearch): List[Player] = {
    EPlayer.search(playerSearch.name.getOrElse(""), playerSearch.lastName.getOrElse(""), playerSearch.location.orNull, playerSearch.position.orNull).map(Player.apply).toList
  }

}
