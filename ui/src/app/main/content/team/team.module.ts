import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import {ReverseAuthGuard} from "../../../core/services/auth/reverse-auth-guard";
import {AuthGuard} from "../../../core/services/auth/auth-guard.service";
import {FuseNavigationService} from "../../../core/components/navigation/navigation.service";
import {FuseDemoModule} from "../../../core/components/demo/demo.module";
import {FusePipesModule} from "../../../core/pipes/pipes.module";
import {AutocompleterModule} from "../../../core/components/autocompleter/autocompleter.module";
import {TeamComponent} from "./team.component";
import {CreateTeamComponent} from "./create-team/create-team.component";

const routes = [
  {
    path: 'team',
    component: TeamComponent,
    children: [
      {
        path: 'create',
        // canActivate: [AuthGuard],
        component: CreateTeamComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    TeamComponent,
    CreateTeamComponent
  ],
  imports     : [
    SharedModule,
    RouterModule.forChild(routes),
    FuseDemoModule,
    FusePipesModule,
    AutocompleterModule
  ],
  exports     : [
    TeamComponent
  ],
  providers: [
    ReverseAuthGuard,
    AuthGuard,
    FuseNavigationService
  ]
})

export class TeamModule {
}
