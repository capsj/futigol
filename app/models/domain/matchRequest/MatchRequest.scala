package models.domain.matchRequest

import java.util.UUID

import models.domain.team.Team
import models.domain.util.{Date, Time}
import models.ebean.{MatchRequest => EMatchRequest}
import play.api.libs.json.{Json, OFormat}

case class MatchRequest(id: Option[UUID], sender: Team, receiver: Team, date: Date, time: Time, location: String)

object MatchRequest extends MatchRequestFormat {
  def apply(eMatchRequest: EMatchRequest): MatchRequest = {
    MatchRequest(
      Some(eMatchRequest.getId),
      Team(eMatchRequest.getSender),
      Team(eMatchRequest.getReceiver),
      Date(eMatchRequest.getDate),
      Time(eMatchRequest.getTime),
      eMatchRequest.getLocation
    )
  }
}

trait MatchRequestFormat {
  implicit val format: OFormat[MatchRequest] = Json.format
}
