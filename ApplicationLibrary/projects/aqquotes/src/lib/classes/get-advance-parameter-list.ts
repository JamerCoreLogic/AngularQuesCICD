import { IGetAdvanceFilterParameterList } from '../interfaces/base-get-advance-filter-parameter-resp';

export class GetAdvanceParameterList implements IGetAdvanceFilterParameterList {
    advancedFilterId: number;
    filterName: string;
    parameters: string;
    userId: number;
    isDefault: boolean;
    createdBy?: number;
    createdOn: Date;
    modifiedBy?: any;
    modifiedOn?: any;

    constructor(resp: IGetAdvanceFilterParameterList) {
        this.advancedFilterId = resp.advancedFilterId;
        this.filterName = resp.filterName;
        this.parameters = resp.parameters;
        this.userId = resp.userId;
        this.isDefault =  resp.isDefault;       
    }
}