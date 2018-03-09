import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReverseAuthGuard} from "../auth/reverse-auth-guard.service";
import {AuthGuard} from "../auth/auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "../home/home.component";

const routes: Routes =[
  {
    path: 'supplier',
    // component: HomeComponent,
    children: [
      {path: 'login', component: LoginComponent},
    ]
  },
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
export class SupplierRoutingModule { }
