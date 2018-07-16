package models.dao

import models.domain.matchRequest.MatchRequest
import models.ebean.{MatchRequest => EMatchRequest}
import scala.collection.JavaConversions._

object MatchRequestDAO {

  def toEbean(matchRequest: MatchRequest): EMatchRequest = {
    new EMatchRequest(
      matchRequest.id,
      TeamDAO.toEbean(matchRequest.sender),
      TeamDAO.toEbean(matchRequest.receiver),
      matchRequest.date.toDateTime,
      matchRequest.time.toDateTime(matchRequest.date),
      matchRequest.location
    )
  }

  def save(matchRequest: MatchRequest): MatchRequest = {
    val eMatchRequest = toEbean(matchRequest)
    eMatchRequest.save()
    MatchRequest(eMatchRequest)
  }

  def checkRequests(matchRequest: MatchRequest): List[MatchRequest] = {
    EMatchRequest.checkRequests(matchRequest.receiver.id, matchRequest.date.toDateTime, matchRequest.time.toDateTime(matchRequest.date))
      .map(MatchRequest.apply).toList
  }

}
