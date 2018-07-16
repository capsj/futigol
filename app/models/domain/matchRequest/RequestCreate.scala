package models.domain.matchRequest

import java.util.UUID

import models.domain.util.{Date, Time}
import play.api.libs.json.{Json, OFormat}

case class RequestCreate(sender: UUID, receiver: UUID, date: Date, time: Time, location: String)

object RequestCreate {
  implicit val format: OFormat[RequestCreate] = Json.format
}
