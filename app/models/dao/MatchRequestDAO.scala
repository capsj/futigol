package models.dao

import java.util.UUID

import models.domain.matchRequest.MatchRequest
import models.domain.team.Team
import models.ebean.{MatchRequest => EMatchRequest}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object MatchRequestDAO {

  def toEbean(matchRequest: MatchRequest): EMatchRequest = {
    new EMatchRequest(
      matchRequest.id,
      TeamDAO.toEbean(matchRequest.sender),
      TeamDAO.toEbean(matchRequest.receiver),
      matchRequest.date.toDateTime,
      matchRequest.time.toDateTime(matchRequest.date),
      matchRequest.location,
      matchRequest.state
    )
  }

  def save(matchRequest: MatchRequest): MatchRequest = {
    val eMatchRequest = toEbean(matchRequest)
    eMatchRequest.save()
    MatchRequest(eMatchRequest)
  }

  def update(matchRequest: MatchRequest): MatchRequest = {
    val eMatchRequest = toEbean(matchRequest)
    eMatchRequest.update()
    MatchRequest(eMatchRequest)
  }

  def checkRequests(matchRequest: MatchRequest): List[MatchRequest] = {
    EMatchRequest.checkRequests(matchRequest.receiver.id, matchRequest.date.toDateTime, matchRequest.time.toDateTime(matchRequest.date))
      .map(MatchRequest.apply).toList
  }

  def getPendingRequests(senderId: UUID): List[MatchRequest] = {
    EMatchRequest.getPendingRequests(senderId).map(MatchRequest.apply).toList
  }

  def getConfirmedRequests(senderId: UUID): List[MatchRequest] = {
    EMatchRequest.getConfirmedRequests(senderId).map(MatchRequest.apply).toList
  }

  def getById(id: UUID): Option[MatchRequest] = {
    toScalaOption[EMatchRequest](EMatchRequest.getById(id)).map(MatchRequest.apply)
  }

}
