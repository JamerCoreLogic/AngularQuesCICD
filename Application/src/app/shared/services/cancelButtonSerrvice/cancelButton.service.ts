import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { CheckRoleService } from '../check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { AQRoleInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';

@Injectable({
    providedIn:'root'
})
export class CancelButtonService {
    constructor(
        private _router: Router,
        private _checkRoleService: CheckRoleService,
        private _userRoles: AQRoleInfo,
        private _sessionService:AQSession
    ){}

    NavigateToHome(){    

        if(this._checkRoleService.isRoleCodeAvailable(Roles.Agent.roleCode, this._userRoles.Roles()) 
        || this._checkRoleService.isRoleCodeAvailable(Roles.Manager.roleCode, this._userRoles.Roles()) 
        || this._checkRoleService.isRoleCodeAvailable(Roles.Supervisor.roleCode, this._userRoles.Roles())
        ||this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._userRoles.Roles())
        || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._userRoles.Roles())
        || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._userRoles.Roles())
        || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._userRoles.Roles())) {           
              this._router.navigateByUrl('/agenciiq');           
        } else if(this._checkRoleService.isRoleCodeAvailable(Roles.AgencyAdmin.roleCode, this._userRoles.Roles()) || this._checkRoleService.isRoleCodeAvailable(Roles.SystemAdmin.roleCode, this._userRoles.Roles())) {
            this._router.navigateByUrl('/agenciiq/users');
        } else if(this._checkRoleService.isRoleCodeAvailable(Roles.MGAAdmin.roleCode, this._userRoles.Roles()) ){
            this._router.navigateByUrl('/agenciiq/agencies');
        }  
        // else if(this._checkRoleService.isRoleCodeAvailable(Roles.Underwriter.roleCode, this._userRoles.Roles())
        // || this._checkRoleService.isRoleCodeAvailable(Roles.UnderwriterAssistant.roleCode, this._userRoles.Roles())
        // || this._checkRoleService.isRoleCodeAvailable(Roles.UWManager.roleCode, this._userRoles.Roles())
        // || this._checkRoleService.isRoleCodeAvailable(Roles.UWSupervisior.roleCode, this._userRoles.Roles())){
        //   this._router.navigateByUrl('/agenciiq');
        // }    
    }
}