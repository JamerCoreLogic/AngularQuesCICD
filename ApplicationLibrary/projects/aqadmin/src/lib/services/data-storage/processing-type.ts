import { IParameterList } from '../../interfaces/base-paramater-req';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})

export class AQProcessingType {
    constructor(){

    }

    private getData():IParameterList {
        return JSON.parse(sessionStorage.getItem('PROCESSINGTYPE'));
    }   

    ProcessingTypeList():IParameterList{
       return this.getData() ? this.getData() : null;
    }

}