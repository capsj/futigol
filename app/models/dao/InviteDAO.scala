package models.dao

import java.util.UUID

import models.domain.invite.Invite
import models.ebean.{Invite => EInvite}
import scala.collection.JavaConversions._

object InviteDAO {

  def toEbean(invite: Invite): EInvite = {
    new EInvite(
      invite.id,
      PlayerDAO.toEbean(invite.sender),
      PlayerDAO.toEbean(invite.receiver),
      TeamDAO.toEbean(invite.team),
      invite.answered,
      invite.requestType
    )
  }

  def save(invite: Invite): Invite = {
    val eInvite = toEbean(invite)
    eInvite.save()
    Invite(eInvite)
  }

  def checkJoinRequests(senderId: UUID, teamId: UUID): List[Invite] = {
    EInvite.checkJoinRequests(senderId, teamId).map(Invite.apply).toList
  }
}
