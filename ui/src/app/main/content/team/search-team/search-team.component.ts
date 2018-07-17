import {Component, OnInit, ViewChild} from "@angular/core";
import {fuseAnimations} from "../../../../core/animations";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {TeamService} from "../../../../core/services/team.service";
import {Team} from "../../../../core/models/team/team.model";
import {Router} from "@angular/router";
import {Location} from "../../../../core/models/location";

@Component({
  selector   : 'search-team',
  templateUrl: './search-team.component.html',
  styleUrls  : ['./search-team.component.scss'],
  animations : fuseAnimations
})
export class SearchTeamComponent implements OnInit
{

  public searchForm: FormGroup;
  dataSource: MatTableDataSource<Team>;
  displayedColumns = ['name', 'location', 'size'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  locations: string[];
  sizes: string[];

  constructor(private fuseConfig: FuseConfigService,
              private fuseNavigationService: FuseNavigationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private teamService: TeamService) {
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
    this.locations = new Location().options;
    this.sizes = ['5', '7', '11'];

    this.searchForm = this.formBuilder.group({
      name : [''],
      location  : [''],
      size   : ['']
    });
    this.teamService.search({});
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  search() {
    this.teamService.search(this.searchForm.getRawValue()).then(teams => {
      this.dataSource.data = teams.data
    }).catch(err => {
      console.log(err)
    });
  }

  teamInfo(event) {
    this.router.navigate(['team', 'info', this.dataSource.filteredData[event].id]);
  }

}
