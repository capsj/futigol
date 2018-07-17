import {Component, HostBinding, OnInit} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import {AuthService} from "../../core/services/auth/auth.service";
import {Subscription} from "rxjs/Subscription";

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
    fuseSettings: any;
    onSettingsChanged: Subscription;
    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private translate: TranslateService,
        private authService: AuthService
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
      this.authService.loggedUser.then(res => {
        this.name = res.name;
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
}
