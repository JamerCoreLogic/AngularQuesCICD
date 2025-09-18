
    export interface IStripeSessionRespData {
        transation: string;
        successUrl: string;
        cancelUrl: string;
        stripeSessionId: string;
    }

    export interface IStripeSessionResp {
        data: IStripeSessionRespData;
        success: boolean;
        message?: any;
    }
