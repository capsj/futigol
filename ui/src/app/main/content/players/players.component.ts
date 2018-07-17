import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
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
import {FuseUtils} from "../../../core/fuseUtils";
import {Router} from "@angular/router";

@Component({
  selector   : 'players-component',
  templateUrl: './players.component.html',
  styleUrls  : ['./players.component.scss'],
  animations : fuseAnimations,
})

export class PlayersComponent implements OnInit{

  dataSource: MatTableDataSource<Player>;
  displayedColumns = ['name', 'lastName', 'location', 'position'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchForm: FormGroup;
  locations: string[];
  positions: string[];

  constructor(private fuseConfig: FuseConfigService,
              private formBuilder: FormBuilder,
              private router: Router,
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

    this.positions = [];
    for(var p in Position) {
      this.positions.push(p);
    }
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  search() {
    this.playerService.search(new SearchModel(this.searchForm.getRawValue())).then(players => {
      this.dataSource.data = players.data;
    }).catch(err => {
      console.log(err)
    });
  }

  playerInfo(event) {
    this.router.navigate(['players', 'info', this.dataSource.filteredData[event].id]);
  }
}
