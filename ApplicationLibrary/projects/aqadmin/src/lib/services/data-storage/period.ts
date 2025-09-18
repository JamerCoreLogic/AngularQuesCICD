import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQPeriod {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('PERIOD'));
    }   

    PeriodList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}