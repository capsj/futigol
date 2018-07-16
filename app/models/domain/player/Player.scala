package models.domain.player

import java.util.UUID

import models.dao.PlayerDAO
import models.domain.authentication.UserLogin
import models.domain.team.Team
import models.ebean.{Player => EPlayer}
import play.api.libs.json.{Json, OFormat}

case class Player(id: UUID, password: String, email: String, name: String, lastName: String, location: String,
                  phone: String, position: String)

object Player extends PlayerFormat {

  def apply(ePlayer: EPlayer): Player = {
    Player(ePlayer.getId, ePlayer.getPassword, ePlayer.getEmail, ePlayer.getName, ePlayer.getLastName,
      ePlayer.getLocation, ePlayer.getPhone, ePlayer.getPosition)
  }

  def saveOrUpdate(player: Player): Player = {
    PlayerDAO.saveOrUpdate(player)
  }

  def getById(id: UUID): Option[Player] = {
    PlayerDAO.getById(id)
  }

  def getByEmail(email: String): Option[Player] = {
    PlayerDAO.getByEmail(email)
  }

  def getAll: List[Player] = {
    PlayerDAO.getAll
  }

  def delete(player: Player): Option[Boolean] = {
    PlayerDAO.delete(player)
  }

  def authenticate(userLogin: UserLogin): Option[Player] = {
    PlayerDAO.authenticate(userLogin.email, userLogin.password)
  }

  def getPlayerTeams(playerId: UUID): List[Team] = {
    PlayerDAO.getPlayerTeams(playerId)
  }

  def search(playerSearch: PlayerSearch): List[Player] = {
    PlayerDAO.search(playerSearch)
  }
}

trait PlayerFormat {
  implicit val playerFormat: OFormat[Player] = Json.format[Player]
}
