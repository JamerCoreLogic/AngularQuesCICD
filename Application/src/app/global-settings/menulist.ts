import { Roles } from './roles';

export class MainMenuList {
    HeaderMenuList = [
        {
            menuName: "My Account",
            navigateUrl: "agenciiq/accounts",
            roles: [Roles.MGAAdmin.roleCode, Roles.AgencyAdmin.roleCode, Roles.Agent.roleCode, Roles.Manager.roleCode, Roles.Supervisor.roleCode, Roles.SystemAdmin.roleCode]
        },        
        {
            menuName: "Manage Workbook",
            navigateUrl: "agenciiq/workbook",          
            roles: [Roles.Agent.roleCode, Roles.Supervisor.roleCode, Roles.Manager.roleCode]
        },
        {
            menuName: "Manage Agencies",
            navigateUrl: "agenciiq/agencies",
            roles: [Roles.MGAAdmin.roleCode, Roles.AgencyAdmin.roleCode]
            
        },
        {
            menuName: "Manage Users",
            navigateUrl: "agenciiq/users",
            roles: [Roles.MGAAdmin.roleCode, Roles.AgencyAdmin.roleCode, Roles.SystemAdmin.roleCode]
        },
        {
            menuName: "Book of Business Transfer",
            navigateUrl: "agenciiq/businesstransfer",
            roles: [Roles.AgencyAdmin.roleCode, Roles.Manager.roleCode, Roles.Supervisor.roleCode]
        },
        {
            menuName: "MGA Configuration",
            navigateUrl: "agenciiq/mga",
            roles: [Roles.MGAAdmin.roleCode, Roles.SystemAdmin.roleCode]
        },
        {
            menuName: "Manage Programs",
            navigateUrl: "agenciiq/programs",
            roles: [Roles.MGAAdmin.roleCode]
        },
        {
            menuName: "Manage Forms",
            navigateUrl: "agenciiq/aqforms",
            roles: [Roles.MGAAdmin.roleCode,Roles.SystemAdmin.roleCode]
        },
        {
            menuName: "Alfred Alerts Settings",
            navigateUrl: "agenciiq/alfred-alerts",
            roles: [Roles.MGAAdmin.roleCode]
        },
        {
            menuName: "Insureds/Prospects",
            navigateUrl: "agenciiq/insureds-prospects",
            roles: [Roles.MGAAdmin.roleCode]
        }
        
    ]
}