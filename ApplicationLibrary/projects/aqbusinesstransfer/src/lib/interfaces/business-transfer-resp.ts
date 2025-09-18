export interface IBusinessTransfer {
    status?: string;
}

export interface IBusinessTransferResp {
    data: IBusinessTransfer;
    success: boolean;
    message?: any;
}