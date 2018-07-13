import {Component, OnInit} from "@angular/core";
import {FuseConfigService} from "../../../core/services/config.service";
import {FuseNavigationService} from "../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../navigation/navigation.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Position} from "../../../core/models/position";
import {Location} from "../../../core/models/location";
import {fuseAnimations} from "../../../core/animations";
import {SearchModel} from "../../../core/models/player/search.model";
import {PlayerService} from "../../../core/services/player.service";
import {Player} from "../../../core/models/player/player.model";

@Component({
  selector   : 'players-component',
  templateUrl: './players.component.html',
  styleUrls  : ['./players.component.scss'],
  animations : fuseAnimations,
})

export class PlayersComponent implements OnInit{

  searchForm: FormGroup;
  locations: string[];
  positions: string[];
  players: Player[];

  constructor(private fuseConfig: FuseConfigService,
              private formBuilder: FormBuilder,
              private fuseNavigationService: FuseNavigationService,
              private playerService: PlayerService) {
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
    this.players = [];

    this.positions = [];
    for(var p in Position) {
      this.positions.push(p);
    }
  }

  search() {
    this.playerService.search(new SearchModel(this.searchForm.getRawValue())).then(players => {
      this.players = players
    }).catch(err => {
      console.log(err)
    });
  }

}
