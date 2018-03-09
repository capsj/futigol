import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { CookieService }   from 'angular2-cookie/services/cookies.service';
import {AppComponent} from './app.component';
import {AuthService} from './auth/auth.service';
import {DOMService} from './shared/dom.service';
import {HttpService} from "./shared/services/http.service";
import {APP_BASE_HREF} from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FuseFakeDbService } from './fuse-fake-db/fuse-fake-db.service';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { AppStoreModule } from './store/store.module';

const appRoutes: Routes = [
  {
    path        : 'apps',
    loadChildren: './main/content/apps/apps.module#FuseAppsModule'
  },
  {
    path        : 'pages',
    loadChildren: './main/content/pages/pages.module#FusePagesModule'
  },
  {
    path        : 'ui',
    loadChildren: './main/content/ui/ui.module#FuseUIModule'
  },
  {
    path        : 'services',
    loadChildren: './main/content/services/services.module#FuseServicesModule'
  },
  {
    path        : 'components',
    loadChildren: './main/content/components/components.module#FuseComponentsModule'
  },
  {
    path        : 'components-third-party',
    loadChildren: './main/content/components-third-party/components-third-party.module#FuseComponentsThirdPartyModule'
  },
  {
    path      : '**',
    redirectTo: 'pages/auth/register'
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    TranslateModule.forRoot(),
    InMemoryWebApiModule.forRoot(FuseFakeDbService, {
      delay             : 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes),
    AppStoreModule,
    FuseMainModule,
  ],
  providers: [
    CookieService,
    AuthService,
    DOMService,
    HttpService,
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  bootstrap: [AppComponent],

})
export class AppModule {
}
