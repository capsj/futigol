import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../../../core/animations';
import {TeamService} from "../../../../core/services/team.service";
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material';
import {TeamCreate} from "../../../../core/models/team/team-create.model";
import {FuseConfigService} from '../../../../core/services/config.service';
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";
import {Location} from "../../../../core/models/location";

@Component({
  selector   : 'create-team',
  templateUrl: './create-team.component.html',
  styleUrls  : ['./create-team.component.scss'],
  animations : fuseAnimations
})
export class CreateTeamComponent implements OnInit
{
  createTeamForm: FormGroup;
  createTeamFormErrors: any;
  locations: string[];

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    public snackBar: MatSnackBar,
    private fuseConfig: FuseConfigService,
    private fuseNavigationService: FuseNavigationService) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'top',
        toolbar   : 'above',
        footer    : 'none'
      },
      colorClasses    : {
        navbar: 'mat-fuse-dark-50-bg'
      }
    });
    this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
    this.createTeamFormErrors = {
      name           : {},
      location       : {},
      size           : {}
    };
  }

  ngOnInit()
  {
    this.createTeamForm = this.formBuilder.group({
      name           : ['', Validators.required],
      location       : ['', Validators.required],
      size           : ['', Validators.required]
    });

    this.createTeamForm.valueChanges.subscribe(() => {
      this.onRegisterFormValuesChanged();
    });

    this.locations = new Location().options;
  }

  onRegisterFormValuesChanged() {
    for ( const field in this.createTeamFormErrors )
    {
      if ( !this.createTeamFormErrors.hasOwnProperty(field) )
      {
        continue;
      }

      // Clear previous errors
      this.createTeamFormErrors[field] = {};

      // Get the control
      const control = this.createTeamForm.get(field);

      if ( control && control.dirty && !control.valid )
      {
        this.createTeamFormErrors[field] = control.errors;
      }
    }
  }

  register() {
    this.teamService.register(new TeamCreate(this.createTeamForm.getRawValue()))
      .then(res => {
        console.log(res);
        this.snackBar.open('Registro exitoso, ahora inicia sesión!', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.router.navigate(['team', 'general']);
      }).catch(err => {
      console.log(err);
    })
  }

}
