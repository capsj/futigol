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
import {MyTeamsComponent} from "./my-teams/my-teams.component";
import {TeamInfoComponent} from "./team-info/team-info.component";
import {SearchTeamComponent} from "./search-team/search-team.component";

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
      {
        path: 'general',
        // canActivate: [AuthGuard],
        component: MyTeamsComponent
      },
      {
        path: 'info/:id',
        // canActivate: [AuthGuard],
        component: TeamInfoComponent
      },
      {
        path: 'search',
        // canActivate: [AuthGuard],
        component: SearchTeamComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    TeamComponent,
    CreateTeamComponent,
    MyTeamsComponent,
    TeamInfoComponent,
    SearchTeamComponent
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
