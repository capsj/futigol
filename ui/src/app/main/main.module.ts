import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../core/modules/shared.module';

import { FuseMainComponent } from './main.component';
import { FuseContentComponent } from './content/content.component';
import { FuseNavbarVerticalComponent } from './navbar/vertical/navbar-vertical.component';
import { FuseToolbarComponent } from './toolbar/toolbar.component';
import { FuseNavigationModule } from '../core/components/navigation/navigation.module';
import { FuseNavbarVerticalToggleDirective } from './navbar/vertical/navbar-vertical-toggle.directive';
import { FuseNavbarHorizontalComponent } from './navbar/horizontal/navbar-horizontal.component';
import {LoginModule} from "./content/login/login.module";
import {LoginComponent} from "./content/login/login.component";
import {RegisterComponent} from "./content/register/register.component";
import {RegisterModule} from "./content/register/register.module";
import {ReverseAuthGuard} from "../core/services/auth/reverse-auth-guard";
import {TeamModule} from "./content/team/team.module";
import {PlayersModule} from "./content/players/players.module";
import {DialogContentComponent} from "../core/components/dialog/dialog-content.component";

const routes = [
  {
    path     : 'login',
    canActivate: [ReverseAuthGuard],
    component: LoginComponent
  },
  {
    path     : 'register',
    canActivate: [ReverseAuthGuard],
    component: RegisterComponent
  }
];

@NgModule({
    declarations: [
        FuseContentComponent,
        FuseMainComponent,
        FuseNavbarVerticalComponent,
        FuseNavbarHorizontalComponent,
        FuseToolbarComponent,
        FuseNavbarVerticalToggleDirective,
        DialogContentComponent
    ],
    imports     : [
        SharedModule,
        RouterModule,
        FuseNavigationModule,
        RouterModule.forChild(routes),
        LoginModule,
        RegisterModule,
        TeamModule,
        PlayersModule
    ],
    exports     : [
        FuseMainComponent
    ],
    providers : [
      ReverseAuthGuard,
    ],
    entryComponents: [DialogContentComponent]
})

export class FuseMainModule
{
}
