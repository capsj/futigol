import scala.language.postfixOps

name := "futigol"

version := "1.0"

lazy val root = (project in file(".")).enablePlugins(PlayScala).enablePlugins(PlayEbean)

scalaVersion := "2.11.11"

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  filters,
  "mysql" % "mysql-connector-java" % "6.0.4",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "com.pauldijou" %% "jwt-play" % "0.9.0",
  "com.typesafe.play" %% "play-mailer" % "6.0.1",
  "com.typesafe.play" %% "play-mailer-guice" % "6.0.1",
  "com.typesafe.akka" %% "akka-actor" % "2.2-M1"
)

//fork in run := true
//
//val Success = 0 // 0 exit code
//val Error = 1 // 1 exit code
//
//PlayKeys.playRunHooks += baseDirectory.map(UIBuild.apply).value
//
//val isWindows = System.getProperty("os.name").toLowerCase().contains("win")
//
//def runScript(script: String)(implicit dir: File): Int = {
//  if(isWindows){ Process("cmd /c " + script, dir) } else { Process(script, dir) } }!
//
//def uiWasInstalled(implicit dir: File): Boolean = (dir / "node_modules").exists()
//
//def runNpmInstall(implicit dir: File): Int =
//  if (uiWasInstalled) Success else runScript("npm install")
//
//def ifUiInstalled(task: => Int)(implicit dir: File): Int =
//  if (runNpmInstall == Success) task
//  else Error
//
//def runProdBuild(implicit dir: File): Int = ifUiInstalled(runScript("npm run build-prod"))
//
//def runDevBuild(implicit dir: File): Int = ifUiInstalled(runScript("npm run build"))
//
//def runUiTests(implicit dir: File): Int = ifUiInstalled(runScript("npm run test-no-watch"))
//
//lazy val `ui-dev-build` = TaskKey[Unit]("Run UI build when developing the application.")
//
//`ui-dev-build` := {
//  implicit val UIroot: File = baseDirectory.value / "ui"
//  if (runDevBuild != Success) throw new Exception("Oops! UI Build crashed.")
//}
//
//lazy val `ui-prod-build` = TaskKey[Unit]("Run UI build when packaging the application.")
//
//`ui-prod-build` := {
//  implicit val UIroot: File = baseDirectory.value / "ui"
//  if (runProdBuild != Success) throw new Exception("Oops! UI Build crashed.")
//}
//
//lazy val `ui-test` = TaskKey[Unit]("Run UI tests when testing application.")
//
//`ui-test` := {
//  implicit val UIroot: File = baseDirectory.value / "ui"
//  if (runUiTests != 0) throw new Exception("UI tests failed!")
//}
//
//`ui-test` := (`ui-test` dependsOn `ui-dev-build`).value
//
//dist := (dist dependsOn `ui-prod-build`).value
//
//stage := (stage dependsOn `ui-prod-build`).value
//
//test := ((test in Test) dependsOn `ui-test`).value