import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import {ReverseAuthGuard} from "../../../core/services/auth/reverse-auth-guard";
import {AuthGuard} from "../../../core/services/auth/auth-guard.service";
import {FuseNavigationService} from "../../../core/components/navigation/navigation.service";
import {FuseDemoModule} from "../../../core/components/demo/demo.module";
import {FusePipesModule} from "../../../core/pipes/pipes.module";
import {AutocompleterModule} from "../../../core/components/autocompleter/autocompleter.module";
import {MatchesComponent} from "./matches.component";
import {ConfirmedComponent} from "./confirmed/confirmed.component";
import {PendingComponent} from "./pending/pending.component";

const routes = [
  {
    path: 'matches',
    component: MatchesComponent,
    children: [
      {
        path: 'create',
        // canActivate: [AuthGuard],
        component: ConfirmedComponent
      },
      {
        path: 'general',
        // canActivate: [AuthGuard],
        component: PendingComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    MatchesComponent,
    ConfirmedComponent,
    PendingComponent,
  ],
  imports     : [
    SharedModule,
    RouterModule.forChild(routes),
    FuseDemoModule,
    FusePipesModule,
    AutocompleterModule
  ],
  exports     : [
    MatchesComponent
  ],
  providers: [
    ReverseAuthGuard,
    AuthGuard,
    FuseNavigationService
  ]
})

export class MatchesModule {
}
