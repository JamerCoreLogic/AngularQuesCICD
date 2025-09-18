import { IMGAConfigResp, IMGAConfigData } from '../interfaces/base-mga-config-resp';

export class MGAConfigResp implements IMGAConfigResp {
    data: IMGAConfigData = {
        mgaCarriersList: [],
        mgaConfiguration: null,
        mgaLobsList: [],
        mgaStatesList: []
    }
    message: any;
    success: boolean;

    constructor(resp: IMGAConfigResp) {
        this.success = resp.success;
        this.message = resp.message;
        this.data = resp.data;
    }
}