import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort } from '@angular/material';
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

  dataSource: FilesDataSource | null;
  displayedColumns = ['name', 'lastName', 'location', 'position'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchForm: FormGroup;
  locations: string[];
  positions: string[];
  players: Player[];

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
    this.players = [];

    this.positions = [];
    for(var p in Position) {
      this.positions.push(p);
    }

    this.dataSource = new FilesDataSource(this.playerService, this.paginator, this.sort);

  }

  search() {
    this.playerService.search(new SearchModel(this.searchForm.getRawValue())).then(players => {
      this.players = players
    }).catch(err => {
      console.log(err)
    });
  }

  playerInfo(event) {
    this.router.navigate(['players', 'info', this.dataSource.filteredData[event].id]);
  }
}

export class FilesDataSource extends DataSource<any>
{
  _filterChange = new BehaviorSubject('');
  _filteredDataChange = new BehaviorSubject('');

  get filteredData(): any
  {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any)
  {
    this._filteredDataChange.next(value);
  }

  get filter(): string
  {
    return this._filterChange.value;
  }

  set filter(filter: string)
  {
    this._filterChange.next(filter);
  }

  constructor(
    private playerService: PlayerService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  )
  {
    super();
    this.filteredData = this.playerService.players;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]>
  {
    const displayDataChanges = [
      this.playerService.onPlayersChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.playerService.players.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  filterData(data)
  {
    if ( !this.filter )
    {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[]
  {
    if ( !this._sort.active || this._sort.direction === '' )
    {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch ( this._sort.active )
      {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'categories':
          [propertyA, propertyB] = [a.categories[0], b.categories[0]];
          break;
        case 'price':
          [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
          break;
        case 'quantity':
          [propertyA, propertyB] = [a.quantity, b.quantity];
          break;
        case 'active':
          [propertyA, propertyB] = [a.active, b.active];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect()
  {
  }
}
