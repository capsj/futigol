package models.dao

import models.domain.invite.Invite
import models.ebean.{Invite => EInvite}

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
}
