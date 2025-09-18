
    export interface WorkboardPeriod {
        retSeq: number;
        periodType: string;
        startDate: Date;
        endDate: Date;
        displayValue: string;
    }

    export interface IWorkboardPeriodData {
        workboardResponse: WorkboardPeriod[];
    }

    export interface IWorkboardPeriodRes {
        data: IWorkboardPeriodData;
        success: boolean;
        message?: any;
    }

