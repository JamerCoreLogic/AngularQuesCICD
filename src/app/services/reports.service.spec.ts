import { TestBed } from '@angular/core/testing';
import { ReportsService } from './reports.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { AppSettings } from '../StaticVariable';

interface User {
  id: number;
  name: string;
}

interface Field {
  id: number;
  name: string;
  type: string;
}

interface Report {
  id: number;
  name: string;
  data: unknown;
}

interface Column {
  id: number;
  name: string;
  type: string;
}

interface CustomView {
  id: number;
  name: string;
  configuration: unknown;
}

describe('ReportsService', () => {
  let service: ReportsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    
    TestBed.configureTestingModule({
      providers: [
        ReportsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    
    service = TestBed.inject(ReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct headers configuration', () => {
    expect(service.headers.headers.get('Content-Type')).toBe('application/json');
  });

  describe('GetUserListForReports', () => {
    it('should call correct API endpoint and return data', () => {
      const mockResponse = { users: [] as User[] };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.GetUserListForReports().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetUserListForReports
      );
    });
  });

  describe('GetFiledsListForReports', () => {
    it('should call correct API endpoint and return data', () => {
      const mockResponse = { fields: [] as Field[] };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.GetFiledsListForReports().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetFiledsListForReports
      );
    });
  });

  describe('GetRequestedListForReportDashboard', () => {
    it('should call correct API endpoint with data and return response', () => {
      const mockData = { filter: 'test' };
      const mockResponse = { reports: [] as Report[] };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.GetRequestedListForReportDashboard(mockData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetRequestedListForReportDashboard,
        JSON.stringify(mockData),
        service.headers
      );
    });
  });

  describe('GetActiveModuleColumns', () => {
    it('should call correct API endpoint and return data', () => {
      const mockResponse = { columns: [] as Column[] };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.GetActiveModuleColumns().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetActiveModuleColumns
      );
    });
  });

  describe('AddUpdateCustomView', () => {
    it('should call correct API endpoint with data and return response', () => {
      const mockData = { view: 'test' };
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.AddUpdateCustomView(mockData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.AddUpdateCustomView,
        JSON.stringify(mockData),
        service.headers
      );
    });
  });

  describe('GetCustomView', () => {
    it('should call correct API endpoint with id and return data', () => {
      const mockId = 123;
      const mockResponse = { view: {} as CustomView };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.GetCustomView(mockId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetCustomView + mockId
      );
    });
  });

  describe('DeleteCustomView', () => {
    it('should call correct API endpoint with id and return response', () => {
      const mockId = 123;
      const mockResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.DeleteCustomView(mockId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.DeleteCustomView + mockId,
        service.headers
      );
    });
  });

  describe('GetCustomViewList', () => {
    it('should call correct API endpoint and return data', () => {
      const mockResponse = { views: [] as CustomView[] };
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.GetCustomViewList().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        AppSettings.API_ENDPOINT + AppSettings.GetCustomViewList
      );
    });
  });
}); 