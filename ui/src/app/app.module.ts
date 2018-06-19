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
import { FuseSampleModule } from './main/content/sample/sample.module';
import { TranslateModule } from '@ngx-translate/core';
import {APP_BASE_HREF} from "@angular/common";
import {AuthGuard} from "./core/services/auth/auth-guard.service";
import {AuthService} from "./core/services/auth/auth.service";
import {HttpService} from "./core/services/shared/http.service";
import {CookieService} from "angular2-cookie/core";
import {HttpModule} from '@angular/http';
import {RegisterService} from './core/services/register.service';
import {TeamModule} from "./main/content/team/team.module";

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        FuseMainModule,
        FuseSampleModule
    ],
    providers   : [
        CookieService,
        HttpService,
        RegisterService,
        FuseSplashScreenService,
        FuseConfigService,
        AuthService,
        AuthGuard,
        {provide: APP_BASE_HREF, useValue : '/' },
        FuseNavigationService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
