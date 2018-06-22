import {Component, OnInit} from "@angular/core";
import {fuseAnimations} from "../../../../core/animations";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector   : 'search-team',
  templateUrl: './search-team.component.html',
  styleUrls  : ['./search-team.component.scss'],
  animations : fuseAnimations
})
export class SearchTeamComponent implements OnInit
{

  public form: FormGroup;
  horizontalStepperStep1: FormGroup;
  horizontalStepperStep2: FormGroup;
  horizontalStepperStep3: FormGroup;

  constructor(private fuseConfig: FuseConfigService,
              private fuseNavigationService: FuseNavigationService,
              private formBuilder: FormBuilder) {
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
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name : ['', Validators.required],
      location  : ['', Validators.required],
      size   : ['', Validators.required]
    });

    // Horizontal Stepper form steps
    this.horizontalStepperStep1 = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.horizontalStepperStep2 = this.formBuilder.group({
      location: ['', Validators.required]
    });

    this.horizontalStepperStep3 = this.formBuilder.group({
      size      : ['', Validators.required]
    });
  }

}
