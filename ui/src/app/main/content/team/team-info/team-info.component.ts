import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {fuseAnimations} from "../../../../core/animations";
import {FuseUtils} from "../../../../core/fuseUtils";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TeamService} from "../../../../core/services/team.service";
import {Subscription} from "rxjs/Subscription";
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {Team} from "../../../../core/models/team/team.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FilesDataSource} from "../my-teams/my-teams.component";
import {Player} from "../../../../core/models/player/player.model";
import {AuthService} from "../../../../core/services/auth/auth.service";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";

@Component({
  selector   : 'team-info',
  templateUrl: './team-info.component.html',
  styleUrls  : ['./team-info.component.scss'],
  animations : fuseAnimations
})
export class TeamInfoComponent implements OnInit
{
  team: Team;
  teamForm: FormGroup;
  teamPlayers: Player[];
  playerColumns = ['name', 'email', 'phone', 'delete', 'captain'];
  playerDataSource: MatTableDataSource<Player>;
  loggedPlayer: any;
  isCaptainBool: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private teamService: TeamService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
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

  }

  ngOnInit()
  {
    this.isCaptainBool = false;
    this.authService.loggedUser.then(res => {this.loggedPlayer = res});
    this.teamPlayers = [];
    this.playerDataSource = new MatTableDataSource<Player>(this.teamPlayers);
    this.teamForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required)
    });
    this.route.params.subscribe( params =>
      this.teamService.getById(params.id)
        .then(res => {
          this.team = res;
          this.teamForm = this.formBuilder.group({
            id              : [this.team.id],
            name            : [this.team.name],
            size            : [this.team.size],
            location        : [this.team.location]
          });
          this.isCaptainBool = this.isCaptain();
          this.teamService.getTeamPlayers(params.id)
            .then(players => {
              this.teamPlayers = players;
              this.playerDataSource = new MatTableDataSource<Player>(this.teamPlayers);
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
    )
  }

  isCaptain() {
    return this.loggedPlayer.id === this.team.captain.id;
  }

  saveTeam() {
    console.log('updateado');
  }

  test(event) {
    console.log(event);
  }

  back() {
    this.router.navigate(['team', 'general']);
  }

}
