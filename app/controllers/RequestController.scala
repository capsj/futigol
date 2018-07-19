package controllers

import java.util.UUID
import javax.inject.{Inject, Named}

import akka.actor.ActorRef
import akka.util.Timeout
import models.domain.invite.Invite
import models.domain.matchRequest.{MatchRequest, RequestState}
import play.api.libs.json.Json
import play.api.libs.mailer.Email
import play.api.mvc.{Action, Controller}
import utils.EmailActor.SendEmail
import utils.ResponseGenerated

import scala.concurrent.duration._
import utils.EmailActor.SendEmail
import akka.pattern.ask
import akka.util.Timeout

class RequestController @Inject() (@Named("futigol-email") emailActor: ActorRef) extends Controller {

  implicit val timeout: Timeout = 300.seconds

  def acceptRequestByMail(requestId: UUID) = Action {
    Invite.getById(requestId) match {
      case Some(matchRequest) =>
        if(!matchRequest.answered) {
          Invite.accept(matchRequest)
          Redirect("http://localhost:9000/team/general")
        } else {
          Redirect("http://localhost:9000/team/general")
        }
      case None => BadRequest
    }
  }

  def acceptRequest(requestId: UUID) = Action {
    Invite.getById(requestId) match {
      case Some(matchRequest) =>
        if(!matchRequest.answered) {
          Invite.accept(matchRequest)
          Ok(
            Json.toJson(
              ResponseGenerated(
                OK, "Request accepted"
              )
            )
          )
        } else {
          Ok(
            Json.toJson(
              ResponseGenerated(
                OK, "Request accepted"
              )
            )
          )
        }
      case None => BadRequest
    }
  }

  def rejectRequest(requestId: UUID) = Action {
    Invite.getById(requestId) match {
      case Some(matchRequest) =>
        if(!matchRequest.answered) {
          Invite.reject(matchRequest)
          Ok(
            Json.toJson(
              ResponseGenerated(
                OK, "Request rejected"
              )
            )
          )
        } else {
          Ok(
            Json.toJson(
              ResponseGenerated(
                OK, "Request rejecter"
              )
            )
          )
        }
      case None => BadRequest
    }
  }

  def acceptInviteByMail(inviteId: UUID) = Action {
    Invite.getById(inviteId) match {
      case Some(teamInvite) =>
        if(!teamInvite.answered) {
          Invite.acceptTeamInvite(teamInvite)
          Redirect("http://localhost:9000/team/general")
        } else {
          Redirect("http://localhost:9000/team/general")
        }
      case None => BadRequest
    }
  }

  def acceptInvite(inviteId: UUID) = Action {
    Invite.getById(inviteId) match {
      case Some(teamInvite) =>
        if(!teamInvite.answered) {
          Invite.acceptTeamInvite(teamInvite)
          Ok(
            Json.toJson(
              ResponseGenerated(
                OK, "Invite accepted"
              )
            )
          )
        } else {
          Ok(
            Json.toJson(
              ResponseGenerated(
                OK, "Invite accepted"
              )
            )
          )
        }
      case None => BadRequest
    }
  }

  def acceptMatchRequestByMail(requestId: UUID) = Action {
    MatchRequest.getById(requestId) match {
      case Some(matchRequest) =>
        if (matchRequest.state == RequestState.REJECTED.value) BadRequest
        else {
          MatchRequest.update(matchRequest.copy(state = RequestState.CONFIRMED.value))
          val email = Email(
            "Confirmación de partido",
            "info@futigol.com <from@email.com>",
            Seq(matchRequest.receiver.captain.email, matchRequest.sender.captain.email),
            bodyHtml = Some("<html>\n" +
              "<head>\n" +
              "    <meta http-equiv=\"Content-Type\" content=\"text/html\" charset=\"utf-8\">\n" +
              "</head>\n" + "<body style=\"font-family: Helvetica Light, Helvetica, sans-serif\">\n" +
              "<div id=\"full-container\" style=\"width: 90%; margin: 20px auto; ;border: solid 1px #EFEFEF\">\n" +
              "    <div>\n" +
              "        <div style=\"padding: 20px\">\n" +
              "            <h2>Futigol</h2>\n" +
              "            <p>Se confirmó el partido entre " + matchRequest.receiver.name + " y " + matchRequest.sender.name + " para jugar el " + matchRequest.date.toDateString + " en " + matchRequest.location + "</p>\n" +
              "            <p>Inicia sesión para ver tu calendario</p>\n" +
              "            <p><a href= \"http://localhost:9000/login\">Iniciar Sesión</a>" +
              "            <p>Saludos!</p>" +
              "        </div>\n" +
              "    </div>\n" +
              "</body>\n" +
              "</html>")
          )
          emailActor ? SendEmail(email)
          Redirect("http://localhost:9000/matches/confirmed")
        }
      case None => BadRequest
    }
  }

  def rejectMatchRequestByMail(requestId: UUID) = Action {
    MatchRequest.getById(requestId) match {
      case Some(matchRequest) =>
        if (matchRequest.state == RequestState.CONFIRMED.value) BadRequest
        else {
          MatchRequest.update(matchRequest.copy(state = RequestState.REJECTED.value))
          val email = Email(
            "Rechazo de partido",
            "info@futigol.com <from@email.com>",
            Seq(matchRequest.sender.captain.email),
            bodyHtml = Some("<html>\n" +
              "<head>\n" +
              "    <meta http-equiv=\"Content-Type\" content=\"text/html\" charset=\"utf-8\">\n" +
              "</head>\n" + "<body style=\"font-family: Helvetica Light, Helvetica, sans-serif\">\n" +
              "<div id=\"full-container\" style=\"width: 90%; margin: 20px auto; ;border: solid 1px #EFEFEF\">\n" +
              "    <div>\n" +
              "        <div style=\"padding: 20px\">\n" +
              "            <h2>Futigol</h2>\n" +
              "            <p>El partido con " + matchRequest.receiver.name + " para jugar el " + matchRequest.date.toDateString + " en " + matchRequest.location + " fue rechazado.</p>\n" +
              "            <p>Inicia sesión para ver tu calendario</p>\n" +
              "            <p><a href= \"http://localhost:9000/login\">Iniciar Sesión</a>" +
              "            <p>Saludos!</p>" +
              "        </div>\n" +
              "    </div>\n" +
              "</body>\n" +
              "</html>")
          )
          emailActor ? SendEmail(email)
          Redirect("http://localhost:9000/team/general")
      }
      case None => BadRequest
    }
  }
}
