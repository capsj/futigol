package models.domain.team

import java.util.UUID

import play.api.libs.json.{Json, OFormat}

case class TeamUpdate(id: UUID, name: Option[String], location: Option[String], size: Option[Int]) {
  def toTeam(team: Team): Team = {
    Team(id, name.getOrElse(team.name), location.getOrElse(team.location), size.getOrElse(team.size), team.captain)
  }
}

object TeamUpdate {
  implicit val format: OFormat[TeamUpdate] = Json.format
}
