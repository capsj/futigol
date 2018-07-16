package utils

import javax.inject.Inject

import akka.actor._
import play.api.libs.mailer.{Email, MailerClient}

object EmailActor {
  def props: Props = Props[EmailActor]
  case class SendEmail(email: Email)
}

class EmailActor @Inject()(mailerClient: MailerClient) extends Actor {
  import EmailActor._

  def receive: PartialFunction[Any, Unit] = {
    case SendEmail(email: Email) =>
      mailerClient.send(email)
      sender() ! "Sent"
  }
}
