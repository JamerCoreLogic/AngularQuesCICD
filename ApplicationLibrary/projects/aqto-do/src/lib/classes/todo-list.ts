import { IToDoList, ITodoListAlert } from '../interfaces/base-todo-list-resp';

export class TodoList implements IToDoList {

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
    lob:string;
    state:string;
    note:string;
    createdOn:Date;
    transactionCode:string;

    constructor(resp: IToDoList) {
        this.quoteId = resp.quoteId;
        this.quoteNumber = resp.quoteNumber;
        this.policyNumber = resp.policyNumber;
        this.insuredName = resp.insuredName;
        this.currentStatus = resp.currentStatus;
        this.ref = resp.ref;
        this.expiryDate = resp.expiryDate;
        this.effectiveDate = resp.effectiveDate;
        this.yearsInsured = resp.yearsInsured;
        this.agentName = resp.agentName;
        this.alerts = resp.alerts;
        this.lob = resp.lob;
        this.state = resp.state?resp.state:'';
        this.note = resp.note?resp.note:'';
        this.createdOn = resp.createdOn;
        this.transactionCode = resp.transactionCode
    }
}
