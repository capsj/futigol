import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import {AuthService} from "../../../core/services/auth/auth.service";
import {UserCredentials} from "../../../core/models/user-credentials";
import {MatSnackBar} from '@angular/material';
import {Router} from "@angular/router";

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loginFormErrors: any;
    credentials: UserCredentials;
    loading: boolean;

    constructor(private fuseConfig: FuseConfigService,
                private formBuilder: FormBuilder,
                private authService: AuthService,
                private router: Router,
                public snackBar: MatSnackBar) {
      this.fuseConfig.setSettings({
        layout: { navigation: 'none', toolbar   : 'none', footer    : 'none' }
      });
      this.loginFormErrors = { email   : {}, password: {}};
    }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email   : ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
          password: ['', Validators.required]
      });

      this.loginForm.valueChanges.subscribe(() => {
          this.onLoginFormValuesChanged();
      });
      this.credentials = UserCredentials.empty();
      this.loading = false;
    }

    onLoginFormValuesChanged() {
        for ( const field in this.loginFormErrors ) {
            if ( !this.loginFormErrors.hasOwnProperty(field) ) {
                continue;
            }
            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid ) {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    login(){
        this.loading = true;
        this.authService.login(this.credentials).then((res) => {
          this.router.navigate(['profile']);
          this.loading = false;
      }).catch((err) => {
          this.loading = false;
          this.openSnackBar(err);
      })
    }

    openSnackBar(err) {
        this.snackBar.open('El usuario o la contraseña no son válidos.', '', {
            duration: 5000,
            verticalPosition: 'top',
        });
    }

    registerRedirect() {
      this.router.navigate(['register'])
    }
}
