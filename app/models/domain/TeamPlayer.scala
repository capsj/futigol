package models.domain

import java.util.UUID

import models.domain.player.Player
import models.domain.team.Team
import play.api.libs.json.{Json, OFormat}
import models.ebean.{TeamPlayer => ETeamPlayer}

case class TeamPlayer(id: Option[UUID], player: Player, team: Team, isCaptain: Boolean)

object TeamPlayer {
  implicit val format: OFormat[TeamPlayer] = Json.format

  def apply(eTeamPlayer: ETeamPlayer): TeamPlayer = {
    TeamPlayer(Option(eTeamPlayer.getId), Player(eTeamPlayer.getPlayer), Team(eTeamPlayer.getTeam), eTeamPlayer.isCaptain)
  }
}