

    export interface IIssueQuoteResp {
        data: IIssueQuoteData;
        success: boolean;
        message: string;
    }

    export interface IIssueQuoteData {
        policies?: any;
        policyDetails: IIssueQuotePolicyDetails;
        formDefinition: IIssueQuoteFormDefinition;
    }

    export interface IIssueQuotePolicyDetails {
        quoteDetailsId: number;
        formId: number;
        quoteId: number;
        quoteXml: string;
        quoteJson: string;
        isActive?: any;
        createdOn: Date;
        createdBy: number;
        modifiedOn?: any;
        modifiedBy?: any;
    }

    export interface IIssueQuoteFormDefinition {
        formId: number;
        formDefinition: string;
        lob: string;
        formType: string;
        state: string;
        xmlMapping: string;
        effectiveFrom: Date;
        effectiveTo: Date;
        isActive: boolean;
        createdOn: Date;
        createdBy: number;
        modifiedOn?: any;
        modifiedBy?: any;
    }

   

   

