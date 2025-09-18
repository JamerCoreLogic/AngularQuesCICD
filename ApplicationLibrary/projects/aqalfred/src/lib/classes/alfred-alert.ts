import { IAlfredAlert, IAlfredAlertQuotes } from '../interfaces/base-alfred-alerts-resp';

export class AlfredAlertsQuotes implements IAlfredAlertQuotes {
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
  transactionCode:string;
  agentName: string;
  lob: string;
  yearsInsured?: any;
  effectiveDate?: Date;
  expiryDate?: Date;
  indicationNumber: string;
  state: string;
  note: any;
  createdOn: any;

  constructor(resp: IAlfredAlertQuotes) {
    this.quoteId = resp.quoteId;
    this.quoteNumber = resp.quoteNumber;
    this.policyNumber = resp.policyNumber;
    this.isOpenTask = resp.isOpenTask;
    this.insuredName = resp.insuredName;
    this.alfredFlag = resp.alfredFlag;
    this.currentStatus = resp.currentStatus;
    this.alerts = resp.alerts;
    this.agentId = resp.agentId;
    this.isActive = resp.isActive;
    this.controlNumber = resp.controlNumber;
    this.ref = resp.ref;
    this.agentName = resp.agentName;
    this.lob = resp.lob;
    this.yearsInsured = resp.yearsInsured;
    this.effectiveDate = resp.effectiveDate;
    this.expiryDate = resp.expiryDate;
    this.indicationNumber = resp.indicationNumber;
    this.state = resp.state;
    this.note= resp.note;
    this.createdOn = resp.createdOn;
    this.transactionCode = resp.transactionCode;
  }
}
