export interface IDownloadParameterData {
    parameterData: string;
}

export interface IDownloadParameterResp {
    data: IDownloadParameterData;
    success: boolean;
    message?: any;
}