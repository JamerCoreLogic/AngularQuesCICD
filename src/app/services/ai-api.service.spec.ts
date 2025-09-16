import { TestBed } from '@angular/core/testing';
import { AiApiService } from './ai-api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AppSettings } from '../StaticVariable';

describe('AiApiService', () => {
  let service: AiApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        AiApiService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(AiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSurveyList', () => {
    it('should return survey list', (done) => {
      const mockResponse = [{ id: 1, name: 'Survey 1' }];
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getSurveyList().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(AppSettings.API_ENDPOINT + AppSettings.GetSurveyList + 4);
          done();
        },
        error: done.fail
      });
    });

    it('should handle error when getting survey list', (done) => {
      const errorResponse = new HttpErrorResponse({ error: 'Test error', status: 404 });
      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.getSurveyList().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(404);
          done();
        }
      });
    });
  });

  describe('getemailPreviewData', () => {
    it('should return email preview data', (done) => {
      const mockResponse = { template: 'email template' };
      const surveyId = 123;
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getemailPreviewData(surveyId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(AppSettings.API_ENDPOINT + AppSettings.GetEmailPreviewData + surveyId);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('sendSurvey', () => {
    it('should send survey data', (done) => {
      const mockData = { surveyId: 1, data: 'test' };
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.sendSurvey(mockData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(AppSettings.API_ENDPOINT + AppSettings.SendSurvey, mockData);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getInitiatedRecordCount', () => {
    it('should get initiated record count', (done) => {
      const inspectionId = 1;
      const guid = 'test-guid';
      const mockResponse = { count: 5 };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.getInitiatedRecordCount(inspectionId, guid).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            `${AppSettings.API_ENDPOINT}${AppSettings.GetInitiatedRecordCount}?InspectionId=${inspectionId}&Guid=${guid}`,
            null
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getSurveyDashBoardDetails', () => {
    it('should return dashboard details', (done) => {
      const mockResponse = { stats: 'dashboard data' };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getSurveyDashBoardDetails().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(AppSettings.API_ENDPOINT + AppSettings.GetSurveyDashBoardDetails);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getSurveyRecordsById', () => {
    it('should get survey records by id with sorting', (done) => {
      const portalId = 1;
      const sortBy = 'name';
      const sortOrder = 'asc';
      const mockResponse = [{ id: 1, name: 'Survey Record' }];
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getSurveyRecordsById(portalId, sortBy, sortOrder).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            `${AppSettings.API_ENDPOINT}${AppSettings.GetSurveyRecordsById}?portalid=${portalId}&sortBy=${sortBy}&sortOrder=${sortOrder}`
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('markComplete', () => {
    it('should mark survey as complete', (done) => {
      const surveyRequestId = 1;
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.markComplete(surveyRequestId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.MarkComplete + surveyRequestId,
            null
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getDataSourceColumn', () => {
    it('should get data source columns', (done) => {
      const aiInspectionSurveyId = 1;
      const mockResponse = [{ columnName: 'test' }];
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getDataSourceColumn(aiInspectionSurveyId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetDataSourceColumn + aiInspectionSurveyId
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('updateSurveyInfo', () => {
    it('should update survey information', (done) => {
      const surveyData = { id: 1, info: 'updated' };
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.updateSurveyInfo(surveyData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.UpdateSurveyInfo,
            surveyData
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getInternalUsers', () => {
    it('should get internal users', (done) => {
      const mockResponse = [{ id: 1, name: 'User' }];
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getInternalUsers().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetInternalUsers
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('addUpdateAssignTo', () => {
    it('should add or update assignment', (done) => {
      const assignData = { userId: 1, surveyId: 2 };
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.addUpdateAssignTo(assignData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.AddUpdateAssignTo,
            assignData
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getServeyResponse', () => {
    it('should get survey response', (done) => {
      const surveyId = 1;
      const mockResponse = { responses: [] as Array<unknown> };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getServeyResponse(surveyId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetServeyResponse + surveyId
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('saveCustomView', () => {
    it('should save custom view', (done) => {
      const viewData = { name: 'Custom View' };
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.saveCustomView(viewData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.SaveCustomView,
            viewData
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('deleteSurveyCustomView', () => {
    it('should delete survey custom view', (done) => {
      const viewId = 1;
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.deleteSurveyCustomView(viewId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.DeleteSurveyCustomView + viewId,
            null
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getSurveyFiltercolumnsList', () => {
    it('should get survey filter columns list', (done) => {
      const inspectionId = 1;
      const mockResponse = [{ column: 'test' }];
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getSurveyFiltercolumnsList(inspectionId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetSurveyFiltercolumnsList + inspectionId
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('getSurveyCustomViews', () => {
    it('should get survey custom views', (done) => {
      const surveyId = 1;
      const mockResponse = [{ viewId: 1, name: 'View' }];
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getSurveyCustomViews(surveyId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetSurveyCustomViews + surveyId
          );
          done();
        },
        error: done.fail
      });
    });
  });
}); 