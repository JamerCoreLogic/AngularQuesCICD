import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParameterApi } from '../../classes/parameter-api';
import { Observable } from 'rxjs';
import { IParameterResp, IParameterList } from '../../interfaces/base-paramater-req';
import { IParameterScreenResp } from '../../interfaces/base-parameterScreen-resp';
import { map } from 'rxjs/operators';
import { ParameterResp } from '../../classes/parameter-resp';
import { ParameterByKeyResp } from '../../classes/parameterByKey-resp';
import { IDownloadParameterResp } from '../../interfaces/base-download-parameter-resp';

@Injectable({
  providedIn: 'root'
})
export class AQParameterService {

  constructor(
    private http: HttpClient,
    private api: ParameterApi
  ) { }


  getParameter(ParameterKey: any, userId: any): Observable<IParameterResp> {
    return this.http.post<IParameterResp>(this.api.parameterApi, {
      UserId: userId,
      ParameterKey: ParameterKey
    
    })
      .pipe(
        map((resp: IParameterResp) => {
          if (resp && resp.data) {

            const states = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'STATE';
            })

            if (states) {
              sessionStorage.setItem('STATES', JSON.stringify(states));
            }

            const INSTYPE = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'INSTYPE';
            })

            if (INSTYPE) {
              sessionStorage.setItem('INSTYPE', JSON.stringify(INSTYPE));
            }

            const TRANSCODE = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'TRANSCODE';
            })

            if (TRANSCODE) {
              sessionStorage.setItem('TRANSCODE', JSON.stringify(TRANSCODE));
            }

            const ALFERDALERTS = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'ALFERDALERTS';
            })

            if (ALFERDALERTS) {
              sessionStorage.setItem('ALFERDALERTS', JSON.stringify(ALFERDALERTS));
            }

            const STAGE = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'QUOTESTATUS';
            })

            if (STAGE) {
              sessionStorage.setItem('STAGE', JSON.stringify(STAGE));
            }

            const PROCESSINGTYPE = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'PROCESSING TYPE';
            })

            if (PROCESSINGTYPE) {
              sessionStorage.setItem('PROCESSINGTYPE', JSON.stringify(PROCESSINGTYPE));
            }


            const PERIOD = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'PERIOD';
            })

            if (PERIOD) {
              sessionStorage.setItem('PERIOD', JSON.stringify(PERIOD));
            }

            const CARRIER = resp.data.parameterList.filter((value: IParameterList) => {
              return value.parameterKey == 'CARRIER';
            })

            if (CARRIER) {
              sessionStorage.setItem('CARRIER', JSON.stringify(CARRIER));
            }

            return new ParameterResp(resp);
          }
        })
      )
  }

  getParameterByKey(parameterKey: any, userId: any): Observable<IParameterResp> {
    return this.http.post<IParameterResp>(this.api.parameterApi, {
      ParameterKey: parameterKey,
      UserId: userId
    })
      .pipe(
        map((resp: IParameterResp) => {
          if (resp && resp.data) {
            return new ParameterByKeyResp(resp);
          }

        })
      )
  }

  getAllParameterByKey(parameterKey: any, userId: any): Observable<IParameterResp> {
    return this.http.post<IParameterResp>(this.api.getAllParameterDataApi, {
      ParameterKey: parameterKey,
      UserId: userId
    })
      .pipe(
        map((resp: IParameterResp) => {
          if (resp && resp.data) {
            return new ParameterByKeyResp(resp);
          }

        })
      )
  }
  getParameterBySearchText(parameterKey: any, searchText: string, clientId: number, userId: number): Observable<IParameterResp> {
    return this.http.post<IParameterResp>(this.api.parameterApi, {
      ParameterKey: parameterKey,
      ParameterName: searchText,
      ClientId: clientId,
      UserId: userId
    })
      .pipe(
        map((resp: IParameterResp) => {
          if (resp) {
            return new ParameterByKeyResp(resp);
          }
        })
      )
  }

  
  

  SaveParameter(UserId: number, ParameterData: string, ParameterKey:string) {
    return this.http.post(this.api.SaveParameterApi, {
      UserId: UserId,
      ParameterData: ParameterData,
      ParameterKey: ParameterKey
    }).pipe(
      map(resp => {
        return resp;
      })
    )
  }

  DowloadParameter(parameterKey): Observable<IDownloadParameterResp> {
    return this.http.post<IDownloadParameterResp>(this.api.DownloadParameterApi, {
      "ParameterKey": parameterKey
    }).pipe(
      map((resp: IDownloadParameterResp) => {
        return resp;
      })
    )
  }


}
