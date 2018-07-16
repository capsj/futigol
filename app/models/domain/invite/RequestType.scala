package models.domain.invite

import play.api.libs.json.{Json, OFormat}

case class RequestType(value: String)

object RequestType {
  implicit val format: OFormat[RequestType] = Json.format

  val INVITE = RequestType("Invite")
  val JOIN = RequestType("Join")
}
