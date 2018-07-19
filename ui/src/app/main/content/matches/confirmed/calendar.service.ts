import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import {AuthService} from "../../../../core/services/auth/auth.service";

@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated = new Subject<any>();

    constructor(private http: HttpClient, private authService: AuthService)
    {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
              this.authService.loggedUser.then(res => {
                this.getEvents(res.id)
              })
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    getEvents(playerId: string)
    {
        return new Promise((resolve, reject) => {

            this.http.get('/api/player/confirmed/' + playerId)
                .subscribe((response: any) => {
                    this.events = response.data;
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
        });
    }

}
