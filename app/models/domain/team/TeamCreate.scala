package models.domain.team

import models.domain.Location
import models.domain.player.Player
import play.api.libs.json.{Json, OFormat}

case class TeamCreate(name: String, locationId: Long, size: Int, captainId: Long) {
  def toTeam(location: Location, player: Player): Team = {
    Team(None, name, location, size, player)
  }
}

object TeamCreate {
  implicit val teamFormat: OFormat[TeamCreate] = Json.format
}