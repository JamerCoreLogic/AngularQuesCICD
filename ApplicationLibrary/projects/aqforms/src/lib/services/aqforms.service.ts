import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFormsListRequest } from '../interfaces/base-forms-list-req';
import { IFormsListNewRequest } from '../interfaces/base-forms-listNew-req'
import { IFormsListResponse } from '../interfaces/base-forms-list-resp';
import { INewFormsListResponse } from '../interfaces/base-forms-listNew-resp'
import { AQFormsApi } from '../classes/forms-api';
import { IFormGetRequest } from '../interfaces/base-forms-get-req';
import { IFormGetResponse } from '../interfaces/base-forms-get-resp';
import { IUploadFormRequest } from '../interfaces/base-form-upload-req';
import { IFormCreateRequest } from '../interfaces/base-forms-create-req';
import { IFormCreateResponse } from '../interfaces/base-forms-create-resp';
import { IDownloadExcelCreateReq } from '../interfaces/download-formExcel-req';
import { IDownloadExcelCreResp } from '../interfaces/download-formExcel-resp';
import { IaqFormListReq } from '../interfaces/base-aqForm-list-req';
import { IAQFormListRespons } from '../interfaces/base-aqForm-list-resp'





@Injectable({
    providedIn: 'root'
})
export class AQFormsService {



    constructor(private _aqFormsApi: AQFormsApi, private _httpClient: HttpClient) { }

    GetFormsList(formsListRequest: IFormsListRequest): Observable<IFormsListResponse> {
        
        return this._httpClient.post<IFormsListResponse>(this._aqFormsApi.formsListApi, formsListRequest)
            .pipe(
                map((resp: IFormsListResponse) => {

                    if (resp && resp.data && resp.data.aQFormResponses) {

                        return resp;
                    }
                })
            )
    }

    GetNewFormsList(formsListNewRequest: IFormsListNewRequest): Observable<INewFormsListResponse> {

        
        return this._httpClient.post<INewFormsListResponse>(this._aqFormsApi.getFormsNewApi, formsListNewRequest)
            .pipe(
                map((resp: INewFormsListResponse) => {

                    if (resp) {

                        return resp;
                    }
                })
            )
    }

    GetFormById(formsGetRequest: IFormGetRequest): Observable<IFormGetResponse> {

       
        return this._httpClient.post<IFormGetResponse>(this._aqFormsApi.formsGetApi, formsGetRequest)
            .pipe(
                map((resp: IFormGetResponse) => {

                    if (resp && resp.data && resp.data.aQFormResponses) {

                        return resp;
                    }
                })
            )
    }
    GetAQFormJSON(uploadFormRequest: IUploadFormRequest): any {

        
        return this._httpClient.post<any>(this._aqFormsApi.formsExcelUploadApi, uploadFormRequest)
            .pipe(
                map((resp: any) => {

                    return resp;
                })
            )
    }

    SaveAQFormWithExcel(formCreateRequest: IFormCreateRequest): Observable<IFormCreateResponse> {
        return this._httpClient.post<IFormCreateResponse>(this._aqFormsApi.formsCreateApi, formCreateRequest)
            .pipe(
                map((resp: IFormCreateResponse) => {

                   
                        return resp;
                    
                })
            )
    }

    DowloadFormExcel(DownloadExcelCreateReq: IDownloadExcelCreateReq): Observable<IDownloadExcelCreResp> {
        return this._httpClient.post<IDownloadExcelCreResp>(this._aqFormsApi.downloadExcelFile, DownloadExcelCreateReq) 
        .pipe(
          map((resp: IDownloadExcelCreResp) => {
            return resp;
          })
        )
      }


      getAqFormList(aqFormList: IaqFormListReq): Observable<IAQFormListRespons>{
        return this._httpClient.post<IAQFormListRespons>(this._aqFormsApi.formsCreateApi, aqFormList)
        .pipe(
            map((resp: IAQFormListRespons) => {
                return resp;
              })
        )
      }







}
