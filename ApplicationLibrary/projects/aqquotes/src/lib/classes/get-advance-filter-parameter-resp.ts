import { IGetAdvanceFilterParameterResp, IGetAdvanceFilterParameterData, IGetAdvanceFilterParameterList } from '../interfaces/base-get-advance-filter-parameter-resp';
import { GetAdvanceParameterList } from '../classes/get-advance-parameter-list';

export class GetAdvanceFilterParameter implements IGetAdvanceFilterParameterResp {
    data: IGetAdvanceFilterParameterData = {
        advancedFilterList: []
    };
    message;
    success;

    constructor(resp: IGetAdvanceFilterParameterResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.advancedFilterList = this.fitlerAdvanceParameterList(resp.data.advancedFilterList);
    }

    private fitlerAdvanceParameterList(resp: IGetAdvanceFilterParameterList[]) {
        if (resp && resp.length) {
            return resp.map((respObject: IGetAdvanceFilterParameterList) => {
                return new GetAdvanceParameterList(respObject);
            })
        }
    }
}