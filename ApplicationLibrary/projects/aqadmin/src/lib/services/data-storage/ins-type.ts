import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQInsType {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('INSTYPE'));
    }   

    InsTypeList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}