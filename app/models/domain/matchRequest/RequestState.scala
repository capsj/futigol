package models.domain.matchRequest

import play.api.libs.json.{Json, OFormat}

case class RequestState(value: String)

object RequestState {
  implicit val format: OFormat[RequestState] = Json.format

  val SENT = RequestState("Pendiente")
  val MODIFIED = RequestState("Modificada")
  val CONFIRMED = RequestState("Confirmada")
}
