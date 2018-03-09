package models.domain.matchRequest

import models.domain.Location
import models.domain.team.Team
import models.domain.util.{Date, Time}
import play.api.libs.json.{Json, OFormat}
import models.ebean.{MatchRequest => EMatchRequest}

case class MatchRequest(id: Option[Long], sender: Team, receiver: Team, date: Date, time: Time, location: Location)

object MatchRequest extends MatchRequestFormat {
  def apply(eMatchRequest: EMatchRequest): MatchRequest = {
    MatchRequest(
      Some(eMatchRequest.getId),
      Team(eMatchRequest.getSender),
      Team(eMatchRequest.getReceiver),
      Date(eMatchRequest.getDate),
      Time(eMatchRequest.getTime),
      Location(eMatchRequest.getLocation)
    )
  }
}

trait MatchRequestFormat {
  implicit val format: OFormat[MatchRequest] = Json.format
}
