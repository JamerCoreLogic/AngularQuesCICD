import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQTransactionType {
    constructor(){

    }

    private transactionType():IParameterList {
        return JSON.parse(sessionStorage.getItem('TRANSCODE'));
    }   

    TransactionTypeList():IParameterList{
       return this.transactionType() ? this.transactionType() : null;
    }

}