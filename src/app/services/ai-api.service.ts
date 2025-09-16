import { Injectable } from '@angular/core';
import { AppSettings } from '../StaticVariable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AiApiService {
  url!: string;

  constructor(private httpClient:HttpClient) { }
 
  getSurveyList() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveyList + 4;
    return this.httpClient.get(this.url);
  }
  getemailPreviewData(aiInspectionSurveyId: number) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetEmailPreviewData + aiInspectionSurveyId
    return this.httpClient.get(this.url);
}

sendSurvey(data: any) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.SendSurvey;
  return this.httpClient.post(this.url, data);
}

getInitiatedRecordCount(InspectionId: number, Guid: string) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetInitiatedRecordCount +'?InspectionId='+InspectionId+'&Guid='+Guid;
  return this.httpClient.post(this.url,null);
}

getSurveyDashBoardDetails(){
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveyDashBoardDetails;
  return this.httpClient.get(this.url);
}

getSurveyRecordsById(portalid: number, sortBy?: string, sortOrder?: string) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveyRecordsById + '?portalid='+portalid+'&sortBy='+sortBy+'&sortOrder='+sortOrder;
  return this.httpClient.get(this.url);
}

markComplete(SurveyRequestId: number) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.MarkComplete + SurveyRequestId;
  return this.httpClient.post(this.url,null);
}

getDataSourceColumn(AIInspectionSurveyId: number) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetDataSourceColumn + AIInspectionSurveyId;
  return this.httpClient.get(this.url);
}

updateSurveyInfo(surveyData:any){
  this.url = AppSettings.API_ENDPOINT + AppSettings.UpdateSurveyInfo;
  return this.httpClient.post(this.url,surveyData)
}


getInternalUsers(){
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetInternalUsers;
  return this.httpClient.get(this.url);
}


addUpdateAssignTo(data:any){
  this.url = AppSettings.API_ENDPOINT + AppSettings.AddUpdateAssignTo;
  return this.httpClient.post(this.url,data);
}

getServeyResponse(SurveyId: number) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetServeyResponse + SurveyId;
  return this.httpClient.get(this.url);
}

// New methods for grid state management
saveCustomView(data: any) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.SaveCustomView;
  return this.httpClient.post(this.url, data);
}

deleteSurveyCustomView(Id: number) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.DeleteSurveyCustomView  + Id;
  return this.httpClient.post(this.url,null);
}

getSurveyFiltercolumnsList(inspectionId: number) { 
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveyFiltercolumnsList  + inspectionId;
  return this.httpClient.get(this.url);
}

getSurveyCustomViews(surveyId: number) {
  this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveyCustomViews + surveyId;
  return this.httpClient.get(this.url);
}

}
