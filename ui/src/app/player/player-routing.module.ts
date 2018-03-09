import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReverseAuthGuard} from "../auth/reverse-auth-guard.service";
import {AuthGuard} from "../auth/auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  { path: 'login', canActivate: [ReverseAuthGuard], component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers : [
    ReverseAuthGuard,
    AuthGuard
  ]
})
export class PlayerRoutingModule { }
