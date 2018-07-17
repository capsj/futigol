package models.domain.matchRequest

import java.util.UUID

import models.domain.util.{Date, Time}
import play.api.libs.json.{Json, OFormat}

case class RequestUpdate(id: UUID, date: Option[Date], time: Option[Time], location: Option[String], state: Option[String]) {

  def toRequest(matchRequest: MatchRequest): MatchRequest = {
    MatchRequest(id, matchRequest.sender, matchRequest.receiver, date.getOrElse(matchRequest.date), time.getOrElse(matchRequest.time),
      location.getOrElse(matchRequest.location), state.getOrElse(matchRequest.state))
  }
}

object RequestUpdate {
  implicit val format: OFormat[RequestUpdate] = Json.format
}
