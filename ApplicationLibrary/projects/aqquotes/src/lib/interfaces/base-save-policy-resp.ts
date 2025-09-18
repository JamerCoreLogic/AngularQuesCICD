
    export interface ISavePolicyRespInsureds {
        insuredId: number;
        firstName: string;
        middleName?: any;
        lastName?: any;
        titleId?: any;
        phoneCell?: any;
        phoneHome?: any;
        phoneOffice?: any;
        fax?: any;
        email?: any;
        website?: any;
        addressLine1?: any;
        addressLine2?: any;
        city?: any;
        state?: any;
        zip?: any;
        isActive: boolean;
        createdBy?: any;
        createdOn: Date;
        modifiedBy?: any;
        modifiedOn?: any;
    }

    export interface ISavePolicyRespPolicies {
        quoteId: number;
        controlNumber: string;
        ref?: any;
        lob?: any;
        lobDescription?: any;
        transactionCode?: any;
        quoteDetails?: any;
        agentId: number;
        indicationNumber: string;
        submissionNumber: string;
        quoteNumber: string;
        policyNumber?: any;
        isTempEndorsement?: any;
        endorsementNumber?: any;
        endorsementDate?: any;
        endorsementExpiryDate?: any;
        effectiveDate?: any;
        expiryDate?: any;
        indicationDate: Date;
        submissionDate?: any;
        quoteDate: Date;
        bindRequestDate?: any;
        inceptionDate?: any;
        cancelDate?: any;
        renewalDate?: any;
        finalCancelDate?: any;
        reinstateDate?: any;
        indicationVersion?: any;
        quoteVersion?: any;
        policyVersion?: any;
        stateId: number;
        stageId: string;
        state?: any;
        premium?: any;
        carrier?: any;
        carrierID: number;
        processingTypeID: number;
        processingType?: any;
        isOpenTask: boolean;
        isActive: boolean;
        isCancelled: boolean;
        isClosed: boolean;
        createdBy?: any;
        createdOn: Date;
        modifiedBy?: any;
        modifiedOn?: any;
        insureds: ISavePolicyRespInsureds;
    }

    export interface ISavePolicyRespPolicyDetails {
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

    export interface ISavePolicyRespFormDefinition {
        formId: number;
        formDefinition: string;
        formDataModel: string;
        lob: string;
        formType: string;
        state: string;
        xmlMapping: string;
        effectiveFrom: Date;
        effectiveTo: Date;
        isActive: boolean;
        createdOn: Date;
        createdBy: number;
        modifiedOn: Date;
        modifiedBy: number;
    }

    export interface ISavePolicyRespData {
        policies: ISavePolicyRespPolicies;
        policyDetails: ISavePolicyRespPolicyDetails;
        formDefinition: ISavePolicyRespFormDefinition;
    }

    export interface ISavePolicyResp {
        data: ISavePolicyRespData;
        success: boolean;
        message: string;
    }

