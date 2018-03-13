import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ResponseData } from '../shared/response-data';
import { HttpService } from '../shared/services/http.service';
import {User} from '../shared/models/user-model';
import {UserCredentials} from '../shared/models/user-credentials';
import {CookieService} from "angular2-cookie/core";

const HEADERS = {'Content-Type': 'application/json'};

@Injectable()
export class AuthService {

    private tokenCookieKey = 'futigol-t0k3n';
    private baseUrl = 'http://localhost:9000/api/';
    private _redirectUrl: string;
    private _token: string;
    private _loggedUser: User;

    get isLoggedIn(): boolean {
        return this._token !== '';
    }

    get redirectUrl(): string { return this._redirectUrl; }
    set redirectUrl(value: string) { this._redirectUrl = value; }

    get loggedUser(): Promise<User> {
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
        return this.http.defaultHttp.post(this.baseUrl + 'login', credentials.asJsonString(), this.http.defaultOptions).toPromise()
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
        return this.http.get('logout')
            .then(resData => {
                this.clearSession();
                return resData;
            })
            .catch(this.handleError);
    }

    private getToken(): string {
        return this.cookieService.get(this.tokenCookieKey);
    }

    private requestLoggedUser(): Promise<User> {
        return this.http.get('data')
            .then(resData => {
                const user = resData.data.caseUser as User;
                this._loggedUser = user;
                return user;
            })
            .catch(this.handleError);
    }

    private clearSession() {
        this._token = '';
        this.http.authToken = this._token;
        this._loggedUser = undefined;
        this.cookieService.remove(this.tokenCookieKey);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
