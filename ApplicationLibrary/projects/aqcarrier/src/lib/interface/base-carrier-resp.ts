export interface ICarrierList {
    carrierId: number;
    carrier: string;
    isActive: boolean;
}

export interface ICarrierData {
    carrierList: ICarrierList[];
}

export interface ICarrierResp {
    data: ICarrierData;
    success: boolean;
    message?: any;
}