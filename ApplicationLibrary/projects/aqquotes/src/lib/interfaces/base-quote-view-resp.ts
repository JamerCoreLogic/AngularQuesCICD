
    export interface IQuotesViewAlert {
        alferdAlertTypeID: number;
        description: string;
        iconURL: string;
    }

    export interface IQuotesViewStage {
        status: string;
        isActive: boolean;
        renewal_Date?: any;
        endorsement_Date?: any;
        cancel_Date?: any;
        created_Date: Date;
        premium: number;
        refundPremium: number;
    }

    export interface IQuotesViewQuote {
        quoteId: number;
        clientId: number;
        ref: string;
        indicationNumber: string;
        quoteNumber: string;
        lobId: number;
        lob: string;
        lobDescription: string;
        transactionId: number;
        transactionCode: string;
        agentId: number;
        agentName: string;
        agencyName: string;
        email?: any;
        phone?: any;
        yearsInsured?: any;
        alfredFlagsId?: any;
        effective_Date?: Date;
        expiry_Date?: Date;
        indicationDate: Date;
        stage: number;
        stageId: string;
        premium?: any;
        stateID: number;
        state: string;
        underwriterID?: any;
        underwriter?: any;
        underwriterAssistantID?: any;
        underwriterAssistant?: any;
        processingTypeID: number;
        processingType: string;
        carrierID: number;
        carrier: string;
        isOpenTask: boolean;
        isActive: boolean;
        createdOn: Date;
        insuredID: number;
        insuredName: string;
        website?: any;
        alerts: IQuotesViewAlert[];
        comments?: any;
        totalQuote: number;
        stages: IQuotesViewStage[];
        underwriterAssistants?: any;




        
    }

    export interface IQuotesViewData {
        quote: IQuotesViewQuote[];  
        totalQuote: number; 
        quotes: IQuotesViewQuote[];
    }

    export interface IQuotesViewResp {
        data: IQuotesViewData;
        success: boolean;
        message?: any;
    }

