package models.dao

import models.domain.TeamPlayer
import models.ebean.{TeamPlayer => ETeamPlayer}

object TeamPlayerDAO {

  def toEbean(teamPlayer: TeamPlayer): ETeamPlayer = {
    new ETeamPlayer(
      if(teamPlayer.id.isDefined) teamPlayer.id.get else null,
      PlayerDAO.toEbean(teamPlayer.player),
      TeamDAO.toEbean(teamPlayer.team),
      teamPlayer.isCaptain
    )
  }
}
