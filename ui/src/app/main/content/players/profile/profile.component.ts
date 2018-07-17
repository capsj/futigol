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
import {MatDialog} from '@angular/material';
import {Location} from "../../../../core/models/location";
import {Position} from "../../../../core/models/position";

@Component({
  selector   : 'profile',
  templateUrl: './profile.component.html',
  styleUrls  : ['./profile.component.scss'],
  animations : fuseAnimations
})
export class ProfileComponent implements OnInit
{
  player: Player;
  teams: Team[];
  playerForm: FormGroup;
  loggedPlayer: any;
  locations: string[];
  positions: string[];

  constructor(
    private playerService: PlayerService,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
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
    this.player = Player.empty();
    this.locations = new Location().options;
    this.positions = [];
    for(var p in Position) {
      this.positions.push(p);
    }
    this.teams = [];
    this.player = Player.empty();
    this.authService.loggedUser.then(res => {
      this.loggedPlayer = res;
      this.playerService.playerInfo(this.loggedPlayer.id)
        .then(res => {
          this.player = new Player(res);
          this.teams = res.teams;
          this.resetForm();
        })
        .catch(err => {
          console.log(err);
        });
    });
    this.playerForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')])
    });
  }

  resetForm() {
    this.playerForm.reset();
    this.playerForm = this.formBuilder.group({
      id: this.player.id,
      name: this.player.name,
      lastName: this.player.lastName,
      position: this.player.position,
      location: this.player.location,
      phone: this.player.phone,
      email: this.player.email
    })
  }

  updatePlayer() {
    this.playerService.update(this.playerForm.getRawValue()).then(res => {
      this.player = res;
      this.resetForm();
      this.snackBar.open('Tu perfil se modificó exitosamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(err => {
      if(JSON.parse(err._body).msg == 'Email already in use') {
        this.snackBar.open('Hubo un error al actualizar tu perfil. El mail ingresado se encuentra en uso.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      } else {
        this.snackBar.open('Hubo un error al actualizar tu perfil. Por favor, inténtelo nuevamente', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    })
  }

  teamRedirect(id) {
    this.router.navigate(['team', 'info', id]);
  }

}
