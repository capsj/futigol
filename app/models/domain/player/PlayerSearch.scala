package models.domain.player

import play.api.libs.json.{Json, OFormat}

case class PlayerSearch(name: Option[String], lastName: Option[String], position: Option[String], location: Option[String])

object PlayerSearch {
  implicit val format: OFormat[PlayerSearch] = Json.format
}