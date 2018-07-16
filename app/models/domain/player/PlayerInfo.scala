package models.domain.player

import java.util.UUID

import models.domain.team.Team
import play.api.libs.json.{Json, OFormat}

case class PlayerInfo(id: UUID, email: String, name: String, lastName: String, location: String,
                 phone: String, position: String, teams: List[Team])

object PlayerInfo {
  implicit val format: OFormat[PlayerInfo] = Json.format

  def apply(id: UUID, player: Player, teams: List[Team]): PlayerInfo = {
    PlayerInfo(id, player.email, player.name, player.lastName, player.location, player.phone, player.position, teams)
  }
}