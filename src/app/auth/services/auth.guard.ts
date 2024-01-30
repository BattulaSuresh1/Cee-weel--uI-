import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { retry } from 'rxjs/operators';
import { Role } from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router, private authenticationService:AuthenticationService){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if ( this.authenticationService.isLoggedIn()  && this.authenticationService.hasRole()){

        console.log(`hasRole`,this.authenticationService.hasRole())
        const roles = route.data.allowedRoles as Role[];

         console.log(roles);

        if((roles != undefined ) && (roles.length > 0)){

          let rolefinded = roles.filter(r => r == this.authenticationService.hasRole());

          if( rolefinded && rolefinded.length > 0 ) {
            return true;
          }

          this.router.navigate(['/access-denied']);
          return false;
        }

        return true;

      } else  {

        this.router.navigate( ["/login"] );
        return false;

      }
  }
  
}
