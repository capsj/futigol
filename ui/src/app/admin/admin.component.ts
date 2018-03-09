import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ResponseData} from "../shared/response-data";
import {User} from "../shared/models/user-model";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  private user: User;
  public errorLoginOut: boolean;

  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.authService.loggedUser.then(res => {
      this.user = res;
    });
  }

  logout(){
    this.authService.logout()
      .then((data: ResponseData) => {
        this.router.navigate(['admin','login']);
      }).catch(() => this.errorLoginOut=true);
  }

}
