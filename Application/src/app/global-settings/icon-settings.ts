import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class IconSettings {

    private iconList: IIconList = {
        homeIcon: ICON_STATUS.Enabled,
        settingIcon: ICON_STATUS.Enabled,
        logoutIcon: ICON_STATUS.Enabled
    }

    private iconSetting = new BehaviorSubject(this.iconList);

    IconSetting(iconName: ICON_LIST, iconStatus: ICON_STATUS) {
        if (this.iconList[iconName]) {
            this.iconList[iconName] = iconStatus;
            this.iconSetting.next(this.iconList);
        }
    }

    IconSettingStatus() {
        return this.iconSetting;
    }

    ManageSetting(url) {
         
        if (url == '/agenciiq/users' ||
            url == '/agenciiq/workbook' ||
            url == '/agenciiq/agencies' ||
            url == '/agenciiq/businesstransfer' ||
            url == '/agenciiq/alfred-alerts' ||          
            url == '/agenciiq/programs' ||            
            url == '/agenciiq/workbook/full-quotes' ||
            url == '/agenciiq/programs/list'||
            // url == '/agenciiq/aqforms/list' ||
            url == '/agenciiq/parameters/list' ||
            url == '/agenciiq/aqforms/aqformlist' ||
            url ==  '/agenciiq/insureds-prospects' ||
            url == '/agenciiq/other-screens/list'   
        ) {
            this.IconSetting(ICON_LIST.homeIcon, ICON_STATUS.Enabled);
            this.IconSetting(ICON_LIST.logoutIcon, ICON_STATUS.Enabled);
        } else {
            this.IconSetting(ICON_LIST.homeIcon, ICON_STATUS.Disabled);
            this.IconSetting(ICON_LIST.logoutIcon, ICON_STATUS.Disabled);
        }
    }
}

export enum ICON_LIST {
    homeIcon = 'homeIcon',
    settingIcon = 'settingIcon',
    logoutIcon = 'logoutIcon'
}

export enum ICON_STATUS {
    Disabled = 'Disabled',
    Enabled = 'Enabled'
}

export interface IIconList {
    settingIcon: ICON_STATUS;
    homeIcon: ICON_STATUS;
    logoutIcon: ICON_STATUS;
}

