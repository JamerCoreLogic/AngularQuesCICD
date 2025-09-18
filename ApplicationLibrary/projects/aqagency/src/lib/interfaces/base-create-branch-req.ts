export interface ICreateBranchReq {
    UserID: number;
    BranchId?:number;
    BranchName?: string;
    AgencyId?: number;
    StreetAddress1?: string;
    StreetAddress2?: string;
    City?: string;
    State?: string;
    Zip?: number;
    ClientId:number
}