import {Component, OnInit, ViewChild} from "@angular/core";
import {fuseAnimations} from "../../../../core/animations";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PlayerService} from "../../../../core/services/player.service";
import {MatPaginator, MatSnackBar} from "@angular/material";
import {Player} from "../../../../core/models/player/player.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../core/services/auth/auth.service";
import {FuseConfigService} from "../../../../core/services/config.service";
import {FuseNavigationService} from "../../../../core/components/navigation/navigation.service";
import {FuseNavigationModel} from "../../../../navigation/navigation.model";
import {Team} from "../../../../core/models/team/team.model";

@Component({
  selector   : 'player-info',
  templateUrl: './player-info.component.html',
  styleUrls  : ['./player-info.component.scss'],
  animations : fuseAnimations
})
export class PlayerInfoComponent implements OnInit
{
  player: Player;
  teams: Team[];
  playerForm: FormGroup;
  playerColumns = ['name', 'email', 'phone', 'delete', 'captain'];
  loggedPlayer: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private playerService: PlayerService,
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
    this.teams = [];
    this.authService.loggedUser.then(res => {this.loggedPlayer = res});
    this.playerForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required)
    });
    this.route.params.subscribe( params =>
      this.playerService.playerInfo(params.id)
        .then(res => {
          this.player = new Player(res);
          this.teams = res.teams;
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  invitePlayer() {
    console.log('updateado');
  }

  back() {
    this.router.navigate(['players']);
  }

  teamRedirect(id) {
    this.router.navigate(['team', 'info', id]);
  }

}
