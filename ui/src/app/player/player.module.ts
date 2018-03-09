import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {PlayerRoutingModule} from "./player-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {RegisterComponent} from "./register/register.component";

@NgModule({
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ]
})
export class PlayerModule { }
