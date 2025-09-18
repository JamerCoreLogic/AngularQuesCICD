
export interface IParameterResp {
    data: IParameterData;
    success: boolean;
    message?: any;
}

export interface IParameterData {
    parameterList: IParameterList[];
}

export interface IParameterList {
    parameterId: number;
    lob?: any;
    parameterKey: string;
    parameterName: string;
    parameterValue: string;
    parameterDescription: string;
    systemUse?: boolean;
    effectiveFrom?: any;
    effectiveTo?: any;
    isActive?: boolean;
    createdBy?: number;
    createdOn?: Date;
    modifiedBy?: any;
    modifiedOn?: any;
}
