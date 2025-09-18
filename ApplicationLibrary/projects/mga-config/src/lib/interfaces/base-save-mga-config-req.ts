export interface ISaveMgaConfiguration {
    mgaId: number;
    name: string;    
    fileName: string;
    fileData: string;
    description: string;
    addressLine1: string;
    addressLine2?: any;
    city: string;
    state: string;
    zip: string;
    contactPerson: string;
    email: string;
    phone: string;
    fax?: any;
    website: string;
    isActive: boolean;
}

export interface ISaveMgaCarriersList {
    mgaCarrierId?: number;
    mgaId?: number;
    carrierId: number;
}

export interface ISaveMgaLobsList {
    mgaLobId?: number;
    mgaId?: number;
    lobId: number;
    lobCode?: string;
}

export interface ISaveMgaStatesList {
    mgaStateId?: number;
    mgaId?: number;
    stateId: number;
}

export interface ISaveMGAConfigReq {
    UserId: number;
    ClientId: number; 
    mgaConfiguration: ISaveMgaConfiguration;
    mgaCarriersList: ISaveMgaCarriersList[];
    mgaLobsList: ISaveMgaLobsList[];
    mgaStatesList: ISaveMgaStatesList[];
}