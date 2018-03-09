package models.domain.player

import play.api.libs.json.{Json, OFormat}

case class PlayerUpdate(id: Long, username: Option[String], password: Option[String], email: Option[String],
                        name: Option[String], phone: Option[String]) {
  def toPlayer(player: Player): Player = {
    Player(Some(id), username.getOrElse(player.username), password.getOrElse(player.password), email.getOrElse(player.email),
      name.getOrElse(player.name), phone.getOrElse(player.phone))
  }
}

object PlayerUpdate {
  implicit val playerFormat: OFormat[PlayerUpdate] = Json.format[PlayerUpdate]
}