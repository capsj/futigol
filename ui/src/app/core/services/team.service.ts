import {HttpService} from "./shared/http.service";
import {Team} from "../models/team/team.model";
import {TeamCreate} from "../models/team/team-create.model";
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {AuthService} from "./auth/auth.service";

@Injectable()
export class TeamService implements Resolve<any>{

  teams: any[];
  onTeamsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private http: HttpService, private httpClient: HttpClient, private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any>
  {

    return new Promise((resolve, reject) => {
      this.authService.loggedUser.then(user => {
        this.getTeams(user.id)
          .then(
        () => {
          resolve();
        },
        reject
      );
      })
    });
  }

  getTeams(playerId: number): Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.httpClient.get('/api/player/teams/' + playerId)
        .subscribe((response: any) => {
          this.teams = response.data;
          this.onTeamsChanged.next(this.teams);
          resolve(response);
        }, reject);
    });
  }

  public register(teamCreate: TeamCreate): Promise<Team> {
    return this.http
      .post('/api/team', teamCreate)
      .then(res => {
        return new Team(res.data);
      });
  }
}
