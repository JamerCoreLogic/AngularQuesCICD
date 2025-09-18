export interface ISaveAdvanceFilterResp {
    data: ISaveAdvanceFilterData;
    success: boolean;
    message: string;
}

export interface ISaveAdvanceFilterData {
    filterResponse: ISaveFilterResponse[];
}

export interface ISaveFilterResponse {
    advancedFilterId: number;
    filterName: string;
    FilterParticulars: string,
    parameters: string;
    userId: number;
    IsDefault: boolean;
    createdBy: number;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
}

