package models.domain

import models.dao.LocationDAO
import play.api.libs.json.{Json, OFormat}
import models.ebean.{Location => ELocation}

case class Location(id: Option[Long], name: String)

object Location extends LocationFormat {
  def apply(eLocation: ELocation): Location = {
    Location(Some(eLocation.getId), eLocation.getName)
  }

  def saveOrUpdate(location: Location): Location = {
    LocationDAO.saveOrUpdate(location)
  }

  def getById(id: Long): Option[Location] = {
    LocationDAO.getById(id)
  }

  def getByName(name: String): Option[Location] = {
    LocationDAO.getByName(name)
  }

  def getAll: List[Location] = {
    LocationDAO.getAll
  }

  def delete(location: Location): Option[Boolean] = {
    LocationDAO.delete(location)
  }

}

trait LocationFormat {
  implicit val locationFormat: OFormat[Location] = Json.format[Location]
}