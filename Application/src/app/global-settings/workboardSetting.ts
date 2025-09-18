import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class workboardSettings {

    //period = new BehaviorSubject('Month');
    workboardData = new BehaviorSubject('');

    constructor(){

    }

    // set SetPeriod(value) {
    //     this.period.next(value);
    // }

   set setworkboardData(value) {
        
        this.workboardData.next(value);
}


}