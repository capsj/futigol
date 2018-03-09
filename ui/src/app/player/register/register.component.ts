import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlayerService} from "../../shared/services/player.service";
import {PlayerCreate} from "../../shared/models/new-player-model";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [PlayerService],
})
export class RegisterComponent implements OnInit {

  public formGroup: FormGroup;
  public name: FormControl;
  public username: FormControl;
  public password: FormControl;
  public email: FormControl;
  public phone: FormControl;
  public newPlayer: PlayerCreate;
  public addingPlayerError: boolean;
  public playerAdded: boolean;
  public errorMessage: string;
  public addingPlayer: boolean;

  public constructor(private titleService: Title, private router: Router, private playerService: PlayerService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Registro | Futigol');
    this.newPlayer = PlayerCreate.empty();
    this.addingPlayerError = false;
    this.playerAdded = false;
    this.addingPlayer = false;
    this.createFormControls();
    this.createForm();
  }


  createFormControls() {
    this.name = new FormControl(this.newPlayer.name, Validators.required);
    this.username = new FormControl(this.newPlayer.username, Validators.required);
    this.password = new FormControl(this.newPlayer.password, [Validators.required, Validators.minLength(8)]);
    this.email = new FormControl(this.newPlayer.email, [Validators.required, Validators.email]);
    this.phone = new FormControl(this.newPlayer.phone, Validators.required);
  }

  createForm() {
    this.formGroup = new FormGroup({
      name: this.name,
      username: this.username,
      password: this.password,
      email: this.email,
      phone: this.phone,
    });
  }

  public addPlayer() {
    if (this.formGroup.valid) {
      this.addingPlayer = true;
      this.playerService.addPlayer(this.newPlayer)
        .then(() => {
          this.resetNewPlayer();
          this.addingPlayerError = false;
          this.playerAdded = true;
          setTimeout(() => this.playerAdded = false, 5000);
          this.addingPlayer = false;
        })
        .catch(err => {
          this.addingPlayerError = true;
          this.addingPlayer = false;
          this.errorMessage = 'Al agregar el player, revise los datos e inténtelo de nuevo.';
          const message = JSON.parse(err._body).msg;
          if (message === 'Mail already in use') {
            this.errorMessage = 'El mail de contacto ya está en uso.'
          } else if (message === 'Username already in use') {
            this.errorMessage = 'El nombre de usuario ya está en uso.'
          }
        });
    }
  }

  public resetNewPlayer() {
    this.formGroup.reset();
    this.newPlayer = PlayerCreate.empty();
  }

  public goBack() {
    this.router.navigate(['admin', 'players']);
  }

}
