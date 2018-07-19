package models.domain.invite

import java.util.UUID

import models.dao.InviteDAO
import models.domain.player.Player
import models.domain.team.Team
import play.api.libs.json.{Json, OFormat}
import models.ebean.{Invite => EInvite}

case class Invite(id: UUID, sender: Player, receiver: Player, team: Team, answered: Boolean, requestType: String)

object Invite {
  implicit val format: OFormat[Invite] = Json.format
  
  def apply(eInvite: EInvite): Invite = {
    Invite(eInvite.getId, Player(eInvite.getSender), Player(eInvite.getReceiver), Team(eInvite.getTeam), eInvite.isAnswered, eInvite.getType)
  }
  
  def save(sender: Player, receiver: Player, team: Team, requestType: String): Invite = {
    InviteDAO.save(Invite(UUID.randomUUID(), sender, receiver, team, false, requestType))
  }

  def checkJoinRequests(senderId: UUID, teamId: UUID): List[Invite] = {
    InviteDAO.checkJoinRequests(senderId, teamId)
  }

  def getPlayerNotifications(receiver: UUID): List[Invite] = {
    InviteDAO.getPlayerNotifications(receiver)
  }

  def getById(id: UUID): Option[Invite] = {
    InviteDAO.getById(id)
  }

  def accept(invite: Invite) = {
    InviteDAO.accept(invite)
  }

  def acceptTeamInvite(invite: Invite) = {
    InviteDAO.acceptTeamInvite(invite)
  }


  def reject(invite: Invite) = {
    InviteDAO.reject(invite)
  }
}
