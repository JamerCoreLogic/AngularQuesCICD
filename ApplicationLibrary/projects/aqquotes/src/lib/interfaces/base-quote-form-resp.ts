 export interface IQuoteFormpData {
        quoteId: number;
        formDefinition: string;
        formData: string;
    }

    export interface IQuoteFormResp {
        data: IQuoteFormpData;
        success: boolean;
        message?: any;
    }


