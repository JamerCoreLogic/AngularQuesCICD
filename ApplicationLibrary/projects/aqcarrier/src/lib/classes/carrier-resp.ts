import { ICarrierResp, ICarrierData } from '../interface/base-carrier-resp';

export class CarrierResp implements ICarrierResp {
    data: ICarrierData = {
        carrierList: []
    };
    success: boolean;
    message?: any;

    constructor(resp: ICarrierResp) {
        this.success = resp.success;
        this.message = resp.message;
        this.data.carrierList = resp.data.carrierList;
    }
}