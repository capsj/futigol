package models.domain.team

import play.api.libs.json.{Json, OFormat}

case class TeamSearch(name: Option[String], location: Option[String], size: Option[String])

object TeamSearch {
  implicit val format: OFormat[TeamSearch] = Json.format
}