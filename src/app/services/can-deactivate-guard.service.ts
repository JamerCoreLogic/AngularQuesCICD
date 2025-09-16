import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AddUserTabsComponent } from '../admin/add-user-tabs/add-user-tabs.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService  {

  constructor() { }

  canDeactivate(component: AddUserTabsComponent, 
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot) {
       

let url: string = state.url;
//console.log('Url: '+ url);

return component.canDeactivate ? component.canDeactivate() : true;
}

}
