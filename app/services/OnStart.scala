package services

import javax.inject.{Inject, Singleton}

import models.domain.player.{Player, PlayerCreate}
import models.domain.team.{Team, TeamCreate}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

trait OnStart {
  def save(): Unit
}

@Singleton
class OnStartImpl @Inject() (appLifecycle: ApplicationLifecycle) extends OnStart {

  override def save(): Unit = {
    Player.getByEmail("jero@gmail.com") match {
      case Some(_) =>
      case None =>
        val jero = Player.saveOrUpdate(PlayerCreate("123", "jero@gmail.com", "Jerónimo", "Carlos", "Zona Norte", "1154549422", "Defensor").toPlayer())
        val pon = Player.saveOrUpdate(PlayerCreate("123", "pon@gmail.com", "Felipe", "Beláustegui", "Zona Norte", "1135849312", "Delantero").toPlayer())
        val ivan = Player.saveOrUpdate(PlayerCreate("123", "ivan@gmail.com", "Iván", "Macris", "Zona Norte", "1159452371", "Volante").toPlayer())
        val ancho = Player.saveOrUpdate(PlayerCreate("123", "ancho@gmail.com", "Santiago Ernesto", "De Anchorena", "Zona Norte", "1148573168", "Defensor").toPlayer())
        val marian = Player.saveOrUpdate(PlayerCreate("123", "marian@gmail.com", "Mariano", "Murad", "Zona Norte", "1159344562", "Defensor").toPlayer())
        val alan = Player.saveOrUpdate(PlayerCreate("123", "alan@gmail.com", "Alan", "Gil Hutton", "Zona Norte", "1152454234", "Delantero").toPlayer())
        val freddy = Player.saveOrUpdate(PlayerCreate("123", "freddy@gmail.com", "Federico", "Muller", "Zona Norte", "1152986912", "Volante").toPlayer())
        val larva = Player.saveOrUpdate(PlayerCreate("123", "larva@gmail.com", "Francisco", "Garcia Marra", "Zona Norte", "1155456532", "Delantero").toPlayer())
        val albaine = Player.saveOrUpdate(PlayerCreate("123", "albaine@gmail.com", "Tomas", "Albaine", "Zona Norte", "1152246843", "Arquero").toPlayer())
        val chino = Player.saveOrUpdate(PlayerCreate("123", "chino@gmail.com", "Juan Manuel", "Parada", "Zona Norte", "1143423242", "Volante").toPlayer())
        val albite = Player.saveOrUpdate(PlayerCreate("123", "albite@gmail.com", "Federico", "Albite", "Zona Norte", "1143242347", "Volante").toPlayer())
        val gordo = Player.saveOrUpdate(PlayerCreate("123", "gordo@gmail.com", "Tomás", "Macloughlin", "CABA", "1152684945", "Volante").toPlayer())
        val pipe = Player.saveOrUpdate(PlayerCreate("123", "pipe@gmail.com", "Felipe", "Videla", "CABA", "1152612312", "Volante").toPlayer())
        val wheeler = Player.saveOrUpdate(PlayerCreate("123", "wheeler@gmail.com", "Ignacio", "Wheeler", "CABA", "1158383942", "Volante").toPlayer())

        val guido = Player.saveOrUpdate(PlayerCreate("123", "guido@gmail.com", "Guido", "Giambruni", "CABA", "1134671234", "Volante").toPlayer())
        val gonza = Player.saveOrUpdate(PlayerCreate("123", "gonza@gmail.com", "Gonzalo", "Saavedra", "Zona Oeste", "1155244367", "Delantero").toPlayer())
        val javi = Player.saveOrUpdate(PlayerCreate("123", "javi@gmail.com", "Javier", "Morrone", "Zona Oeste", "1154245675", "Delantero").toPlayer())
        val recio = Player.saveOrUpdate(PlayerCreate("123", "fran@gmail.com", "Francisco", "Recio", "Zona Oeste", "1153236543", "Defensor").toPlayer())

        val juan = Player.saveOrUpdate(PlayerCreate("123", "juan@gmail.com", "Juan", "Zungri", "Zona Oeste", "1154324243", "Defensor").toPlayer())
        val emi = Player.saveOrUpdate(PlayerCreate("123", "emi@gmail.com", "Emiliano", "Holovatiuk", "Zona Oeste", "1154231212", "Defensor").toPlayer())
        val fer = Player.saveOrUpdate(PlayerCreate("123", "fer@gmail.com", "Fernando", "Zungri", "Zona Oeste", "1151234325", "Delantero").toPlayer())
        val conro = Player.saveOrUpdate(PlayerCreate("123", "conro@gmail.com", "Conrado", "Areas", "Zona Oeste", "1153129869", "Arquero").toPlayer())
        val laucha = Player.saveOrUpdate(PlayerCreate("123", "laucha@gmail.com", "Santiago", "Palmero", "Zona Oeste", "1168432423", "Volante").toPlayer())

        val pancho = Player.saveOrUpdate(PlayerCreate("123", "pancho@gmail.com", "Francisco", "Stefano", "Zona Sur", "1154123434", "Volante").toPlayer())
        val fede = Player.saveOrUpdate(PlayerCreate("123", "fede@gmail.com", "Federico", "Ruiz", "Zona Sur", "1135443543", "Volante").toPlayer())
        val converso = Player.saveOrUpdate(PlayerCreate("123", "converso@gmail.com", "Santiago", "Converso", "Zona Sur", "1154223466", "Arquero").toPlayer())
        val tincho = Player.saveOrUpdate(PlayerCreate("123", "tincho@gmail.com", "Martin", "Hierro", "Zona Sur", "1158986723", "Defensor").toPlayer())
        val berni = Player.saveOrUpdate(PlayerCreate("123", "berni@gmail.com", "Bernardo", "Aguinaga", "Zona Sur", "1156534234", "Defensor").toPlayer())
        val jc = Player.saveOrUpdate(PlayerCreate("123", "juancruz@gmail.com", "Juan Cruz", "Mazzochi", "Zona Sur", "1155423467", "Defensor").toPlayer())
        val nano = Player.saveOrUpdate(PlayerCreate("123", "nano@gmail.com", "Ignacio", "Flaiban", "Zona Sur", "1158584734", "Volante").toPlayer())
        val nachito = Player.saveOrUpdate(PlayerCreate("123", "nachitog@gmail.com", "Ignacio", "Gimenez", "Zona Sur", "1157842345", "Volante").toPlayer())
        val rado = Player.saveOrUpdate(PlayerCreate("123", "rado@gmail.com", "Martin", "Rado", "Zona Sur", "1159234894", "Volante").toPlayer())
        val chebi = Player.saveOrUpdate(PlayerCreate("123", "chebi@gmail.com", "Sebastian", "Molteni", "Zona Sur", "1152346293", "Volante").toPlayer())
        val marianito = Player.saveOrUpdate(PlayerCreate("123", "marianito@gmail.com", "Mariano", "Torres", "Zona Sur", "1157782394", "Delantero").toPlayer())
        val luquitas = Player.saveOrUpdate(PlayerCreate("123", "luquitas@gmail.com", "Lucas", "Muller", "Zona Sur", "1154234859", "Delantero").toPlayer())
        val marcus = Player.saveOrUpdate(PlayerCreate("123", "marcus@gmail.com", "Marcos", "Muller", "Zona Sur", "1158942342", "Delantero").toPlayer())

        val sanDiego = Team.saveOrUpdate(TeamCreate("San Diego", "Zona Oeste", 11).toTeam(guido))
        Team.addPlayer(sanDiego, gonza)
        Team.addPlayer(sanDiego, recio)
        Team.addPlayer(sanDiego, javi)

        val walkover = Team.saveOrUpdate(TeamCreate("Walkover FC", "Zona Norte", 7).toTeam(ivan))
        Team.addPlayer(walkover, jero)
        Team.addPlayer(walkover, pon)
        Team.addPlayer(walkover, ancho)
        Team.addPlayer(walkover, marian)
        Team.addPlayer(walkover, alan)
        Team.addPlayer(walkover, freddy)
        Team.addPlayer(walkover, larva)
        Team.addPlayer(walkover, chino)
        Team.addPlayer(walkover, albaine)

        val austral = Team.saveOrUpdate(TeamCreate("Austral", "Zona Sur", 11).toTeam(fede))
        Team.addPlayer(austral, pancho)
        Team.addPlayer(austral, jero)
        Team.addPlayer(austral, converso)
        Team.addPlayer(austral, tincho)
        Team.addPlayer(austral, berni)
        Team.addPlayer(austral, jc)
        Team.addPlayer(austral, nano)
        Team.addPlayer(austral, nachito)
        Team.addPlayer(austral, rado)
        Team.addPlayer(austral, chebi)
        Team.addPlayer(austral, marianito)
        Team.addPlayer(austral, luquitas)
        Team.addPlayer(austral, marcus)

        val dumbo = Team.saveOrUpdate(TeamCreate("Dumbo Africano", "Zona Norte", 5).toTeam(juan))
        Team.addPlayer(dumbo, conro)
        Team.addPlayer(dumbo, emi)
        Team.addPlayer(dumbo, fer)
        Team.addPlayer(dumbo, laucha)
        Team.addPlayer(dumbo, recio)

        val mistica = Team.saveOrUpdate(TeamCreate("Mistica 7", "Zona Norte", 7).toTeam(pon))
        Team.addPlayer(mistica, ivan)
        Team.addPlayer(mistica, pipe)
        Team.addPlayer(mistica, wheeler)
        Team.addPlayer(mistica, gordo)
        Team.addPlayer(mistica, chino)
        Team.addPlayer(mistica, freddy)
        Team.addPlayer(mistica, alan)
        Team.addPlayer(mistica, marian)


        val futigol = Team.saveOrUpdate(TeamCreate("Futigol", "Zona Norte", 7).toTeam(jero))
        Team.addPlayer(futigol, marian)
        Team.addPlayer(futigol, luquitas)
        Team.addPlayer(futigol, marcus)
        Team.addPlayer(futigol, converso)
        Team.addPlayer(futigol, pon)
        Team.addPlayer(futigol, gordo)
        Team.addPlayer(futigol, guido)
        Team.addPlayer(futigol, gonza)
        Team.addPlayer(futigol, javi)

        val techo = Team.saveOrUpdate(TeamCreate("Techo Frágil", "Zona Norte", 7).toTeam(ancho))
        Team.addPlayer(techo, javi)
        Team.addPlayer(techo, wheeler)
        Team.addPlayer(techo, albaine)
        Team.addPlayer(techo, albite)
        Team.addPlayer(techo, larva)
        Team.addPlayer(techo, nachito)
        Team.addPlayer(techo, rado)
        Team.addPlayer(techo, nano)

        val comanche = Team.saveOrUpdate(TeamCreate("Comanche", "Zona Norte", 7).toTeam(gordo))
        Team.addPlayer(comanche, pancho)
        Team.addPlayer(comanche, fede)
        Team.addPlayer(comanche, marianito)
        Team.addPlayer(comanche, marian)
        Team.addPlayer(comanche, gonza)
        Team.addPlayer(comanche, pipe)
        Team.addPlayer(comanche, conro)
        Team.addPlayer(comanche, laucha)
    }
  }

  def start(): Unit = {
    save()
  }

  appLifecycle.addStopHook { () =>
    Future.successful(())
  }

  start()
}
