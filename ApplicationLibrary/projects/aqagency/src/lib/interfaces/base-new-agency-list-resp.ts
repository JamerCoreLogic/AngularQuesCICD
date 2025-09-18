export interface IAgencyListDetail {
        userId: number;
        agencyId: number;
        managerId: number;
        manager?: any;
        supervisorId: number;
        supervisor?: any;
        isActive: boolean;
        agentName?: any;
        agencyName: string;
        contactPerson: string;
        phoneCell: string;
        phoneHome: string;
        phoneOffice: string;
        fax: string;
        email: string;
        npn: string;
        npnExpirationDate: Date;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        zip: string;
        createdBy: number;
        createdOn: Date;
        modifiedBy: number;
        modifiedOn: Date;
        registered: string;
    }

    export interface IAgencyList {
        agencyList: IAgencyListDetail[];
    }

    export interface INewAgencyListResp {
        data: IAgencyList;
        success: boolean;
        message?: any;
    }
