import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQCarrier {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('CARRIER'));
    }   

    CarrierList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}