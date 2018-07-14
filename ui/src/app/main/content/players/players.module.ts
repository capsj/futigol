import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import {ReverseAuthGuard} from "../../../core/services/auth/reverse-auth-guard";
import {AuthGuard} from "../../../core/services/auth/auth-guard.service";
import {FuseNavigationService} from "../../../core/components/navigation/navigation.service";
import {FuseDemoModule} from "../../../core/components/demo/demo.module";
import {FusePipesModule} from "../../../core/pipes/pipes.module";
import {AutocompleterModule} from "../../../core/components/autocompleter/autocompleter.module";
import {PlayersComponent} from "./players.component";
import {PlayerInfoComponent} from "./player-info/player-info.component";

const routes = [
  {
    path: 'players',
    component: PlayersComponent,
  },
  {
    path: 'players/info/:id',
    // canActivate: [AuthGuard],
    component: PlayerInfoComponent
  }
];

@NgModule({
  declarations: [
    PlayersComponent,
    PlayerInfoComponent
  ],
  imports     : [
    SharedModule,
    RouterModule.forChild(routes),
    FuseDemoModule,
    FusePipesModule,
    AutocompleterModule
  ],
  exports     : [
    PlayersComponent
  ],
  providers: [
    ReverseAuthGuard,
    AuthGuard,
    FuseNavigationService
  ]
})

export class PlayersModule {
}
