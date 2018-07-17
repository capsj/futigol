import {Component} from "@angular/core";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";

@Component({
  selector   : 'confirmed-component',
  templateUrl: './confirmed.component.html',
  styleUrls  : ['./confirmed.component.scss']
})

export class ConfirmedComponent {
  constructor(private fuseConfig: FuseConfigService, private fuseNavigationService: FuseNavigationService) {
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
}
