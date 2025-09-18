import {
  IAlfredAlertResp,
  IAlfredAlertData,
  IAlfredAlert,
  IAlfredAlertQuotes
} from '../interfaces/base-alfred-alerts-resp';
import { AlfredAlertsQuotes } from './alfred-alert';

export class AlfredAlertResp implements IAlfredAlertResp {
  data: IAlfredAlertData = {
    alfredAlert: []
  };
  message;
  success;
  constructor(resp: IAlfredAlertResp) {
    this.success = resp.success;
    this.message = resp.message;
    this.data.alfredAlert = this.filterAlfredAlerts(resp.data.alfredAlert);
  }

  private filterAlfredAlerts(resp: IAlfredAlertQuotes[]) {    
    if(resp){
      return resp.map((res: IAlfredAlertQuotes) => {
        return new AlfredAlertsQuotes(res);
      });
    }
   
  }
}
