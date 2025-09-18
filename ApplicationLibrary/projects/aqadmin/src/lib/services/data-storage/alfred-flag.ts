import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQAlfredFlag {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('ALFERDALERTS'));
    }   

    AlfredFlagList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}