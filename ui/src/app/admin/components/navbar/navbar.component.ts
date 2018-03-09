import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {User} from "../../../shared/models/user-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private user: User;
  public errorLoginOut: boolean;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
    this.authService.loggedUser.then(res => {
      this.user = res;
    });
    this.errorLoginOut = false;
  }


}
