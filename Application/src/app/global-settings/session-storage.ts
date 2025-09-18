import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AQSession {

    constructor(){

    }

    setData(sessionID, sessionValue){
         
        sessionStorage.setItem(sessionID, JSON.stringify(sessionValue));
    }

    getData(sessionID){
         
         let value = sessionStorage.getItem(sessionID);
         return JSON.parse(value);
    }

    removeSession(sessionID){
        sessionStorage.removeItem(sessionID);
    }

}