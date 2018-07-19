import {Component, HostBinding, OnInit} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import {AuthService} from "../../core/services/auth/auth.service";
import {Subscription} from "rxjs/Subscription";
import {PlayerService} from "../../core/services/player.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {FuseConfirmDialogComponent} from "../../core/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit
{

    showLoadingBar: boolean;
    horizontalNav: boolean;
    name: any;
    notifications: any[];
    fuseSettings: any;
    onSettingsChanged: Subscription;
    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private translate: TranslateService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private authService: AuthService,
        private playerService: PlayerService
    )
    {

      this.onSettingsChanged =
        this.fuseConfig.onSettingsChanged
          .subscribe(
            (newSettings) => {
              this.fuseSettings = newSettings;
              this.layoutMode = this.fuseSettings.layout.mode;
            }
          );

      router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });
    }

    ngOnInit(): void {
      this.name = '';
      this.notifications = [];
      this.authService.loggedUser.then(res => {
        this.name = res.name;
        this.playerService.getNotifications(res.id).then(notifications => {
          this.notifications = notifications
        })
      }).catch(err => {
        this.name = '';
      });
    }

    toProfile() {
      this.router.navigate(['profile'])
    }

    logout() {
      this.authService.logout().then(() => {
        this.router.navigate(['login']);
      }).catch(err => {});
    }

    openJoinDialog(notification) {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        data: {
          confirmMessage: notification.sender.name + notification.sender.lastName + ' quiere unirse a ' + notification.team.name,
          confirmButton: {
            text: 'ACEPTAR',
            colour: 'accent'
          },
          rejectButton: {
            text: 'RECHAZAR',
            colour: 'warn'
          }
        }
      });
      dialogRef.afterClosed().subscribe(
        (data: boolean) => {
          if(data === undefined) {}
          else if (data) {
            this.playerService.acceptInvite(notification.id).then( res => {
              if(res) {
                this.notifications = this.notifications.filter(p => p.id !== notification.id);
                this.snackBar.open('El jugador fue agregado al equipo exitosamente.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }
            }).catch(err => {
              this.snackBar.open('Hubo un error al aceptar la petición. Por favor, inténtelo nuevamente.', '', {
                duration: 5000,
                verticalPosition: 'top'
              });
            });
          } else {
            this.playerService.rejectInvite(notification.id).then( res => {
              if(res) {
                this.notifications = this.notifications.filter(p => p.id !== notification.id);
                this.snackBar.open('La petición del jugador fue rechazada con éxito.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }
            }).catch(err => {
              this.snackBar.open('Hubo un error al rechazar la petición. Por favor, inténtelo nuevamente.', '', {
                duration: 5000,
                verticalPosition: 'top'
              });
            });
          }
        }
      );
    }

    openInviteDialog(notification) {
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
        data: {
          confirmMessage: notification.sender.name + notification.sender.lastName + ' te invitó a unirte a ' + notification.team.name,
          confirmButton: {
            text: 'ACEPTAR',
            colour: 'accent'
          },
          rejectButton: {
            text: 'RECHAZAR',
            colour: 'warn'
          }
        }
      });
      dialogRef.afterClosed().subscribe(
        (data: boolean) => {
          if(data === undefined) {}
          else if (data) {
            this.playerService.acceptTeamInvite(notification.id).then( res => {
              if(res) {
                this.notifications = this.notifications.filter(p => p.id !== notification.id);
                this.snackBar.open('Fuiste agregado al equipo exitosamente.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }
            }).catch(err => {
              this.snackBar.open('Hubo un error al aceptar la invitación. Por favor, inténtelo nuevamente.', '', {
                duration: 5000,
                verticalPosition: 'top'
              });
            });
          } else {
            this.playerService.rejectInvite(notification.id).then( res => {
              if(res) {
                this.notifications = this.notifications.filter(p => p.id !== notification.id);
                this.snackBar.open('La invitación fue rechazada con éxito.', '', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }
            }).catch(err => {
              this.snackBar.open('Hubo un error al rechazar la invitación. Por favor, inténtelo nuevamente.', '', {
                duration: 5000,
                verticalPosition: 'top'
              });
            });
          }
        }
      );
    }
}
