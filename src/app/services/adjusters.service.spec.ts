import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdjustersService } from './adjusters.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AppSettings } from '../StaticVariable';

describe('AdjustersService', () => {
  let service: AdjustersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    
    TestBed.configureTestingModule({
      providers: [
        AdjustersService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    
    service = TestBed.inject(AdjustersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update showlist subject', (done) => {
    const testValue = true;
    
    service.showlist.subscribe(value => {
      expect(value).toBe(testValue);
      done();
    });

    service.updatelist(testValue);
  });

  it('should call getAdjustersByAddress with correct parameters', () => {
    const mockData = { address: '123 Test St' };
    const mockResponse = { success: true };

    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.getAdjustersByAddress(mockData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Instead of comparing the entire headers object, verify the specific header value
    const calls = httpClientSpy.post.calls.mostRecent();
    expect(calls.args[0]).toBe(AppSettings.API_ENDPOINT + AppSettings.GetUserByAddress);
    expect(calls.args[1]).toBe(JSON.stringify(mockData));
    const headers = (calls.args[2].headers as HttpHeaders);
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('should call InitiateRequest with correct parameters', () => {
    const mockData = { requestData: 'test' };
    const mockResponse = { success: true };

    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.InitiateRequest(mockData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      AppSettings.API_ENDPOINT + AppSettings.InitiateRequest,
      mockData
    );
  });

  it('should call GetClientList', () => {
    const mockResponse = [{ id: 1, name: 'Client 1' }];

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.GetClientList().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      AppSettings.API_ENDPOINT + AppSettings.GetClientList
    );
  });

  it('should call GetAssessmentList', () => {
    const mockResponse = [{ id: 1, assessment: 'Test' }];

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.GetAssessmentList().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      AppSettings.API_ENDPOINT + AppSettings.GetAssessmentList
    );
  });

  it('should call GetViewProfileByUserId with correct userId', () => {
    const userId = '123';
    const mockResponse = { id: userId, name: 'Test User' };

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.GetViewProfileByUserId(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${AppSettings.API_ENDPOINT}${AppSettings.GetViewProfileByUserId}?userid=${userId}`
    );
  });

  it('should call GetUserRequestDetailsByUserId with correct userId', () => {
    const userId = '123';
    const mockResponse = { id: userId, requests: [] as Array<unknown> };

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.GetUserRequestDetailsByUserId(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${AppSettings.API_ENDPOINT}${AppSettings.GetUserRequestDetailsByUserId}?userid=${userId}`
    );
  });

  // Error scenarios
  it('should handle error in getAdjustersByAddress', (done) => {
    const mockData = { address: '123 Test St' };
    const mockError = new Error('Network error');

    httpClientSpy.post.and.returnValue(throwError(() => mockError));

    service.getAdjustersByAddress(mockData).subscribe({
      next: () => {
        done.fail('Expected an error');
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Network error');
        done();
      }
    });
  });

  // Testing HTTP headers
  it('should use correct HTTP headers', () => {
    const headers = service['headers'];
    expect(headers.headers.get('Content-Type')).toBe('application/json');
  });
}); 