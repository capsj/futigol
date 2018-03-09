import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReverseAuthGuard} from "../auth/reverse-auth-guard.service";
import {AuthGuard} from "../auth/auth-guard.service";
import {HomeComponent} from "./home.component";

const routes: Routes =[

  {path: 'home', component: HomeComponent},

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
export class HomeRoutingModule { }
