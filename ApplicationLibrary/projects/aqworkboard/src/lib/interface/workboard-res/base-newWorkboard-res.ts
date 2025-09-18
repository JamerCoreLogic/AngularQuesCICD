// export interface Trasaction {
//         status: string;
//         totalValue: number;
//         nb: number;
//         e: number;
//         r: number;
//     }

//     export interface Data {
//         trasaction: Trasaction[];
//         notifications?: any;
//         alerts?: any;
//     }

//     export interface INewWorkboardRes {
//         data: Data;
//         success: boolean;
//         message: string;
//     }


export interface Data {
    trasaction: any[][];
    notifications?: any;
    alerts?: any;
}

export interface INewWorkboardRes {
    data: Data;
    success: boolean;
    message: string;
}


