import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';

import {UserCredentials} from "../../../../../shared/models/user-credentials";
import {AuthService} from "../../../../../auth/auth.service";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {ResponseData} from "../../../../../shared/response-data";

@Component({
    selector   : 'fuse-login-2',
    templateUrl: './login-2.component.html',
    styleUrls  : ['./login-2.component.scss'],
    animations : fuseAnimations
})
export class FuseLogin2Component implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;
    public credentials: UserCredentials;
    public badCredentialsError: boolean;
    public processingCredentials: boolean;
    public buttonHover: boolean;
    public resetPasswordMessage: boolean;
    public error: boolean;
    public success: boolean;
    public resetPasswordUser: string;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private titleService: Title,
        private router: Router
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            username   : {},
            password: {}
        };
    }

    ngOnInit()
    {
        this.loginForm = this.formBuilder.group({
            username   : ['', [Validators.required]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });
        this.titleService.setTitle('Login | Futigol');
        this.credentials = UserCredentials.empty();
        this.badCredentialsError = false;
        this.processingCredentials = false;
        this.buttonHover = false;
        this.resetPasswordMessage = false;
        this.success = false;
        this.error = false;
        this.resetPasswordUser = '';
    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
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

    private handleErrorLogin(error: any) {
      if (error.json().msg === 'Invalid data') {
        this.processingCredentials = false;
        this.badCredentialsError = true;
        this.resetPasswordUser = this.credentials.username;
        setTimeout(() => this.badCredentialsError = false, 5000)
      }
    }

    private redirect() {
      this.router.navigate(['pages','profile']);
    }
}
