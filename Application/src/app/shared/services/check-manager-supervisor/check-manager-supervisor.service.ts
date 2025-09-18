import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckManagerSupervisorService {

  constructor() { }

  isManagerIdAvailable(managerId, managerList: any[]) {
    if (managerList.length) {
      return managerList.some(manager => {
        return manager.managerId == managerId;
      });
    }
  }

  isSupervisorIdAvailable(supervisorId, supervisorList: any[]) {
    if (supervisorList.length) {
      return supervisorList.some(supervisor => {
        return supervisor.supervisorId == supervisorId;
      });
    }
  }

}
