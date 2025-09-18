export interface AQFormData {
        formId: number;
        formDefinition: string;
        formExcel: string;
        fileName: string;
        lobId: number;
        formTypeId: number;
        stateId?: any;
        lobCode: string;
        lobCodeDescription: string;
        formType: string;
        formTypeDescription: string;
        stateCode?: any;
        stateCodeDescription?: any;
        xmlMapping: string;
        effectiveFrom: Date;
        effectiveTo: Date;
        isActive: boolean;
        createdOn: Date;
        createdBy: number;
        modifiedOn: Date;
        modifiedBy: number;
        noofQuotes?: any;
    }

    export interface AQFormRespons {
        aQFormResponses: AQFormData[];
    }

    export interface IAQFormListRespons {
        data: AQFormRespons;
        success: boolean;
        message: string;
    }

