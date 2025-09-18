export interface IParameterKeysList {
    parameterId: number;
    clientId?: any;
    lob?: any;
    parameterKey: string;
    parameterAlias:string;
    parameterName: string;
    parameterValue: string;
    parameterDescription?: any;
    systemUse?: any;
    effectiveFrom?: any;
    effectiveTo?: any;
    isActive: boolean;
    createdBy?: number;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;
    iconURL?: any;
}

export interface IParameterKeysListData {
    parameterList: IParameterKeysList[];
}

export interface IBaseParameterKeysList {
    data: IParameterKeysListData;
    success: boolean;
    message?: any;
}