import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import {PlayerService} from "../../../core/services/player.service";
import {PlayerCreate} from '../../../core/models/player/player-create.model';
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material';
import {Position} from "../../../core/models/position";
import {Location} from "../../../core/models/location";

@Component({
    selector   : 'fuse-register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.scss'],
    animations : fuseAnimations
})
export class RegisterComponent implements OnInit
{
    registerForm: FormGroup;
    registerFormErrors: any;
    positions: string[];
    locations: string[];

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private registerService: PlayerService,
        private router: Router,
        public snackBar: MatSnackBar
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.registerFormErrors = {
            name           : {},
            lastName       : {},
            email          : {},
            location       : {},
            position       : {},
            password       : {},
            passwordConfirm: {}
        };
    }

    ngOnInit()
    {
        this.registerForm = this.formBuilder.group({
            name           : ['', Validators.required],
            lastName       : ['', Validators.required],
            phone          : ['', Validators.required],
            location       : ['', Validators.required],
            position       : ['', Validators.required],
            email          : ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPassword]]
        });

        this.registerForm.valueChanges.subscribe(() => {
            this.onRegisterFormValuesChanged();
        });

        this.locations = new Location().options;

        this.positions = [];
        for(var p in Position) {
          this.positions.push(p);
        }
    }

    onRegisterFormValuesChanged() {
        for ( const field in this.registerFormErrors )
        {
            if ( !this.registerFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.registerFormErrors[field] = {};

            // Get the control
            const control = this.registerForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.registerFormErrors[field] = control.errors;
            }
        }
    }

    register() {
      this.registerService.register(new PlayerCreate(this.registerForm.getRawValue()))
        .then(res => {
          console.log(res);
          this.router.navigate(['login']);
          this.snackBar.open('Registro exitoso, ahora inicia sesión!', '', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }).catch(err => {
          console.log(err);
      })
    }

    toLogin() {
      this.router.navigate(['login'])
    }
}

function confirmPassword(control: AbstractControl) {
    if ( !control.parent || !control )
    {
        return;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return;
    }

    if ( passwordConfirm.value === '' )
    {
        return;
    }

    if ( password.value !== passwordConfirm.value )
    {
        return {
            passwordsNotMatch: true
        };
    }
}
