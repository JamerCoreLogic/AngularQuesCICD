import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckRoleService {

  constructor() { }

  isRoleIdAvailable(roleId, roleList:any[]){
    if(roleList.length){
     return roleList.some(role=>{
        return role.roleId == roleId;
      })
    }
  }

  isRoleCodeAvailable(roleCode, roleList:any[]){
    if(roleList.length){
     return roleList.some(role=>{
        return role.roleCode == roleCode;
      })
    }
  }

}
