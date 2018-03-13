import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Player} from '../models/player-model';
// import {PaginationModel} from "../../admin/suppliers/suppliers.component";
import {PlayerCreate} from "../models/new-player-model";

/*
Supplier routes
  POST        /api/supplier                                       controllers.SupplierController.register
  POST        /api/supplier/rate                                  controllers.SupplierController.rate
  GET         /api/supplier/id/:id                                controllers.SupplierController.getById(id: Long)
  GET         /api/supplier/username/:username                    controllers.SupplierController.getByUsername(username)
  GET         /api/supplier/email/:email                          controllers.SupplierController.getByEmail(email)
  GET         /api/supplier/all                                   controllers.SupplierController.getAll
  GET         /api/supplier/homepage                              controllers.SupplierController.getHomepageSuppliers
  GET         /api/supplier/nonhomepage                           controllers.SupplierController.getNonHomepageSuppliers
  GET         /api/supplier/homepage/add/:id                      controllers.SupplierController.addToHompage(id: Long)
  GET         /api/supplier/homepage/remove/:id                   controllers.SupplierController.removeFromHompage(id: Long)
  PUT         /api/supplier                                       controllers.SupplierController.update
  PUT         /api/supplier/image                                 controllers.SupplierController.updateImage
  DELETE      /api/supplier/:id                                   controllers.SupplierController.delete(id: Long)
*/

@Injectable()
export class PlayerService {

  private _allPlayersLoaded: boolean;
  private _playersById: Map<number, Player>;

  constructor(private http: HttpService) {
    this._allPlayersLoaded = false;
    this._playersById = new Map();
  }

  get players(): Promise<Player[]> {
    return this._allPlayersLoaded ? Promise.resolve(this.allPlayersToArray()) : this.requestPlayers();
  }

  public getPlayerById(id: number): Promise<Player> {
    return this._playersById.get(id) ? Promise.resolve(this._playersById.get(id)) : this.requestPlayerById(id);
  }

  public getHomepagePlayers(): Promise<Player[]> {
    return this.http
      .get('/api/player/homepage')
      .then(res => {
        return res.data as Player[];
      });
  }

  public getNonHomepagePlayers(): Promise<Player[]> {
    return this.http
      .get('/api/player/nonhomepage')
      .then(res => {
        return res.data as Player[];
      });
  }

  public addPlayer(playerCreate: PlayerCreate): Promise<Player> {
    return this.http
      .post('/api/player', playerCreate)
      .then(res => {
        this._playersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public removePlayerFromHomepage(id: number): Promise<any> {
    return this.http
      .get('/api/player/homepage/remove/'+id)
      .then(res => {
        return res.data;
      });
  }

  public addPlayerToHomepage(id: number): Promise<any> {
    return this.http
      .get('/api/player/homepage/add/'+id)
      .then(res => {
        return res.data;
      });
  }

  public updatePlayer(player: Player): Promise<Player> {
    if(this._playersById.get(player.id)) {
      return this.http
        .put('/api/player', player)
        .then(res => {
          this._playersById.set(player.id, res.data);
          return res.data;
        });
    } else {
      this.requestPlayerById(player.id).then(res => this.updatePlayer(player));
    }
  }

  public deletePlayer(id: number): Promise<any> {
    return this.http.delete('/api/player/' + id)
      .then(res => {
        this._playersById.delete(id);
        return res;
      });
  }

  private allPlayersToArray(): Player[] {
    return Array.from(this._playersById.values());
  }

  private requestPlayers(): Promise<Player[]> {
    return this.http
      .get('/api/player/all')
      .then(res => {
        const players = res.data as Player[];
        players.forEach(player => this._playersById = this._playersById.set(player.id, player));
        this._allPlayersLoaded = true;
        return this.allPlayersToArray();
      });
  }

  private requestPlayerById(id: number): Promise<Player> {
    return this.http
      .get('/api/player/id/' + id)
      .then(res => {
        this._playersById.set(id,res.data);
        return res.data;
      });
  }

  private requestPlayerByName(name: string): Promise<Player> {
    return this.http
      .get('/api/player/name/' + name)
      .then(res => {
        this._playersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  // public getPaginatedNonHomepagePlayers(pagination: PaginationModel): Promise<any> {
  //   return this.http
  //     .post('/api/player/nonhomepage', pagination)
  //     .then(res => {
  //       return res.data;
  //     });
  // }
}
