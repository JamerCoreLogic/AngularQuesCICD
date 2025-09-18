import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckRoleService {
  public addNewUserSubject = new BehaviorSubject<string>('');
  public addNewAgencySubject = new BehaviorSubject<string>('');
  public addNewParameterSubject = new BehaviorSubject<string>('');
  public addNewOtherScreenSubject = new BehaviorSubject<string>('');
  dashboardNotifier$ = new Subject<{ data: any; status: string }>();
  public addNewQuoteSubject = new BehaviorSubject<string>('');
  public addNewMyDiarySubject = new BehaviorSubject<string>('');
  public addNewMasterSubject = new BehaviorSubject<string>('');
  public addNewMasterKeySubject = new BehaviorSubject<string>('');
  public getNewMasterKeySubject = new BehaviorSubject<string>('');
  public updateMgaConfigSubject = new BehaviorSubject<string>('');
  public fromDiarySubject = new BehaviorSubject<string>('');
  constructor() { }

  isRoleIdAvailable(roleId, roleList: any[]) {
    if (roleList.length) {
      return roleList.some(role => {
        return role.roleId == roleId;
      })
    }
  }

  isRoleCodeAvailable(roleCode, roleList: any[]) {
    if (roleList?.length) {
      return roleList.some(role => {
        return role.roleCode == roleCode;
      })
    }
  }

}
