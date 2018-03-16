import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../core/services/config.service';
import { fuseAnimations } from '../../../core/animations';
import {PlayerCreate} from "../../../shared/models/new-player-model";
import {Router} from "@angular/router";
import {PlayerService} from "../../../shared/services/player.service";
import {AuthService} from "../../../auth/auth.service";
import {Player} from "../../../shared/models/player-model";
import {UserCredentials} from "../../../shared/models/user-credentials";
import {ResponseData} from "../../../shared/response-data";

@Component({
    selector   : 'fuse-register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.scss'],
    animations : fuseAnimations
})
export class FuseRegisterComponent implements OnInit
{
  registerForm: FormGroup;
  registerFormErrors: any;

  public newPlayer: PlayerCreate;
  public savingError: boolean;
  public savingLoading: boolean;
  public duplicatedUsername: boolean;
  public duplicatedEmail: boolean;
  public badCredentialsError: boolean;

  constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        public router: Router,
        public playerService: PlayerService,
        public authService: AuthService
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
            username       : {},
            email          : {},
            phone          : {},
            password       : {},
            passwordConfirm: {}
        };
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name           : ['', Validators.required],
            username       : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            phone          : ['', Validators.required],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPassword]]
        });

        this.registerForm.valueChanges.subscribe(() => {
            this.onRegisterFormValuesChanged();
        });
        this.newPlayer = PlayerCreate.empty();
        this.savingError = false;
        this.savingLoading = false;
        this.duplicatedUsername = false;
        this.duplicatedEmail = false;
        this.badCredentialsError = false;
    }

  save() {
    this.savingLoading = true;
    this.playerService.addPlayer(this.newPlayer).then( (player: Player) => {
      this.login();
      this.savingError = false;
    }).catch(err => {
      if (JSON.parse(err._body).msg === 'Username already in use') {
        this.duplicatedUsername = true;
      }
      else if (JSON.parse(err._body).msg === 'Email already in use') {
        this.duplicatedEmail = true;
      } else {
        this.savingError = true;
      }
      this.savingLoading = false;
    });
  }

  login() {
    this.authService.login(new UserCredentials(this.newPlayer.username, this.newPlayer.password))
      .then((data: ResponseData) => {
        this.savingLoading = false;
        this.router.navigate(['home']);
        this.badCredentialsError = false;
      })
      .catch(() => {
        this.badCredentialsError = true;
      });
  }

  checkUsername() {
    this.playerService.requestPlayerByUserame(this.newPlayer.username)
      .then( () => {
        this.duplicatedUsername = true;
      })
      .catch( () => {
        this.duplicatedUsername = false;
      })
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
