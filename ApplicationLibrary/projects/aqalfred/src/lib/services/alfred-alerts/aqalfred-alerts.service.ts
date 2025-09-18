import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AlfredAlertAPI } from "../../classes/alfred-alert-api";
import { IAlfredAlertsReq } from "../../interfaces/base-alfred-alerts-req";
import { IAlfredAlertResp } from "../../interfaces/base-alfred-alerts-resp";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AlfredAlertResp } from "../../classes/alfred-alerts-resp";

@Injectable({
  providedIn: "root"
})
export class AQAlfredAlertsService {
  constructor(private http: HttpClient, private api: AlfredAlertAPI) {}

  AlfredAlerrts(
    userID: number,
    agentID: number,
    agencyID: number
  ): Observable<IAlfredAlertResp> {
    const reqObj: IAlfredAlertsReq = {
      UserId: userID,
      AgentId: agentID,
      AgencyId: agencyID
    };
    return this.http.post<IAlfredAlertResp>(this.api.AlfredAlertAPI,reqObj).pipe(
      map((resp: IAlfredAlertResp) => {
        if (resp && resp.data) {
          return new AlfredAlertResp(resp);
        }
      })
    );
  }
}
