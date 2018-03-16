package controllers

import models.domain.authentication.{CaseUser, UserLogged, UserLogin}
import models.domain.player.Player
import pdi.jwt.{JwtSession, _}
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

import scala.util.{Failure, Success, Try}

class LoginController extends Controller{

  def login = Action {
    request =>
      Try(request.body.asJson.get.as[UserLogin]) match {
        case Success(userLogin) =>
          Player.authenticate(userLogin) match {
            case Some(user) =>
              request.jwtSession -- "user"
              val caseUser = CaseUser.toCaseUser(user)
              val session = JwtSession() + ("user", caseUser)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Login Successful", Json.toJson(caseUser))
                )
              ).withNewJwtSession.withJwtSession(session).withSession()
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "Wrong credentials")
                )
              )
          }
        case Failure(e) =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(BAD_REQUEST, "Missing data")
            )
          )
      }
  }

  def logout() = Action {
    request =>
      request.jwtSession -- "user"
      Ok(
        Json.toJson(
          ResponseGenerated(OK, "Logout Successful")
        )
      ).withNewSession
  }

  def loggedData() = Action(
    request =>
      request.jwtSession.getAs[CaseUser]("user") match {
        case Some(user) =>
          Player.getById(user.id) match {
            case Some(userAux)=>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK,
                    "Logged",
                    Json.toJson(
                      UserLogged(
                        Some(
                          CaseUser.toCaseUser(userAux)
                        ),
                        isLogged = true
                      )
                    )
                  )
                )
              )
            case None=>
              InternalServerError(
                Json.toJson(
                  ResponseGenerated(
                    INTERNAL_SERVER_ERROR,
                    "Server Error",
                    Json.toJson(
                      UserLogged(
                        None,
                        isLogged = false
                      )
                    )
                  )
                )
              )
          }
        case _ =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST,
                "Not Logged",
                Json.toJson(
                  UserLogged(
                    None,
                    isLogged = false
                  )
                )
              )
            )
          )
      }
  )

}
