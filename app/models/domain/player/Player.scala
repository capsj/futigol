package models.domain.player

import models.dao.PlayerDAO
import models.domain.authentication.UserLogin
import models.domain.team.Team
import models.ebean.{Player => EPlayer}
import play.api.libs.json.{Json, OFormat}

case class Player(id: Option[Long], password: String, email: String, name: String, lastName: String, location: String,
                  phone: String, position: String)

object Player extends PlayerFormat {

  def apply(ePlayer: EPlayer): Player = {
    Player(Some(ePlayer.getId), ePlayer.getPassword, ePlayer.getEmail, ePlayer.getName, ePlayer.getLastName,
      ePlayer.getLocation, ePlayer.getPhone, ePlayer.getPosition)
  }

  def saveOrUpdate(player: Player): Player = {
    PlayerDAO.saveOrUpdate(player)
  }

  def getById(id: Long): Option[Player] = {
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

  def getPlayerTeams(playerId: Long): List[Team] = {
    PlayerDAO.getPlayerTeams(playerId)
  }
}

trait PlayerFormat {
  implicit val playerFormat: OFormat[Player] = Json.format[Player]
}
