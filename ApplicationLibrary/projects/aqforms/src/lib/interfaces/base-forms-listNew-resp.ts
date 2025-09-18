export interface INewFormsListResponse {
    data: AQNewFormResponse;
    success: boolean;
    message: string
}

export interface AQNewFormResponse {
    aQFormResponses: AQNewFormData[]
}


export interface AQNewFormData {
    formType: string,
    state: string,
    lob:string

}

