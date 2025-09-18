export interface IManageProgramResp {
    data: IData;
    success: boolean;
    message: string;
  }
  
  export interface IData {
    getProgramsList: IGetProgramsList[];
  }
  
  export interface IGetProgramsList {
    programId: number;
    programName: string;
    carrierId: number;
    carrier: string;
    isActive: boolean;
    description: string;
    effectiveDate: string;
    expirationDate: string;

   
    formData: string;
    formID: number;
   
    createdBy?: number;
    createdOn?: Date;
    modifiedOn?: Date;
    modifiedBy?: number;
    
  }




