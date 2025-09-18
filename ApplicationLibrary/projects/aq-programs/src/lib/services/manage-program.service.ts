import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProgramApi } from '../class/program-api';
import { IManageProgramResp } from '../interface/base-program-resp';
import { IAQProgramResp } from '../interface/base-aq-program-resp';
import { IAQProgramSaveRequest } from '../interface/add-aq-program-req'
import { IAQProgramByIdRequest } from '../interface/get-program-byId-req'
import { IAQProgramByIdResp } from '../interface/get-program-byId-resp'
import { IAQProgramAddResp } from '../interface/add-aq-program-resp'
import { ManageProgramResp } from '../class/program-resp';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MAnageProgramService {

  constructor(
    private _http: HttpClient,
    private api: ProgramApi
  ) { }

  ManagePrograms(UserId: number, ClientId: any): Observable<IManageProgramResp>{
    return this._http.post<IManageProgramResp>(this.api.programApi, {
      "UserId": UserId,
      "ClientId": ClientId
    }).pipe(
      map((resp: IManageProgramResp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }


  AQProgram(UserId: any): Observable<IAQProgramResp>{
    return this._http.post<IAQProgramResp>(this.api.AQProgramApi, {
      UserId: UserId,
    }).pipe(
      map((resp: IAQProgramResp) => {
        if (resp) {
          return resp;
        }
      })
    )
  }


  SaveAQProgram(AQProgramSaveRequest: IAQProgramSaveRequest): Observable<IAQProgramAddResp> {
    return this._http.post<IAQProgramAddResp>(this.api.saveAQProgramApi, AQProgramSaveRequest)
      .pipe(
        map((resp: IAQProgramAddResp) => {
          return resp;
        })
      )
  }

  

  GetProgramByIDApi(AQProgramByIdRequest: IAQProgramByIdRequest): Observable<IAQProgramByIdResp> {
    return this._http.post<IAQProgramByIdResp>(this.api.GetProgramByIDApi, AQProgramByIdRequest)
      .pipe(
        map((resp: IAQProgramByIdResp) => {
          return resp;
        })
      )
  }


}