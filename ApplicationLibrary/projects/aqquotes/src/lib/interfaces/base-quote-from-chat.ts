export interface IQuoteFromChatbotData {
    formData: string;
    formDefinition: string;
    lob: string;
    quoteType: string;
    state: string;
    formId: number;
}

export interface IQuoteFromChatbotResp {
    data: IQuoteFromChatbotData;
    success: boolean;
    message?: any;
}
