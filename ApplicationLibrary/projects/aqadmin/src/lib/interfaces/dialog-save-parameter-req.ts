export interface IDialogParamCreateReq {
    UserId: number;
    ParameterId: number;
    ParameterKey: string;
    ParameterName: string;
    // ParameterValue: string;
    ShortName: string;
    Value: string;
    effectiveFrom?: any;
    effectiveTo?: any;
    isActive: boolean;
}
