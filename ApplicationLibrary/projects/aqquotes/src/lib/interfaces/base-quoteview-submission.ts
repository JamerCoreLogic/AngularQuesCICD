    export interface Stage {
        status: string;
        isActive: boolean;
        renewal_Date?: any;
        endorsement_Date?: any;
        cancel_Date?: any;
        created_Date: Date;
        premium: number;
        refundPremium: number;
    }

    export interface Quotes {
        quoteId: number;
        clientId: number;
        controlNumber: string;
        ref: string;
        indicationNumber: string;
        quoteNumber: string;
        policyNumber?: any;
        lobId: number;
        lob: string;
        lobDescription: string;
        transactionId: number;
        transactionCode: string;
        quoteDetails?: any;
        agentId: number;
        comments:any;
        agentName: string;
        agencyName: string;
        email: string;
        phone: string;
        oldAgentId?: any;
        oldAgentTransferDate?: any;
        submissionNumber: string;
        yearsInsured?: any;
        isTempEndorsement?: any;
        alfredFlags?: any;
        alfredFlagsId?: any;
        endorsementNumber?: any;
        endorsementExpiryDate?: any;
        bindRequestNumber?: any;
        effective_Date?: any;
        expiry_Date?: any;
        indicationDate: Date;
        submissionDate?: any;
        quoteDate: Date;
        bindRequestDate?: any;
        inceptionDate?: any;
        indicationVersion?: any;
        quoteVersion?: any;
        policyVersion?: any;
        stage: number;
        stageId: string;
        premium: number;
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
        isCancelled: boolean;
        isClosed: boolean;
        createdBy?: any;
        createdOn: Date;
        insuredID: number;
        insuredName: string;
        alerts: any[];
        currentStatus?: any;
        stages: Stage[];
        underwriterAssistants?: any;
    }

    export interface IQuoteViewSubmissionData {
        quote?: any;
        quotes: Quotes;
    }

    export interface IQuoteViewSubmissionResp {
        data: IQuoteViewSubmissionData;
        success: boolean;
        message?: any;
    }



