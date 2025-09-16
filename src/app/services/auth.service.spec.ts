import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpEventType } from '@angular/common/http';
import { of, BehaviorSubject } from 'rxjs';
import { User } from '../models/user-models';
import { AppSettings } from '../StaticVariable';
import * as imageCompression from 'browser-image-compression';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

interface UserResponse {
  data: User;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockUser: User = {
    userId: '1',
    userName: 'testUser',
    emailAddress: 'test@example.com',
    password: 'password123',
    role: [{ 
      roleId: 1, 
      roleName: 'Admin',
      rolePermissionData: []
    }],
    token: 'mock-token',
    status: 'Active',
    connectionString: '',
    latitude: '',
    longitude: '',
    profilePic: ''
  };

  const mockApiResponse: ApiResponse<User> = {
    data: mockUser,
    success: true
  };

  const mockUserResponse: UserResponse = {
    data: mockUser
  };

  const mockHttpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication', () => {
    it('should login user and store user data', (done) => {
      const loginData = { username: 'test', password: 'test123' };
      
      httpClientSpy.post.and.returnValue(of(mockApiResponse));

      service.login(loginData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockApiResponse);
          expect(service.currentUserValue).toEqual(mockApiResponse.data);
          expect(localStorage.getItem('currentUser')).toBeTruthy();
          done();
        },
        error: done.fail
      });
    });

   


    it('should logout and clear storage', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service.logout();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.currentUserValue).toBeNull();
      expect(service.allowedUrls.length).toBe(0);
    });
  });

  describe('User Management', () => {
    it('should add new user', (done) => {
      const newUser = { userName: 'newUser', email: 'new@example.com' };
      const mockResponse = { success: true, data: newUser };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.addUser(newUser).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should edit user', (done) => {
      const editedUser = { userId: 1, userName: 'editedUser' };
      const mockResponse = { success: true, data: editedUser };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.editUser(editedUser).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should delete user', (done) => {
      const userId = 1;
      const mockResponse = { success: true };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.deleteUser(userId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Password Management', () => {
    it('should send forgot password link', (done) => {
      const email = { email: 'test@example.com' };
      const mockResponse = { success: true };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.forgotPasswordSendLink(email).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should verify OTP', (done) => {
      const otpData = { email: 'test@example.com', otp: '123456' };
      const mockResponse = { success: true };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.verifyOtp(otpData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });

    it('should change password', (done) => {
      const passwordData = { 
        userId: 1, 
        oldPassword: 'old123', 
        newPassword: 'new123' 
      };
      const mockResponse = { success: true };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.changePass(passwordData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Client Management', () => {
    it('should get clients list', (done) => {
      const mockClients = [
        { clientId: 1, name: 'Client 1' },
        { clientId: 2, name: 'Client 2' }
      ];
      
      httpClientSpy.get.and.returnValue(of(mockClients));

      service.getClients().subscribe({
        next: (response) => {
          expect(response).toEqual(mockClients);
          done();
        },
        error: done.fail
      });
    });

    it('should add new client', (done) => {
      const newClient = { name: 'New Client', address: 'Test Address' };
      const mockResponse = { success: true, data: newClient };
      
      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.addClient(newClient).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Assessment Management', () => {
    it('should get assessments', (done) => {
      const mockAssessments = [
        { id: 1, name: 'Assessment 1' },
        { id: 2, name: 'Assessment 2' }
      ];
      
      httpClientSpy.get.and.returnValue(of(mockAssessments));

      service.getAssessments().subscribe({
        next: (response) => {
          expect(response).toEqual(mockAssessments);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('FileTrac Management', () => {
    it('should get FileTrac data grouped by year', (done) => {
      const fileTracId = '123';
      const mockData = [
        { year: 2023, count: 10 },
        { year: 2022, count: 5 }
      ];
      
      httpClientSpy.get.and.returnValue(of(mockData));

      service.GetFileTracDataGroupByYear(fileTracId).subscribe({
        next: (response) => {
          expect(response).toEqual(mockData);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Core Values', () => {
    it('should get core values data', () => {
      const coreValues = service.getCorevalues();
      expect(coreValues).toBeTruthy();
      expect(Array.isArray(coreValues)).toBeTrue();
      expect(coreValues.length).toBeGreaterThan(0);
    });
  });

  describe('User Data Management', () => {
    it('should set and get user data', (done) => {
      const testData = { id: 1, name: 'Test User' };
      
      service.setUserData(testData);
      service.getUserData().subscribe({
        next: (data) => {
          expect(data).toEqual(testData);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('URL Management', () => {
    it('should check if user is allowed to access URL', () => {
      const allowedUrls = ['http://example.com/dashboard'];
      service.postUserAllowedUrls(allowedUrls);
      
      const result = service.isUserAllowed(new URL('http://example.com/dashboard'));
      expect(result.isAllow).toBeTrue();
      
      const invalidResult = service.isUserAllowed(new URL('http://example.com/invalid'));
      expect(invalidResult.isAllow).toBeFalse();
    });
  });



  describe('System Health', () => {
    it('should check heartbeat', (done) => {
      const mockResponse = { status: 'healthy' };
      
      httpClientSpy.get.and.returnValue(of(mockResponse));

      service.getHeartbeat().subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail
      });
    });
  });
}); 