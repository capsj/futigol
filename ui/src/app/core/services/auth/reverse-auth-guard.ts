import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class ReverseAuthGuard implements CanActivate {

  private tokenCookieKey = 'fU7160l-70k3n';

    constructor(private cookieService: CookieService,
                private router: Router) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.cookieService.get(this.tokenCookieKey) !== '') {
            this.router.navigate(['sample']);
            return false;
        }
        else return true;
    }
}
