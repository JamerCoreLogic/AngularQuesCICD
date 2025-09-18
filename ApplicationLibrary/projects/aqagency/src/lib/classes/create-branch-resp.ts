import { ICreateBranchResp } from '../interfaces/base-create-branch-resp';

export class CreateBranchResp implements ICreateBranchResp {
    data: null;
    success: boolean;
    message: string;

    constructor(resp: ICreateBranchResp) {
        this.success = resp.success;
        this.message = resp.message;
    }
}