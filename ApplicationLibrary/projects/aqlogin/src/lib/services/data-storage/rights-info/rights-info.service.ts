import { Injectable } from '@angular/core';
import { IRoleRight } from '../../../interfaces/base-login-resp';

@Injectable({
  providedIn: 'root'
})
export class AQRightsInfo {

  constructor() { }

  Rights(): IRoleRight[] {
    let rights: IRoleRight[] = JSON.parse(sessionStorage.getItem('rights'));
    return rights ? rights : null;
  }

  RightsByScreenId(screenId): IRoleRight[] {
    let rights: IRoleRight[] = JSON.parse(sessionStorage.getItem('rights'));
    if (rights.length > 0) {
      let screen: IRoleRight[] = rights.filter((rights: IRoleRight) => rights.screenId == screenId)
      if (screen.length > 0) {
        return screen;
      }
    }
    return null;
  }
}
