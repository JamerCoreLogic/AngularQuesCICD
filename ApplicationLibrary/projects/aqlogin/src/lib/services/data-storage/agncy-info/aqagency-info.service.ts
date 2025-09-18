import { Injectable } from '@angular/core';
import { IAgency } from '../../../interfaces/base-login-resp';

@Injectable({
  providedIn: 'root'
})

export class AQAgencyInfo {

  constructor() { }

  Agency(): IAgency {
    let agency: IAgency = JSON.parse(sessionStorage.getItem('agency'));
    return agency ? agency : null;
  }

  AgencyId(): Number {
    return this.Agency() && this.Agency().agencyId ? this.Agency().agencyId : 0;
  }

  AgencyName(): String {
    return this.Agency() && this.Agency().agencyName ? this.Agency().agencyName : '';
  }
}
