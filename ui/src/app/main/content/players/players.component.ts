import {Component, OnInit} from "@angular/core";
import {FuseConfigService} from "../../../core/services/config.service";
import {FuseNavigationService} from "../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../navigation/navigation.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Position} from "../../../core/models/position";
import {Location} from "../../../core/models/location";

@Component({
  selector   : 'players-component',
  templateUrl: './players.component.html',
  styleUrls  : ['./players.component.scss']
})

export class PlayersComponent implements OnInit{

  searchForm: FormGroup;
  locations: string[];
  positions: string[];

  constructor(private fuseConfig: FuseConfigService,
              private formBuilder: FormBuilder,
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
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name           : [''],
      lastName       : [''],
      location       : [''],
      position       : [''],
    });

    this.locations = new Location().options;

    this.positions = [];
    for(var p in Position) {
      this.positions.push(p);
    }
  }
}
