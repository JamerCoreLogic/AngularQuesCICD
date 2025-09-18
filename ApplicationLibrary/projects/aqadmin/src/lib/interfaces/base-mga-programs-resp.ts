export interface IMgaLobs {
    mgaLobId: number;
    mgaId: number;
    lobId: number;
    lobCode?: any;
    lob: string;
    lobName: string;
    createdOn: Date;
    createdBy?: any;
    modifiedOn?: any;
    modifiedBy?: any;
}

export interface IMgaState {
    stateId: number;
    stateCode: string;
    state: string;
}

export interface IMgaProgramList {
    mgaLobs: IMgaLobs;
    mgaStates: IMgaState[];
}

export interface IMGAProgramsData {
    mgaProgramList: IMgaProgramList[];
}

export interface IMGAProgramsResp {
    data: IMGAProgramsData;
    success: boolean;
    message: string;
}











