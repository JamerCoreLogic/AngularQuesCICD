export interface IMGAConfigResp {
    data: IMGAConfigData;
    success: boolean;
    message?: any;
}

export interface IMGAConfigData {
    mgaConfiguration: IMgaConfiguration;
    mgaCarriersList: IMgaCarriersList[];
    mgaLobsList: IMgaLobsList[];
    mgaStatesList: IMgaStatesList[];
}

export interface IMgaConfiguration {
    mgaId: number;
    name: string;
    description: string;
    addressLine1: string;
    addressLine2?: any;
    city: string;
    state: string;
    stateCode: string;
    zip: string;
    contactPerson: string;
    email: string;
    phone: string;
    fax?: any;
    website: string;
    isActive: boolean;
    phoneCell: string;
    phoneHome: string;
    phoneOffice: string;
}

export interface IMgaCarriersList {
    mgaCarrierId: number;
    mgaId: number;
    carrierId: number;
    carrierName: string;
}

export interface IMgaLobsList {
    mgaLobId: number;
    mgaId: number;
    lobId: number;
    lobCode: string;
}

export interface IMgaStatesList {
    mgaStateId: number;
    mgaId: number;
    stateId: number;
    state: string;
}




