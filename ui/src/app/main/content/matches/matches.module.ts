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
import {FuseAngularMaterialModule} from "../components/angular-material/angular-material.module";
import { CalendarModule } from 'angular-calendar';
import {FuseCalendarEventFormDialogComponent} from "./confirmed/event-form/event-form.component";
import {CalendarService} from './confirmed/calendar.service';

const routes = [
  {
    path: 'matches',
    canActivate: [AuthGuard],
    component: MatchesComponent,
    children: [
      {
        path: 'confirmed',
        component: ConfirmedComponent
      },
      {
        path: 'pending',
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
    FuseCalendarEventFormDialogComponent
  ],
  imports     : [
    SharedModule,
    RouterModule.forChild(routes),
    FuseDemoModule,
    FusePipesModule,
    AutocompleterModule,
    FuseAngularMaterialModule,
    CalendarModule.forRoot()

  ],
  exports     : [
    MatchesComponent
  ],
  providers: [
    ReverseAuthGuard,
    AuthGuard,
    FuseNavigationService,
    CalendarService
  ],
  entryComponents: [FuseCalendarEventFormDialogComponent]
})

export class MatchesModule {
}
