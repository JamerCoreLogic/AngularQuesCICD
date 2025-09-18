import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParameterApi } from '../../classes/parameter-api';
import { IDialogParamCreateReq } from '../../interfaces/dialog-save-parameter-req';
import { IDialogParamFormCreateResponse } from '../../interfaces/dialog-save-parameter-resp';
import { IDialogKeyParamCreateReq } from '../../interfaces/dialog-save-key-parameter-req'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogSaveParameterService {

  constructor(
    private _http: HttpClient,
    private _api: ParameterApi
  ) { }

  //SaveAQForm
  SaveDialogParamForm(dialogParamCreateReq: IDialogParamCreateReq): Observable<IDialogParamFormCreateResponse> {
    return this._http.post<IDialogParamFormCreateResponse>(this._api.SaveParameterDialog, dialogParamCreateReq)
      .pipe(
        map((resp: IDialogParamFormCreateResponse) => {
          return resp;
        })
      )
  }

  SaveDialogParamKeyForm(DialogKeyParamCreateReq: IDialogKeyParamCreateReq): Observable<IDialogParamFormCreateResponse> {
    return this._http.post<IDialogParamFormCreateResponse>(this._api.GetParameterKeyApi, DialogKeyParamCreateReq)
      .pipe(
        map((resp: IDialogParamFormCreateResponse) => {
          return resp;
        })
      )
  }

  SaveKeyDialogParamForm(dialogParamCreateReq: IDialogParamCreateReq): Observable<IDialogParamFormCreateResponse> {
    return this._http.post<IDialogParamFormCreateResponse>(this._api.SaveParameterDialog, dialogParamCreateReq)
      .pipe(
        map((resp: IDialogParamFormCreateResponse) => {
          return resp;
        })
      )
  }

}
