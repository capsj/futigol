package models.domain.matchRequest

import java.util.UUID

import models.dao.MatchRequestDAO
import models.domain.team.Team
import models.domain.util.{Date, Time}
import models.ebean.{MatchRequest => EMatchRequest}
import play.api.libs.json.{Json, OFormat}

case class MatchRequest(id: UUID, sender: Team, receiver: Team, date: Date, time: Time, location: String, state: String)

object MatchRequest extends MatchRequestFormat {
  def apply(eMatchRequest: EMatchRequest): MatchRequest = {
    MatchRequest(
      eMatchRequest.getId,
      Team(eMatchRequest.getSender),
      Team(eMatchRequest.getReceiver),
      Date(eMatchRequest.getDate),
      Time(eMatchRequest.getTime),
      eMatchRequest.getLocation,
      eMatchRequest.getState
    )
  }

  def apply(requestCreate: RequestCreate, sender: Team, receiver: Team): MatchRequest = {
    MatchRequest(UUID.randomUUID(), sender, receiver, requestCreate.date, requestCreate.time, requestCreate.location, RequestState.SENT.value)
  }

  def save(matchRequest: MatchRequest): MatchRequest = {
    MatchRequestDAO.save(matchRequest)
  }

  def update(matchRequest: MatchRequest): MatchRequest = {
    MatchRequestDAO.update(matchRequest)
  }

  def checkRequests(matchRequest: MatchRequest): List[MatchRequest] = {
    MatchRequestDAO.checkRequests(matchRequest)
  }

  def getPendingRequests(senderId: UUID): List[MatchRequest] = {
    MatchRequestDAO.getPendingRequests(senderId)
  }

  def getConfirmedRequests(senderId: UUID): List[MatchRequest] = {
    MatchRequestDAO.getConfirmedRequests(senderId)
  }

  def getById(requestId: UUID): Option[MatchRequest] = {
    MatchRequestDAO.getById(requestId: UUID)
  }
}

trait MatchRequestFormat {
  implicit val format: OFormat[MatchRequest] = Json.format
}
