import { Injectable } from '@angular/core';
import { IKpiRespons } from '../../interface/base-kpi-res';

@Injectable({
    providedIn:'root'
})

export class AQQuotient{

    constructor(){
    }

    AQQuotient():IKpiRespons{        
        let data:IKpiRespons = JSON.parse(sessionStorage.getItem('AQQuotient'));
        return data ? data : null;
    }

    RemoveQuotientFormSession() {
        sessionStorage.removeItem('AQQuotient');
    }
}