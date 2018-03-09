import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home.component";
import {RouterModule} from "@angular/router";
import {HomeRoutingModule} from "./home-routing.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {SharedModule} from "../shared/shared.module";
import { CollapseModule } from 'ngx-bootstrap/collapse';
import {ResponsiveModule} from "ng2-responsive";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    SharedModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    ResponsiveModule,
  ],
  declarations: [
    HomeComponent,
  ],
})
export class HomeModule { }
