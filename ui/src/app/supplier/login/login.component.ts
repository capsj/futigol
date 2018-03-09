import { Component, OnInit } from '@angular/core';
import {UserCredentials} from "../../shared/models/user-credentials";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {ResponseData} from "../../shared/response-data";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public credentials: UserCredentials;
  public badCredentialsError: boolean;
  public processingCredentials: boolean;
  public buttonHover: boolean;
  public resetPasswordMessage: boolean;
  public error: boolean;
  public success: boolean;
  public resetPasswordUser: string;
  public loginFormGroup: FormGroup;

  constructor(private authService: AuthService, private titleService: Title, private router: Router, public fb: FormBuilder) { }

  ngOnInit() {
    this.titleService.setTitle('Admin-Login | Utile');
    this.credentials = UserCredentials.empty();
    this.badCredentialsError = false;
    this.processingCredentials = false;
    this.buttonHover = false;
    this.resetPasswordMessage = false;
    this.success = false;
    this.error = false;
    this.resetPasswordUser = '';
    this.createLoginFormControls();
  }

  public login() {
    this.processingCredentials = true;
    this.authService.login(this.credentials)
      .then((data: ResponseData) => {
        this.credentials = UserCredentials.empty();
        this.badCredentialsError = false;
        this.processingCredentials = false;
        this.redirect();
      })
      .catch(err => {
        this.handleErrorLogin(err);
      });
  }

  private handleErrorLogin(error: any): Promise<any> {
    if (error.json().msg === 'Invalid data') {
      this.processingCredentials = false;
      this.badCredentialsError = true;
      this.resetPasswordUser = this.credentials.username;
      setTimeout(() => this.badCredentialsError = false, 5000)
    }
    return Promise.reject(error.message || error);
  }

  createLoginFormControls() {
    this.loginFormGroup = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private redirect() {
    this.router.navigate(['admin','panel', 'suppliers']);
  }

  goToCreateSupplier(){
    this.router.navigate(['supplier', 'new-supplier']);
  }

}
