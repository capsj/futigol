import { Injectable }       from '@angular/core';
import { Headers, Http,
    Request, Response }     from '@angular/http';

import { Observable }       from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { ResponseData }     from '../response-data';

@Injectable()
export class HttpService {

    private DEFAULT_HEADERS = {'Content-Type': 'application/json'};
    private _authToken: string;
    private baseUrl = 'http://localhost:9000/api/';

    get authToken(): string { return this._authToken; }
    set authToken(value: string) { this._authToken = value; }

    get defaultHeaders(): Headers { return new Headers(this.DEFAULT_HEADERS); }
    get defaultOptions(): any { return { headers: this.defaultHeaders }; }

    get defaultHttp(): Http { return this._http; }

    constructor(private _http: Http) {}

    public request(url: string | Request): Promise<ResponseData> {
        return this.asPromise(this._http.request(this.baseUrl + url, this.requestOptions()));
    }

    public get(url: string): Promise<ResponseData> {
        return this.asPromise(this._http.get(this.baseUrl + url, this.requestOptions()));
    }

    public post(url: string, body: any): Promise<ResponseData> {
        return this.asPromise(this._http.post(this.baseUrl + url, body, this.requestOptions()));
    }

    public jeroPost(url: string, body: any): Promise<ResponseData> {
      return this.asPromise(this._http.post(this.baseUrl + url, body, this.jeroRequestOptions()));
    }

    public put(url: string, body: any): Promise<ResponseData> {
        return this.asPromise(this._http.put(this.baseUrl + url, body, this.requestOptions()));
    }

    public delete(url: string): Promise<ResponseData> {
        return this.asPromise(this._http.delete(this.baseUrl + url, this.requestOptions()));
    }

    public patch(url: string, body: any): Promise<ResponseData> {
        return this.asPromise(this._http.patch(this.baseUrl + url, body, this.requestOptions()));
    }

    public head(url: string): Promise<ResponseData> {
        return this.asPromise(this._http.head(this.baseUrl + url, this.requestOptions()));
    }

    public options(url: string): Promise<ResponseData> {
        return this.asPromise(this._http.options(this.baseUrl + url, this.requestOptions()));
    }

    private asPromise(observable: Observable<Response>): Promise<ResponseData> {
        return observable.toPromise().then(res => res.json() as ResponseData);
    }

    private requestOptions() {
        const authHeader = this._authToken ? { Authorization: this._authToken } : {};
        return {
            headers: new Headers(Object.assign(this.DEFAULT_HEADERS, authHeader)),
        };
    }

    private jeroRequestOptions() {
      const authHeader = this._authToken ? { Authorization: this._authToken } : {};
      return {
        headers: new Headers(Object.assign(authHeader)),
      };
    }
}
