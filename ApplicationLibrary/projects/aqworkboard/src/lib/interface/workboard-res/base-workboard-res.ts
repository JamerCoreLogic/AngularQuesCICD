export interface IWorkboardRes {
    data: Data;
    success: boolean;
    message?: any;
}

export interface WorkBoard {
    status: string;
    totalValue: number;
    nb: number;
    e: number;
    r: number;
}

export interface Data {
    workBoard: WorkBoard[];
}








