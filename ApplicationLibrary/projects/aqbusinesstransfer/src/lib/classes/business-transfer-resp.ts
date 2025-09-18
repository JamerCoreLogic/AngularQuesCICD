import { IBusinessTransferResp, IBusinessTransfer } from '../interfaces/business-transfer-resp';

export class BusinessTransferResp implements IBusinessTransferResp {
    data: IBusinessTransfer = {
        status:''
    };
    message;
    success;

    constructor(resp: IBusinessTransferResp) {
        this.message = resp.message;
        this.success = resp.success;
        
    }

    
}