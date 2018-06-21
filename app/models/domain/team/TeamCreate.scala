package models.domain.team

import models.domain.player.Player
import play.api.libs.json.{Json, OFormat}

case class TeamCreate(name: String, location: String, size: Int) {
  def toTeam(player: Player): Team = {
    Team(None, name, location, size, player)
  }
}

object TeamCreate {
  implicit val teamFormat: OFormat[TeamCreate] = Json.format
}