import { Injectable } from '@angular/core';
import { BusinessTransferApi } from '../classes/business-transfer-api';
import { IAdvanceFilterAgentResp } from '../interfaces/advance-filter-agent-resp';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdvanceFilterAgentResp } from '../classes/advance-filter-agent-resp';
import { map } from 'rxjs/operators';
import { IBusinessTransferResp } from '../interfaces/business-transfer-resp';
import { BusinessTransferResp } from '../classes/business-transfer-resp';




@Injectable({
    providedIn: 'root'
})
export class BusinessTransferService {

    confirmationMsg: string;
   

    constructor(private _businessApi: BusinessTransferApi, private _httpClient: HttpClient) { }

    GetAgents(userId: number, agentId: number): Observable<IAdvanceFilterAgentResp> {

        return this._httpClient.post<IAdvanceFilterAgentResp>(this._businessApi.agentListApi, {

            UserId: userId,
            AgentID: agentId
        })
            .pipe(
                map((resp: IAdvanceFilterAgentResp) => {

                    if (resp && resp.data && resp.data.agentsList) {
                  
                        return new AdvanceFilterAgentResp(resp);
                    }
                })
            )
    }

    TransferBusiness(userId: number, fromAgentId: string, toAgentId: number, quotes: string): Observable<IBusinessTransferResp> {

      
        return this._httpClient.post<IBusinessTransferResp>(this._businessApi.transferAPI, {

            UserId: userId,
            FromAgentId: fromAgentId,
            ToAgentId: toAgentId,
            Quotes: quotes
        })
            .pipe(
                map((resp: IBusinessTransferResp) => {
      

                    if (resp && resp.data && resp.data.status) {
      
                        return new BusinessTransferResp(resp);
                    }
                })
            )
    }

    



}
