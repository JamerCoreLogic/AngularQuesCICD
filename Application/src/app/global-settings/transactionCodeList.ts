import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class TransactionCodeMaster {
    private TransactionCodeList = [
        {
            transactionCode: "NB",
            transactionName: "New Business",
            transactionColor: '#7be36b'
        },
        {
            transactionCode: "EN",
            transactionName: "Endorsement",
            transactionColor: '#f7ad23'
        },
        {
            transactionCode: "RN",
            transactionName: "Renewals",
            transactionColor: '#5ebdf7'
        },
        {
            transactionCode: "CN",
            transactionName: "Cancelled",
            transactionColor: '#FF0000'
        }
    ]

    getTransactionColor(transactionCode) {
        let filtereedTransaction: any[] = this.TransactionCodeList.filter(transaction => transaction.transactionCode == transactionCode);
        if (filtereedTransaction.length > 0) {
            return filtereedTransaction[0].transactionColor;
        }
        return "#808080";
    }

    getTransactionName(transactionCode) {
        let filtereedTransaction: any[] = this.TransactionCodeList.filter(transaction => transaction.transactionCode == transactionCode);
        if (filtereedTransaction.length > 0) {
            return filtereedTransaction[0].transactionName;
        }
        return "";
    }
}