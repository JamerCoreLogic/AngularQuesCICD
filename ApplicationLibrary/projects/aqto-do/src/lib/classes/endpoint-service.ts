import { Injectable } from '@angular/core';

@Injectable({
        providedIn:'root'
        
})
export class endpointService {

apiEndPoint:string

set apiEndPointValue(value: string){
        this.apiEndPoint = value
}
    
}