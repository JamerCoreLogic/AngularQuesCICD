export interface IAlfredAlertResp {
  data: IAlfredAlertData;
  success: boolean;
  message?: any;
}

export interface IAlfredAlertData {
  alfredAlert: IAlfredAlertQuotes[];
}

export interface IAlfredAlertQuotes {
  quoteId: number;
  quoteNumber: string;
  policyNumber: string;
  isOpenTask?: boolean;
  insuredName: string;
  alfredFlag: string;
  currentStatus?: any;
  alerts: IAlfredAlert[];
  agentId: number;
  isActive: boolean;
  controlNumber: string;
  ref: string;
  agentName: string;
  lob: string;
  yearsInsured?: any;
  effectiveDate?: Date;
  expiryDate?: Date;
  indicationNumber: string;
  state:string;
  note:string;
  createdOn:Date;
  transactionCode:string;
}


export interface IAlfredAlert {
  alferdAlertTypeID: number;
  description: string;
  iconURL: string;
}


