
export interface IParameterScreenResp {
    data: IParameterScreenData;
    success: boolean;
    message?: any;
}

export interface IParameterScreenData {
    parameterList: IParameterScreenList[];
}

export interface IParameterScreenList {
    parameterId:number;
    lob?: any;
    parameterKey: string; 
    parameterAlias: string; 
    parameterName: string;
    parameterValue: string;
    state?: any;
    usage?: any; 
    parameterDescription: string;
    systemUse?: boolean;
    effectiveFrom?: any;
    effectiveTo?: any;
    isActive?: boolean;
    createdBy?: number;
    createdOn?: Date;
    modifiedBy?: any;
    modifiedOn?: any;
    iconURL?: any; 
}
