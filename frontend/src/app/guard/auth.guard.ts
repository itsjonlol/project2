import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { FireAuthService } from '../services/fire-auth.service';
import { inject, Injectable } from '@angular/core';
import { Observable, take, map, tap } from 'rxjs';

@Injectable(
    {providedIn:'root'}
)
export class AuthGuard implements CanActivate {
  constructor(private fireAuthService: FireAuthService, private router: Router) {}
  // check if user is logged in. I want to guard every route except login/register.
  // user needs to be logged in to access the rest of the site
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      return this.fireAuthService.user$.pipe(
           take(1),
           map(user => !!user), 
           tap(loggedIn => {
             if (!loggedIn) {

               this.router.navigate(['/login']);
             }
         })
    )
  }
}
