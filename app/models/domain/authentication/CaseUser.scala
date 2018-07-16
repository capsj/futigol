package models.domain.authentication

import java.util.UUID

import models.domain.player.Player
import play.api.libs.json.{Json, OFormat}

case class CaseUser(id: UUID, name: String, email: String)

object CaseUser extends CaseUserJsonFormat {
  def toCaseUser(player: Player): CaseUser = {
    CaseUser(
      player.id,
      player.name,
      player.email
    )
  }
}

trait CaseUserJsonFormat {
  implicit val caseUserFormat: OFormat[CaseUser] = Json.format[CaseUser]
}
