package services

import javax.inject.{Inject, Singleton}

import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

trait OnStart {
  def save(): Unit
}

@Singleton
class OnStartImpl @Inject() (appLifecycle: ApplicationLifecycle) extends OnStart {

  override def save(): Unit = {
    print("capo")
  }

  def start(): Unit = {
    save()
  }

  appLifecycle.addStopHook { () =>
    Future.successful(())
  }

  start()
}
