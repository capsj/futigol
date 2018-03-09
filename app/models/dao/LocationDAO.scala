package models.dao

import models.domain.Location
import models.ebean.{Location => ELocation}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object LocationDAO {

  def toEbean(location: Location): ELocation = {
    new ELocation(
      if(location.id.isDefined) location.id.get else null,
      location.name
    )
  }

  def saveOrUpdate(location: Location): Location = {
    location.id match {
      case Some(id) =>
        val eLocation: ELocation = toEbean(location)
        eLocation.update()
        Location(eLocation)
      case None =>
        val eLocation: ELocation = toEbean(location)
        eLocation.save()
        Location(eLocation)
    }
  }

  def getById(id: Long): Option[Location] = {
    toScalaOption[ELocation](ELocation.getById(id)).map(Location.apply)
  }

  def getByName(name: String): Option[Location] = {
    toScalaOption[ELocation](ELocation.getByName(name)).map(Location.apply)
  }

  def getAll: List[Location] = {
    ELocation.getAll.map(Location.apply).toList
  }

  def delete(location: Location): Option[Boolean] = {
    location.id match {
      case Some(_) =>
        val eLocation: ELocation = toEbean(location)
        eLocation.delete()
        Some(true)
      case None => None
    }
  }

}
