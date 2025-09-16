import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { AppSettings } from '../StaticVariable';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GetDashboardData', () => {
    it('should call the correct API endpoint and return dashboard data', (done) => {
      const mockDashboardData = {
        data: [
          { id: 1, name: 'Dashboard Item 1' },
          { id: 2, name: 'Dashboard Item 2' }
        ]
      };

      httpClientSpy.get.and.returnValue(of(mockDashboardData));

      service.GetDashboardData().subscribe({
        next: (data) => {
          expect(data).toEqual(mockDashboardData);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetDashboardData
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('GetActiveUserPercentage', () => {
    it('should call the correct API endpoint and return active user percentage', (done) => {
      const mockPercentageData = {
        percentage: 75
      };

      httpClientSpy.get.and.returnValue(of(mockPercentageData));

      service.GetActiveUserPercentage().subscribe({
        next: (data) => {
          expect(data).toEqual(mockPercentageData);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            AppSettings.API_ENDPOINT + AppSettings.GetActiveUserPercentage
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('MarkedCompleted', () => {
    it('should call the correct API endpoint with proper parameters', (done) => {
      const mockData = '123';
      const mockCommRequestId = '456';
      const mockResponse = { success: true };

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.MarkedCompleted(mockData, mockCommRequestId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            `${AppSettings.API_ENDPOINT}${AppSettings.MarkedCompleted}?CommRequestId=${mockData}&AdjusterResponseId=${mockCommRequestId}`,
            { headers: jasmine.any(HttpHeaders) }
          );
          done();
        },
        error: done.fail
      });
    });
  });

  describe('GetCommunicationResponse', () => {
    it('should call the correct API endpoint with proper parameters', (done) => {
      const mockAdjusterId = '789';
      const mockResponse = {
        id: '789',
        response: 'Test Response'
      };

      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.GetCommunicationResponse(mockAdjusterId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith(
            `${AppSettings.API_ENDPOINT}${AppSettings.GetCommunicationResponse}?AdjusterResponseId=${mockAdjusterId}`
          );
          done();
        },
        error: done.fail
      });
    });
  });

  // Error scenarios
  describe('Error handling', () => {
    it('should handle HTTP errors in GetDashboardData', (done) => {
      const errorResponse = new Error('HTTP Error');
      httpClientSpy.get.and.returnValue(of(errorResponse));

      service.GetDashboardData().subscribe({
        next: (data) => {
          expect(data).toEqual(errorResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP errors in GetActiveUserPercentage', (done) => {
      const errorResponse = new Error('HTTP Error');
      httpClientSpy.get.and.returnValue(of(errorResponse));

      service.GetActiveUserPercentage().subscribe({
        next: (data) => {
          expect(data).toEqual(errorResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP errors in MarkedCompleted', (done) => {
      const errorResponse = new Error('HTTP Error');
      httpClientSpy.post.and.returnValue(of(errorResponse));

      service.MarkedCompleted('123', '456').subscribe({
        next: (data) => {
          expect(data).toEqual(errorResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should handle HTTP errors in GetCommunicationResponse', (done) => {
      const errorResponse = new Error('HTTP Error');
      httpClientSpy.get.and.returnValue(of(errorResponse));

      service.GetCommunicationResponse('789').subscribe({
        next: (data) => {
          expect(data).toEqual(errorResponse);
          done();
        },
        error: done.fail
      });
    });
  });
}); 