import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard  {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   const currentUser = this.authenticationService.currentUserValue;
  //   if (currentUser) {
  //     //console.log("current user",currentUser);
  //     //console.log("next user",next.data);
  //     // check if route is restricted by role
  //     let nextData = next.data['roles'];
  //     //console.log("nextData",nextData);
  //     let testData = next.data['roles'].includes(currentUser.role);
  //     //console.log("testDataCondition",testData);

  //     if (next.data['roles'] && next.data['roles'].includes(currentUser.role)) {
  //       // role not authorised so redirect to home page
  //       this.router.navigate(['/']);
  //       return false;
  //     }

  //     // authorised so return true
  //     return true;
  //   }

  //   // not logged in so redirect to login page with the return url
  //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  //   return false;
  // }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let expectedRolesArray = route.data['roles'];

    // Check if expectedRolesArray is defined
    if(expectedRolesArray){
      // Check if currentUser and its properties are defined
      if (!currentUser || !currentUser.role) {
        this.router.navigate(['login']);
        return false;
      }

      // Check if any of the user's roles matches the expected roles
      if (!currentUser.role.some((role: any) => expectedRolesArray.includes(role.roleName))) {
        this.router.navigate(['login']);
        return false;
      }

      return true;
    }

    console.error("expectedRoles is not defined");
    return false;
  }


}
