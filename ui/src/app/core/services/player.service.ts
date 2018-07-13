import {Injectable} from "@angular/core";
import {HttpService} from "./shared/http.service";
import {PlayerCreate} from "../models/player/player-create.model";
import {Player} from "../models/player/player.model";
import {SearchModel} from "../models/player/search.model";

@Injectable()
export class PlayerService {

  constructor(private http: HttpService) {}

  public register(playerCreate: PlayerCreate): Promise<Player> {
    return this.http
      .post('/api/player', playerCreate)
      .then(res => {
        return new Player(res.data);
      });
  }

  public search(searchModel: SearchModel): Promise<Player[]> {
    return this.http
      .post('/api/player/search', searchModel)
      .then(res => {
        return res.data.map(x => new Player(x));
      });
  }
}
