package controllers.authentication

import models.domain.authentication.CaseUser
//import models.domain.user.Permission
import pdi.jwt._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.Future


class AuthenticatedRequest[A](val user: CaseUser, request: Request[A]) extends WrappedRequest[A](request)

object AuthenticatedAction extends ActionBuilder[AuthenticatedRequest] {
  def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A]=> Future[Result]): Future[Result] =
    request.jwtSession.getAs[CaseUser]("user") match {
      case Some(user) => block(new AuthenticatedRequest(user, request)).map(_.refreshJwtSession(request))
      case _ => Future.successful(Unauthorized)
    }
}
//
//case class UserAction(permissions: List[Permission]) extends ActionBuilder[AuthenticatedRequest] {
//  def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A]=> Future[Result]): Future[Result] =
//    request.jwtSession.getAs[CaseUser]("user") match {
//      case Some(user) =>
//        if(permissions.exists(Permission.getUserPermissions(user.id).contains)) block(new AuthenticatedRequest(user, request)).map(_.refreshJwtSession(request))
//        else Future.successful(Unauthorized)
//      case _ => Future.successful(Unauthorized)
//    }
//}