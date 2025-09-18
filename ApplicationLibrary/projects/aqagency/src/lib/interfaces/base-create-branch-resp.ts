export interface ICreateBranchResp {
    data: ICreateBranchData;
    success: boolean;
    message: string;
}

export interface ICreateBranchData {
    branch: ICreateBranch;
}

export interface ICreateBranch {
    branchId: number;
    branchName: string;
    agencyId: string;
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    state: string;
    zip: string;
    isActive: boolean;
    createdBy: string;
    createdOn: Date;
    modifiedBy: string;
    modifiedOn?: any;
}

