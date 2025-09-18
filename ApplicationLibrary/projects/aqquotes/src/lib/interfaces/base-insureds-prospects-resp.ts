export interface InsuredsProspectsResponse {
        insuredId: number;
        quoteId: number;
        firstName: string;
        middleName: string;
        lastName: string;
        insuredName: string;
        phoneCell: string;
        email: string;
        stateId: number;
        state: string;
        city: string;
        zip: string;
        isActive: boolean;
    }

    export interface IInsuredsProspectsData {
        insureds: InsuredsProspectsResponse[];
    }

    export interface IInsuredsProspects {
        data: IInsuredsProspectsData;
        success: boolean;
        message: any;
    }



