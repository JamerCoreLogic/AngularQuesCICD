import { Injectable } from '@angular/core';
import { IRole } from '../../../interfaces/base-login-resp';

@Injectable({
  providedIn: 'root'
})
export class AQRoleInfo {

  constructor() { }

  Roles():IRole[] {
    let roles:IRole[] = JSON.parse(sessionStorage.getItem('role'))
    return roles ? roles : null;
  }

  /* Pravete Functions */

 

}
