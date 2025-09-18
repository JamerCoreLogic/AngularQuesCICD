import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQStates {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('STATES'));
    }   

    StateList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}