export interface IGetConfiguration {
    data: IGetConfigurationData;
    success: boolean;
    message?: any;
  }
  
  export interface IGetConfigurationData {
    mgaConfiguration: IMgaConfiguration;
    mgaCarriersList?: any;
    mgaLobsList?: any;
    mgaStatesList?: any;
  }
  
  export interface IMgaConfiguration {
    mgaId: number;
    name: string;
    logoURL?: any;
    aqLogoURL?:any;
    aqFavIconURL?:any;
    aqBannerURL?:any;
    description: string;
    addressLine1: string;
    addressLine2?: any;
    city: string;
    state: string;
    stateCode: string;
    zip: string;
    contactPerson: string;
    email: string;
    phone?: any;
    phoneCell: string;
    phoneHome: string;
    phoneOffice: string;
    fax: string;
    website: string;
    isActive: boolean;
  }