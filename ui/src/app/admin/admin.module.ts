import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdminComponent} from "./admin.component";
import {VideoComponent} from "./video/video.component";
import {ImagesComponent} from "./images/images.component";
import {CategoriesComponent} from "./categories/categories.component";
import {SuppliersComponent} from "./suppliers/suppliers.component";
import {SharedModule} from "../shared/shared.module";
import {ComponentsModule} from "./components/components.module";

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [
    AdminLoginComponent,
    SuppliersComponent,
    AdminComponent,
    VideoComponent,
    ImagesComponent,
    CategoriesComponent,
  ],
})
export class AdminModule { }
