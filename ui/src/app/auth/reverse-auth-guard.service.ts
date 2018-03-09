import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ReverseAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private location: Location) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    public checkLogin(url: string): boolean {
        if (!this.authService.isLoggedIn) { return true; }
        this.router.navigate(['/admin/panel/suppliers']);
        return false;
    }
}
