    export interface IToDoListResp {
        data: ITodoListData;
        success: boolean;
        message?: any;
    }
    export interface ITodoListData {
        taskSummaries: ITodoListSummary[];
        toDoLists: IToDoList[];
    }
    export interface ITodoListSummary {
        Count: number;
        Date?: any;
    }
    export interface IToDoList {
      quoteId: number;
      quoteNumber: string;
      policyNumber: string;
      ref: string;
      isOpenTask: boolean;
      insuredName: string;
      currentStatus: string;
      agentId: number;
      controlNumber: string;      
      yearsInsured: string;
      agentName: string;
      effectiveDate?: Date;
      effective_Date?: Date;
      expiryDate?: Date;
      expiry_Date?: Date;
      alerts: ITodoListAlert[];
      lob: string;
      state:string;
      note:string;
      createdOn:Date;
      transactionCode:string;
    }

    export interface ITodoListAlert {
        alferdAlertTypeID: number;
        description: string;
        iconURL: string;
    }


