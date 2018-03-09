import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReverseAuthGuard} from "../auth/reverse-auth-guard.service";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {SuppliersComponent} from "./suppliers/suppliers.component";
import {AdminComponent} from "./admin.component";
import {AuthGuard} from "../auth/auth-guard.service";
import {VideoComponent} from "./video/video.component";
import {ImagesComponent} from "./images/images.component";
import {CategoriesComponent} from "./categories/categories.component";

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {path: 'login', canActivate: [ ReverseAuthGuard ], component: AdminLoginComponent},
      {path: 'panel',
        component: AdminComponent,
        canActivate: [ AuthGuard ],
        children: [
          {path: 'suppliers',   component: SuppliersComponent},
          {path: 'video',       component: VideoComponent},
          {path: 'images',      component: ImagesComponent},
          {path: 'categories',  component: CategoriesComponent},
        ]
      },

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
export class AdminRoutingModule { }
