import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQStage {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('STAGE'));
    }   

    StageList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}