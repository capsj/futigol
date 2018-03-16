import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { LoginModule } from './main/content/login/login.module';
import { RegisterModule } from './main/content/register/register.module';
import { FuseFakeDbService } from "./fuse-fake-db/fuse-fake-db.service";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { AuthService } from "./auth/auth.service";
import { CookieService }   from 'angular2-cookie/services/cookies.service';
import { HttpService } from "./shared/services/http.service";
import { APP_BASE_HREF } from "@angular/common";
import {HttpModule} from "@angular/http";
import {PlayerService} from "./shared/services/player.service";

const appRoutes: Routes = [
  {
    path        : 'login',
    loadChildren: './main/content/login/login.module#LoginModule'
  },
  {
    path        : 'home',
    loadChildren: './main/content/sample/sample.module#FuseSampleModule'
  },
  {
    path        : 'register',
    loadChildren: './main/content/register/register.module#RegisterModule'
  },
  {
    path      : '**',
    redirectTo: 'login'

  },
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FuseFakeDbService, {
        delay             : 0,
        passThruUnknownUrl: true
        }),
        FuseMainModule,
        LoginModule,
        RegisterModule,
        HttpModule,
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        AuthService,
        CookieService,
        HttpService,
        PlayerService,
        {provide: APP_BASE_HREF, useValue : '/' }
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule {
}
