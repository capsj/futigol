package models.dao

import java.util.UUID

import models.domain.invite.Invite
import models.ebean.{Invite => EInvite}
import utils.ScalaOptional.toScalaOption

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

  def getPlayerNotifications(receiver: UUID): List[Invite] = {
    EInvite.getPlayerNotifications(receiver).map(Invite.apply).toList
  }

  def accept(invite: Invite) = {
    val eInvite = toEbean(invite.copy(answered = true))
    eInvite.update()
    TeamDAO.addPlayer(invite.team, invite.sender)
  }

  def acceptTeamInvite(invite: Invite) = {
    val eInvite = toEbean(invite.copy(answered = true))
    eInvite.update()
    TeamDAO.addPlayer(invite.team, invite.receiver)
  }

  def reject(invite: Invite) = {
    val eInvite = toEbean(invite.copy(answered = true))
    eInvite.update()
  }

  def getById(id: UUID): Option[Invite] = {
    toScalaOption[EInvite](EInvite.getById(id)).map(Invite.apply)
  }

}
