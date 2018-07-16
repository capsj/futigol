package models.domain.player

import java.util.UUID

import play.api.libs.json.{Json, OFormat}

case class PlayerInvite(teamId: UUID, playerId: UUID)

object PlayerInvite {
  implicit val format: OFormat[PlayerInvite] = Json.format
}
