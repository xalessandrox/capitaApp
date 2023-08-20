import { Injectable } from '@angular/core';
import { UserService } from "../services/user.service";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable( {
  providedIn : 'root'
} )

export class AuthenticationGuard {

  constructor( private userService: UserService, private router: Router ) {
  }

  canActivate( routSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    return this.isAuthenticated();
  }

  private isAuthenticated(): boolean {
    if (this.userService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate( [ '/login' ] );
      return false;
    }
  }

}