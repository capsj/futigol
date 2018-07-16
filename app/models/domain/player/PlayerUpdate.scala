package models.domain.player

import java.util.UUID

import play.api.libs.json.{Json, OFormat}

case class PlayerUpdate(id: UUID, password: Option[String], email: Option[String],
                        name: Option[String], lastName: Option[String], location: Option[String], phone: Option[String],
                        position: Option[String]) {
  def toPlayer(player: Player): Player = {
    Player(player.id, password.getOrElse(player.password), email.getOrElse(player.email),
      name.getOrElse(player.name), lastName.getOrElse(player.lastName), location.getOrElse(player.location),
      phone.getOrElse(player.phone), position.getOrElse(player.position))
  }
}

object PlayerUpdate {
  implicit val playerFormat: OFormat[PlayerUpdate] = Json.format[PlayerUpdate]
}