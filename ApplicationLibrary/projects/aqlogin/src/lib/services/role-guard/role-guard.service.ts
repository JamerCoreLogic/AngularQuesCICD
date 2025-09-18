import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AQUserInfo } from '../data-storage/user-info/aquser-info.service';
import { AQRoleInfo } from '../data-storage/role-info/aqrole-info.service';

@Injectable({
  providedIn: 'root'
})
export class AQRoleGuard  {

  constructor(
    private roleInfo: AQRoleInfo,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
    if (this.roleInfo.Roles().length > 0) {
      if (!this.isRoleValid(route.data.roles, this.roleInfo.Roles())) {       
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
    if (this.roleInfo.Roles().length > 0) {
      if (!this.isRoleValid(route.data.roles, this.roleInfo.Roles())) {      
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  private isRoleValid(routerRoles: any[], userRoles: any[]): boolean {
    return routerRoles.some(routeRole => {
      return userRoles.some(userRole => {
        return routeRole == userRole.roleCode;
      })
    })
  }

}
