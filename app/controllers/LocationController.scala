package controllers

import models.domain.Location
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

class LocationController extends Controller {

  def register = Action {
    request =>
      request.body.asJson.get.asOpt[Location] match {
        case Some(location) =>
          Location.getByName(location.name) match {
            case Some(_) =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Name already in use"
                  )
                )
              )
            case None =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Location saved", Json.toJson(Location.saveOrUpdate(location))
                  )
                )
              )

          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def delete(id: Long) = Action {
    Location.getById(id) match {
      case Some(location) =>
        Location.delete(location) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Location deleted"
                )
              )
            )
          case _ =>
            BadRequest(
              Json.toJson(
                ResponseGenerated(
                  BAD_REQUEST, "Delete error"
                )
              )
            )
        }
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No location for that id"
            )
          )
        )
    }
  }

  def getById(id: Long) = Action {
    Location.getById(id) match {
      case Some(location) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Location found", Json.toJson(location)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No location for that id"
            )
          )
        )
    }
  }

  def getByName(name: String) = Action {
    Location.getByName(name) match {
      case Some(location) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Location found", Json.toJson(location)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No location with that username"
            )
          )
        )
    }
  }

  def getAll = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All locations", Json.toJson(Location.getAll)
        )
      )
    )
  }

}