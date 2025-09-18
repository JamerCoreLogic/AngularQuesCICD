export interface IDownloadExcelCreData {
    formExcel: string;
}

export interface IDownloadExcelCreResp {
    data: IDownloadExcelCreData;
    success: boolean;
    message?: any;
}