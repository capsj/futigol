package models.domain.authentication

import models.domain.player.Player
import play.api.libs.json.{Json, OFormat}

case class CaseUser(id: Long, name: String, email: String)

object CaseUser extends CaseUserJsonFormat {
  def toCaseUser(player: Player): CaseUser = {
    CaseUser(
      player.id.get,
      player.name,
      player.email
    )
  }
}

trait CaseUserJsonFormat {
  implicit val caseUserFormat: OFormat[CaseUser] = Json.format[CaseUser]
}
