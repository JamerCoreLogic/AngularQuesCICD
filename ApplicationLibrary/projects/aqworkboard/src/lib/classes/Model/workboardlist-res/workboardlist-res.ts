import { IWorkboardRes, WorkBoard, Data } from '../../../interface/workboard-res/base-workboard-res';



export class WorkboardListResp implements IWorkboardRes {
    message: string;
    success: boolean;
    data: Data = {
        workBoard: []
    };

    constructor(resp: IWorkboardRes) {
        this.message = resp.message;
        this.success = resp.success;
        this.data.workBoard = this.assignworkboardList(resp.data.workBoard);
    }

    private assignworkboardList(workList: WorkBoard[]) {

        let _workboardList: any = workList.map((respItem: WorkBoard) => {
            let _workboardList: WorkBoard = {
                status: respItem.status,
                totalValue: respItem.totalValue,
                nb: respItem.nb,
                e: respItem.e,
                r: respItem.r

            }
            return _workboardList;
        })

        return _workboardList;

    }
}
