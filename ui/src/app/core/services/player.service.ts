import {Injectable} from "@angular/core";
import {HttpService} from "./shared/http.service";
import {PlayerCreate} from "../models/player/player-create.model";
import {Player} from "../models/player/player.model";
import {SearchModel} from "../models/player/search.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import {PlayerInfo} from "../models/player/player-info.model";
import {Team} from "../models/team/team.model";
import {Invite} from "../models/invite/invite.model";

@Injectable()
export class PlayerService {

  players: any[];
  onPlayersChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private http: HttpService, private httpClient: HttpClient) {
    this.players = []
  }

  public register(playerCreate: PlayerCreate): Promise<Player> {
    return this.http
      .post('/api/player', playerCreate)
      .then(res => {
        return new Player(res.data);
      });
  }

  public search(searchModel: SearchModel): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post('/api/player/search', searchModel, {headers: this.http.getHeaders()})
        .subscribe((response: any) => {
          this.players = response.data.map(x => new Player(x));
          this.onPlayersChanged.next(this.players);
          resolve(response);
        }, reject);
    });
  }

  public getById(id: number): Promise<Player> {
    return this.http.get('/api/player/id/' + id)
      .then(res => {
        return new Player(res.data);
      })
  }

  public playerInfo(id: number): Promise<PlayerInfo> {
    return this.http.get('/api/player/info/' + id)
      .then(res => {
        return new PlayerInfo(res.data);
      })
  }

  public getCaptainTeams(id: number): Promise<Team[]> {
    return this.http.get('/api/player/team/captain/' + id)
      .then(res => {
        return res.data;
      });
  }

  public invite(teamId: string, playerId: string): Promise<Invite>{
    return this.http.post('/api/player/invite', {teamId: teamId, playerId: playerId})
      .then( res => {
        return res.data
      })
  }
}
