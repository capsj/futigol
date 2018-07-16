package models.domain.player

import java.util.UUID

import play.api.libs.json.{Json, OFormat}

case class PlayerCreate(password: String, email: String, name: String, lastName: String, location: String,
                        phone: String, position: String) {
  def toPlayer(): Player = {
    Player(UUID.randomUUID(), password, email, name, lastName, location, phone, position)
  }
}

object PlayerCreate {
  implicit val format: OFormat[PlayerCreate] = Json.format
}
