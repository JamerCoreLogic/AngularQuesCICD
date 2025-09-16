import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FileTracService } from './file-trac.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AppSettings } from '../StaticVariable';

describe('FileTracService', () => {
  let service: FileTracService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
    TestBed.configureTestingModule({
      providers: [
        FileTracService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    
    service = TestBed.inject(FileTracService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct headers configuration', () => {
    expect(service.headers.headers.get('Content-Type')).toBe('application/json');
  });

  describe('GetListOfFileTracData', () => {
    it('should return expected file trac data', fakeAsync(() => {
      const expectedData = [
        { id: 1, name: 'File 1' },
        { id: 2, name: 'File 2' }
      ];

      httpClientSpy.get.and.returnValue(of(expectedData));

      let actualData: any;
      service.GetListOfFileTracData().subscribe(data => {
        actualData = data;
      });

      tick();

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetListOfFileTracData
      );
      expect(actualData).toEqual(expectedData);
    }));

    it('should handle error when API fails', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        error: 'API error',
        status: 404,
        statusText: 'Not Found'
      });

      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.GetListOfFileTracData().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      tick();
    }));
  });

  describe('GetListOfCompanyName', () => {
    it('should return expected company names', fakeAsync(() => {
      const expectedData = [
        { id: 1, companyName: 'Company 1' },
        { id: 2, companyName: 'Company 2' }
      ];

      httpClientSpy.get.and.returnValue(of(expectedData));

      let actualData: any;
      service.GetListOfCompanyName().subscribe(data => {
        actualData = data;
      });

      tick();

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetListOfCompanyName
      );
      expect(actualData).toEqual(expectedData);
    }));

    it('should handle error when API fails', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        error: 'API error',
        status: 500,
        statusText: 'Internal Server Error'
      });

      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.GetListOfCompanyName().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      tick();
    }));
  });

  describe('GetSurveyTitleList', () => {
    it('should return expected survey titles', fakeAsync(() => {
      const expectedData = [
        { id: 1, title: 'Survey 1' },
        { id: 2, title: 'Survey 2' }
      ];

      httpClientSpy.get.and.returnValue(of(expectedData));

      let actualData: any;
      service.GetSurveyTitleList().subscribe(data => {
        actualData = data;
      });

      tick();

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetSurveyTitleList
      );
      expect(actualData).toEqual(expectedData);
    }));

    it('should handle error when API fails', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        error: 'API error',
        status: 503,
        statusText: 'Service Unavailable'
      });

      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.GetSurveyTitleList().subscribe({
        error: (error) => {
          expect(error.status).toBe(503);
          expect(error.statusText).toBe('Service Unavailable');
        }
      });

      tick();
    }));
  });

  describe('GetFileTracActiveCompanies', () => {
    it('should return expected active companies', fakeAsync(() => {
      const expectedData = [
        { id: 1, name: 'Active Company 1', isActive: true },
        { id: 2, name: 'Active Company 2', isActive: true }
      ];

      httpClientSpy.get.and.returnValue(of(expectedData));

      let actualData: any;
      service.GetFileTracActiveCompanies().subscribe(data => {
        actualData = data;
      });

      tick();

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetFileTracActiveCompanies
      );
      expect(actualData).toEqual(expectedData);
    }));

    it('should handle error when API fails', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        error: 'API error',
        status: 401,
        statusText: 'Unauthorized'
      });

      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.GetFileTracActiveCompanies().subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.statusText).toBe('Unauthorized');
        }
      });

      tick();
    }));
  });
}); 