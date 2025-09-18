export interface IGetAdvanceFilterParameterList {
    advancedFilterId: number;
    filterName: string;
    parameters: string;
    userId: number;
    isDefault: boolean;
    createdBy?: number;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
}

export interface IGetAdvanceFilterParameterData {
    advancedFilterList: IGetAdvanceFilterParameterList[];
}

export interface IGetAdvanceFilterParameterResp {
    data: IGetAdvanceFilterParameterData;
    success: boolean;
    message?: any;
}
