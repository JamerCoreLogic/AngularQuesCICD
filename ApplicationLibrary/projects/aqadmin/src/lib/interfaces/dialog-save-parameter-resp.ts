export interface IDialogParamFormCreateResponse {
    data: IDialogParamCreateResponse;
    success:boolean;
    message:string;
    
}

export interface IDialogParamCreateResponse {
    DialogParamForms: IDialogParamCreateData
}





export interface IDialogParamCreateData {
            parameterId: number;
            clientId: number,
            lob: any,
            parameterKey: string;
            parameterName: string;
            parameterAlias: string,
            // parameterValue: string;
            ShortName: string;
            Value: string;
            state: string;            
            usage: null;
            parameterDescription: null;
            systemUse: string;
            effectiveFrom?: any;
            effectiveTo?: any;
            isActive: boolean;
            createdBy?: number;
            createdOn: Date;
            modifiedBy?: any;
            modifiedOn?: any;
            iconURL?: any;
}