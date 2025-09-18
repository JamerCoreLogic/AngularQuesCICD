import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AQUserInfo } from '../data-storage/user-info/aquser-info.service';


@Injectable({
  providedIn: 'root'
})
export class AQRouteGuard  {
  
  constructor(
    private router: Router,
    private userInfo: AQUserInfo
  ) { }

  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if (this.userInfo.UserId() && this.userInfo.UserName()) {
      return true;
    }
    this.router.navigate(['/']/* , { queryParams: { returnUrl: state.url } } */); 
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if (this.userInfo.UserId() && this.userInfo.UserName()) {
      return true;
    }
    this.router.navigate(['/']/* , { queryParams: { returnUrl: state.url } } */);
    return false;
  }  
}
