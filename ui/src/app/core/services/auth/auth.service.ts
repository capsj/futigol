import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {User} from '../../models/user-model';
import {ResponseData} from '../shared/response-data';
import {UserCredentials} from '../../models/user-credentials';
import {HttpService} from '../shared/http.service';
import {Admin} from "../../models/admin-model";
import {CookieService} from "angular2-cookie/core";

const HEADERS = {'Content-Type': 'application/json'};

@Injectable()
export class AuthService {

    private tokenCookieKey = 'fU7160l-70k3n';
    private _redirectUrl: string;
    private _token: string;
    private _loggedUser: any;

    get isLoggedIn(): boolean {
      return this.cookieService.get(this.tokenCookieKey) !== '' && this.cookieService.get(this.tokenCookieKey) !== undefined;
    }

    get redirectUrl(): string { return this._redirectUrl; }
    set redirectUrl(value: string) { this._redirectUrl = value; }

    get loggedUser(): Promise<any> {
        return this._loggedUser ? Promise.resolve(this._loggedUser) : this.requestLoggedUser();
    }

    constructor(private http: HttpService, private cookieService: CookieService) {
        this._token = this.getToken() || '';
        this.http.authToken = this._token;
        if (this._token) {
            this.requestLoggedUser();
        } else {
            this._loggedUser = undefined;
        }
    }

    public login(credentials: UserCredentials): Promise<ResponseData> {
      return this.http.defaultHttp.post('/api/login', credentials.asJsonString(), this.http.defaultOptions).toPromise()
        .then(res => {
          const data: ResponseData = res.json() as ResponseData;

          this._token = res.headers.get('authorization') || '';
          this.http.authToken = this._token;
          this.cookieService.put(this.tokenCookieKey, this._token);
          return data;
        })
        .catch(this.handleError);
    }

    public logout(): Promise<ResponseData> {
        return this.http.get('/api/logout')
            .then(resData => {
                this.clearSession();
                return resData;
            })
            .catch(this.handleError);
    }

    private getToken(): string {
        return this.cookieService.get(this.tokenCookieKey);
    }

    private requestLoggedUser(): Promise<any> {
        return this.http.get('/api/data')
            .then(resData => {
                const user = resData.data.caseUser;
                this._loggedUser = user;
                return user;
            })
            .catch(this.handleError);
    }

    private clearSession() {
        this._token = '';
        this.http.authToken = this._token;
        this._loggedUser = undefined;
        this.cookieService.removeAll();
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
