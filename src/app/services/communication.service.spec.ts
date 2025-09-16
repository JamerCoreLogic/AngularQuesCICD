import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppSettings } from '../StaticVariable';

describe('CommunicationService', () => {
  let service: CommunicationService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunicationService]
    });

    service = TestBed.inject(CommunicationService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GetDataForBindUIScreen', () => {
    const mockToken = 'test-token';
    const mockResponse = { data: 'test data' };
    const expectedUrl = `${AppSettings.API_ENDPOINT}${AppSettings.GetDataForBindUIScreen}`;

    it('should make GET request with correct URL and token parameter', () => {
      service.GetDataForBindUIScreen(mockToken).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => 
        request.url === expectedUrl && 
        request.params.get('token') === mockToken
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error when API returns an error', () => {
      const errorMessage = 'API error';
      
      service.GetDataForBindUIScreen(mockToken).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(request => 
        request.url === expectedUrl && 
        request.params.get('token') === mockToken
      );
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle empty token parameter', () => {
      service.GetDataForBindUIScreen('').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => 
        request.url === expectedUrl && 
        request.params.get('token') === ''
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('SubmitResponce', () => {
    const mockData = { id: 1, value: 'test' };
    const mockResponse = { success: true };
    const expectedUrl = `${AppSettings.API_ENDPOINT}${AppSettings.SubmitResponce}`;

    it('should make POST request with correct URL and data', () => {
      service.SubmitResponce(mockData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockData);
      req.flush(mockResponse);
    });

    it('should handle error when API returns an error', () => {
      const errorMessage = 'Server error';
      
      service.SubmitResponce(mockData).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle empty data submission', () => {
      service.SubmitResponce({}).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });
}); 