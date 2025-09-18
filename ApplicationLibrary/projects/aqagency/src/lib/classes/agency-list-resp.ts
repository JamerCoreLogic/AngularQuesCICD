import { IAgencyListResp, IAgencyList, IAgencyListData, IBranchDetails } from '../interfaces/base-agency-list-resp';
import { AgencyDetailsResp } from '../classes/agency-details';
import { BranchDetails } from '../classes/branch-details';

export class AgencyListResp implements IAgencyListResp {
    message: string;
    success: boolean;
    data: IAgencyListData = {
        agencyList: [],
    };

    constructor(resp: IAgencyListResp) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.agencyList = this.filterAgencyList(resp.data.agencyList);
    }

    private filterAgencyList(agencyList: IAgencyList[]): IAgencyList[] {
        let _agencyList: IAgencyList[] = [];
        agencyList.forEach((item: IAgencyList) => {
            let obj: IAgencyList = {
                agency : null,
                branches : [],
                agencyPrograms : []
            };
            obj.agency = new AgencyDetailsResp(item.agency);
            obj.branches = item.branches.map((respItem: IBranchDetails) => {
                return new BranchDetails(respItem);
            });
            obj.agencyPrograms = item.agencyPrograms;
            _agencyList.push(obj);
        });
        return _agencyList;
    }
}



