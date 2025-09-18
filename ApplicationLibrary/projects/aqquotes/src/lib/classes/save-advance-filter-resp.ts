import { ISaveAdvanceFilterResp, ISaveAdvanceFilterData } from '../interfaces/base-save-advance-filter-res';

export class SaveAdvanceFilterResp implements ISaveAdvanceFilterResp {
    data:ISaveAdvanceFilterData = {
        filterResponse: []
    };
    message;
    success;

    constructor(resp:ISaveAdvanceFilterResp) {
        this.message = this.message;
        this.success = resp.success;
        this.data.filterResponse = resp.data.filterResponse;
    }
}