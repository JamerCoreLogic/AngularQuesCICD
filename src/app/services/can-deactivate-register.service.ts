import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterTabsComponent } from '../register-tabs/register-tabs.component';

export interface CanRegisterComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateRegisterService  {

  constructor() { 
     
  }

  canDeactivate(component: RegisterTabsComponent, 
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot) {
       
      //console.log('Inside CanDeactivateRegisterService'); 

let url: string = state.url;
//console.log('Url: '+ url);

return component.canDeactivate ? component.canDeactivate() : true;
}
}
