import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, from, forkJoin } from 'rxjs';
import { map, concatMap, catchError } from 'rxjs/operators';
import { AppSettings } from '../StaticVariable';
import { User } from '../models/user-models';
import imageCompression from 'browser-image-compression';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  Users: any = []
  url!: string;
  loggedinUsername!: Subject<string>
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private userDatasubject = new BehaviorSubject<any>(null);
  public userData = this.userDatasubject.asObservable();
  allowedUrls: any[] = [];
  coreValuesData: any[] = [
    {
        "header": {
            "headerId": 1,
            "headerText": "Listen With Openness"
        },
        "controls": [
            {
                "controlId": 1,
                "headerId": 1,
                "questionText": "Describe a situation where you had to listen to others' perspectives to resolve an issue. How did you ensure you remained open-minded and unbiased?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 2,
            "headerText": "Pursue Greatness"
        },
        "controls": [
            {
                "controlId": 2,
                "headerId": 2,
                "questionText": "How do you continually pursue greatness in your work? Can you provide an example of a goal you set for yourself and how you worked towards achieving it?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 3,
            "headerText": "Obsess With Improvement"
        },
        "controls": [
            {
                "controlId": 3,
                "headerId": 3,
                "questionText": "What is one aspect of your professional skills or knowledge that you have actively worked to improve? What steps did you take, and what was the result?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 4,
            "headerText": "Simplify The Complex"
        },
        "controls": [
            {
                "controlId": 4,
                "headerId": 4,
                "questionText": "Describe a complex problem you encountered in your work and how you approached solving it. What strategies did you use to simplify the issue and find a solution?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 5,
            "headerText": "Be Kind"
        },
        "controls": [
            {
                "controlId": 5,
                "headerId": 5,
                "questionText": "Can you provide an example of how you demonstrated kindness in a professional setting? How did it impact the people involved and the overall outcome?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 6,
            "headerText": "Areas of Expertise"
        },
        "controls": [
            {
                "controlId": 6,
                "headerId": 6,
                "questionText": "Order and describe your areas of expertise in property adjusting (residential, commercial, quality control, supervision, etc.). Which areas do you feel most confident in, and why?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 7,
            "headerText": "Resourcefulness and Adaptability"
        },
        "controls": [
            {
                "controlId": 7,
                "headerId": 7,
                "questionText": "Can you share an example of when you had to adjust quickly to a change or unexpected challenge in your work? How did you handle it, and what was the outcome?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    },
    {
        "header": {
            "headerId": 8,
            "headerText": "Coaching and Leadership"
        },
        "controls": [
            {
                "controlId": 8,
                "headerId": 8,
                "questionText": "Can you describe a time when you provided support or coaching to a fellow adjuster or colleague? What approach did you take, and how did it impact their performance?",
                "controlType": "TextArea",
                "controlValue": null,
                "options": [],
                "maxLength": 20000,
                "isMandatory": false,
                "isDeleted": false
            },
            {
                "controlId": 9,
                "headerId": 8,
                "questionText": "Given the choice, do you prefer leadership opportunities or individual contributor opportunities, or would you prefer to be considered for both?",
                "controlType": "RadioButton",
                "controlValue": null,
                "options": [
                    "Leadership",
                    "Individual Contributor",
                    "Both"
                ],
                "maxLength": null,
                "isMandatory": false,
                "isDeleted": false
            }
        ]
    }
]
maintenanceHandled = false;

  constructor(private httpClient: HttpClient) {
    const storedUrlArray = localStorage.getItem('urlArray');
    if (storedUrlArray !== null) {
      this.allowedUrls = JSON.parse(storedUrlArray);
    }
    this.loggedinUsername = new Subject<string>(); this.loggedinUsername = new Subject<string>();
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();

  }
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getUserRoles() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetRoleList;
    return this.httpClient.get(this.url);
  }

  getUserType() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetRoleTypeList;
    return this.httpClient.get(this.url);
  }
  GetUserResources() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetUserResources;
    return this.httpClient.get(this.url);
  }
  login(data: any) {
    return this.httpClient.post<User>(AppSettings.API_ENDPOINT + AppSettings.login, JSON.stringify(data), this.headers).pipe(map((user: any) => {
      //console.log("user in auth service", user);
      localStorage.setItem('currentUser', JSON.stringify(user.data));
      this.currentUserSubject.next(user.data);
      return user;
    }));
  }
  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue?.data
    return !!user && user.role.some((r:any) => r.roleName === role);
  }

  addUser(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.AddUpdateUser;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers);
  }
  addUserRegistration(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.AddUserRegistration;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers);
  }
  editUser(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.EditUser;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers);
  }

  deleteUser(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.deleteUser + '?userId=' + data;
    return this.httpClient.post(this.url, this.headers);
  }
  getUserByRoleId(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetUserByRoleId + data;
    return this.httpClient.get(this.url);
  }
  GetUserListForAdminDashboard( data:any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetUserListForAdminDashboard
    return this.httpClient.post(this.url ,JSON.stringify(data), this.headers);
  }
  GetTaskListForAdminDashboard( data:any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetTaskListForAdminDashboard
    return this.httpClient.post(this.url ,JSON.stringify(data), this.headers);
  }
  getUserDataById(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetUserDataById + data, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    };
    return this.httpClient.get(this.url);
  }

  forgotPasswordSendLink(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.SendLinkFrogetPassword;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }

  verifyOtp(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.VerifyOTP;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  saveForgotPassword(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.saveForgotPass;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  changePass(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.updatePass;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  updateResetPassword(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.updateResetPassword;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  lockProfile(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.lockProfile+"userId=" + data.userid+"&loggedInUserId="+data.loggedinuser;
    return this.httpClient.post(this.url, this.headers);
  }
  unLockprofile(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.unlockProfile+"userId=" + data.userid+"&loggedInUserId="+data.loggedinuser;
    return this.httpClient.post(this.url, this.headers);
  }


  checkUserForSubmit(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.CheckUserForSubmit + data;
    return this.httpClient.get(this.url, this.headers);
  }
  // Client
  getClients() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.getClients;
    return this.httpClient.get(this.url)
  }
  addClient(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.addClient;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  editClient(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.editClient;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  deleteClient(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.deleteClient + data;
    return this.httpClient.post(this.url, this.headers)
  }
  getStates(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetStates + data;
    return this.httpClient.get(this.url);
  }
  // Assessment
  getAssessments() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.getAssessments;
    return this.httpClient.get(this.url)
  }
  addAssessment(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.addAssessments;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  editAssessment(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.editAssessment;
    return this.httpClient.post(this.url, JSON.stringify(data), this.headers)
  }
  deleteAssessment(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.deleteAssessment + data;
    return this.httpClient.post(this.url, this.headers)
  }
  getReleaseVersionDetails() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetReleaseVersionDetails;
    return this.httpClient.get(this.url)
  }
  GetFileTracDataGroupByYear(fileTracId:any){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetFileTracDataGroupByYear + '?fileTracId='+ fileTracId
    return this.httpClient.get(this.url)
  }
  GetFileTracDataGroupByCompanyName(fileTracId:any){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetFileTracDataGroupByCompanyName+ '?fileTracId='+ fileTracId
    return this.httpClient.get(this.url)
  }
  GetFileTracId(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetFileTracId + '?userId=' + data.userId + '&email='+ data.email
    return this.httpClient.get(this.url);
  }
  GetTotalNumberOfClaims(fileTracId:any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetTotalNumberOfClaims + '?fileTracId='+ fileTracId
    return this.httpClient.get(this.url);
  }
  UpdateFileTracId(data:any){
    this.url = AppSettings.API_ENDPOINT + AppSettings.UpdateFileTracId + '?email=' + data.email + '&fileTracId='+ data.fileTracId + '&UserId='+ data.UserId
    return this.httpClient.post(this.url, this.headers)
  }


  GetSurveysByAdjusterId(data: any) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetSurveysByAdjusterId + data.adjusterId + '&sortBy=' + data.sortBy + '&sortOrder=' + data.sortOrder
    return this.httpClient.get(this.url)
  }

  //Auth Guard
  postUserAllowedUrls(list: any) {
    this.allowedUrls = list
    return true
  }

  isUserAllowed(landingPage: any) {
    var isAllowed = false;
    var path;
    // //console.log("Allowed URL Array in Service", this.allowedUrls)
    for (var element of this.allowedUrls) {
      const urlObj = new URL(element);
      if (urlObj.pathname == landingPage.pathname) {
         
        // //console.log("Landing page path match with allowed paths, Allowed Path", element.path, ", Current path", landingPage.path);
        isAllowed = true;  
        break
      }
      else {
        //console.log("Landing page path not matched from allowed paths");
        isAllowed = false;  
      }
    }

    if (isAllowed == false && this.allowedUrls && this.allowedUrls.length > 0) {
      const urlObj = new URL(this.allowedUrls[0]);
      path = urlObj.pathname
    }

    if (this.allowedUrls && this.allowedUrls.length === 0) {
      path = '/login'
    }

    let obj = { isAllow: isAllowed, allowedPath: path }
    return obj
  }


  logout() {
     
    localStorage.clear()
    localStorage.clear()
    this.currentUserSubject.next(null);
    this.allowedUrls = [];
    // //console.log("LOGOUT METHOD HIT IN SERVICE");
  }

  async compressProfilePic(base64Str:any) {
    // Convert base64 to Blob
    const fetchRes = await fetch(`data:image/jpeg;base64,${base64Str}`);
    const blob = await fetchRes.blob();
    
    // Create a File from Blob - adding a name and lastModified date
    const fileName = 'compressed_profile_pic.jpg';
    const file = new File([blob], fileName, {
      type: 'image/jpeg', // or the correct mime type of your image
      lastModified: new Date().getTime(), // or the original file's lastModified time if you have it
    });
  
    // Use the image compression library with the File object
    const options = {
      maxSizeMB: 1, // Max size in MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
  
      // Convert compressed File back to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error('Error during compression', error);
      throw error;
    }
  }
  getCorevalues(){
    return this.coreValuesData;
  }

  setUserData(data: any) {
    // Store the last valid data for future reference
    if (data) {
      // Store in localStorage for persistence with user-specific key
      try {
        if (data.userId) {
          // Use user-specific cache key
          localStorage.setItem(`cachedUserData_${data.userId}`, JSON.stringify(data));
          // Store current userId for reference
          localStorage.setItem('currentlyEditingUserId', data.userId);
        }
      } catch (e) {
        console.warn('Failed to store user data in localStorage:', e);
      }
    }
    this.userDatasubject.next(data);
  }
  
  getUserData() {
    // Check if we have a current value
    if (!this.userDatasubject.value) {
      // Try to restore from localStorage if available
      const currentEditingUserId = localStorage.getItem('currentlyEditingUserId');
      if (currentEditingUserId) {
        const cachedData = localStorage.getItem(`cachedUserData_${currentEditingUserId}`);
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            // Verify this is the right user
            if (parsedData && parsedData.userId === currentEditingUserId) {
              this.userDatasubject.next(parsedData);
            }
          } catch (e) {
            console.warn('Failed to parse cached user data:', e);
          }
        }
      }
    }
    return this.userData;
  }

  clearUserDataCache(userId?: string) {
    // Clear specific user cache
    if (userId) {
      localStorage.removeItem(`cachedUserData_${userId}`);
    }
    
    // Or clear current editing user cache
    const currentEditingUserId = localStorage.getItem('currentlyEditingUserId');
    if (currentEditingUserId) {
      localStorage.removeItem(`cachedUserData_${currentEditingUserId}`);
      localStorage.removeItem('currentlyEditingUserId');
    }
    
    // Reset the BehaviorSubject
    this.userDatasubject.next(null);
  }

  getHeartbeat() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetHeartbeat;
    return this.httpClient.get(this.url);
  }
  getAuditLogEntry(data:any){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetAuditLogEntry + '?userId=' + data.userId + '&pageNo=' + data.pageNo + '&pageSize=' + data.pageSize + '&sortColumn=' + data.sortColumn + '&sortDesc=' + data.sortDesc;
    return this.httpClient.post(this.url,null);
  }

  getUserSummary(){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetUserSummary;
    return this.httpClient.get(this.url);
  }
  getUsertaskSummary(){
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetUserTaskSummary;
    return this.httpClient.get(this.url);
  }

  getActiveFileTypes() {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetActiveFileTypes;
    return this.httpClient.get<{
      data: Array<{
        fileType: string;
        expectedFileExtention: string;
        mime: string;
      }>;
      success: boolean;
      message: string;
      errorCode: string | null;
    }>(this.url);
  }

  getAdjusterAttachmentsByUserId(data: { userId: any; sortBy: string; sortDescending: boolean }) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetAdjusterAttachmentsByUserId + 
      `?userId=${data.userId}&sortBy=${data.sortBy}&sortDescending=${data.sortDescending}`;
    return this.httpClient.get<{
      success: boolean;
      message: string;
      errorCode: string | null;
      data: {
        totalCount: number;
        attachments: Array<{
          id: number;
          userId: number;
          fileName: string;
          systemFilename: string;
          fileType: string;
          discription: string;
          expirationDate: string;
          fileExtention: string;
          mimeType: string;
          fileData: string;
          uploadedDate: string;
          uploadedBy: number;
          modiFiedOn: string;
          modiFiedBy: number;
        }>;
      };
    }>(this.url);
  }

  uploadAdjusterAttachment(data: {
    userId: any;
    fileName: string;
    fileType: string;
    discription?: string;
    expirationDate?: string;
    fileExtention: string;
    fileData: string;
    mimeType:string;
    uploadedBy: number;
    uploadedDate:string;
    modiFiedOn:string;
    modiFiedBy:number;
  }) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.UploadAdjusterAttachment;
    return this.httpClient.post<{
      success: boolean;
      message: string;
      errorCode: string | null;
      data: boolean;
    }>(this.url, data);
  }

  updateAdjusterAttachment(data: {
    id: number;
    userId: number;
    fileName: string;
    fileType: string;
    discription?: string;
    expirationDate?: string;
    fileExtention?: string;
    fileData?: string;
    mimeType?: string;
    uploadedBy: number;
    uploadedDate?: string;
    modiFiedOn: string;
    modiFiedBy: number;
  }) {
    const updatePath = (AppSettings as any).UpdateAdjusterAttachment || AppSettings.UploadAdjusterAttachment;
    this.url = AppSettings.API_ENDPOINT + updatePath;
    return this.httpClient.post<{
      success: boolean;
      message: string;
      errorCode: string | null;
      data: boolean;
    }>(this.url, data);
  }

  getAdjusterAttachmentByIdAndUserId(data: { id: number; userId: number }) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.GetAdjusterAttachmentByIdAndUserId + 
      `?id=${data.id}&userId=${data.userId}`;
    return this.httpClient.get<{
      success: boolean;
      message: string;
      errorCode: string | null;
      data: {
        id: number;
        userId: number;
        fileName: string;
        systemFilename: string;
        fileType: string;
        description: string;
        expirationDate: string;
        fileExtention: string;
        mimeType: string;
        fileData: string;
        storagePath: string;
        uploadedDate: string;
        uploadedBy: number;
        isDeleted: boolean;
        modiFiedOn: string;
        modiFiedBy: number;
      };
    }>(this.url);
  }

  deleteAttachment(data: { id: number, userId: number }) {
    this.url = AppSettings.API_ENDPOINT + AppSettings.DeleteAttachment + `?Docid=${data.id}&userId=${data.userId}`;
    return this.httpClient.post<{
      success: boolean;
      message: string;
      errorCode: string | null;
      data: boolean;
    }>(this.url,null);
  }

  /**
   * Process multiple pending attachments for a user
   * @param userId - The ID of the user to attach files to
   * @param pendingUploads - Array of pending attachment data
   * @returns Observable that emits upload results
   */
  processPendingUploads(userId: number, pendingUploads: Array<{
    fileName: string;
    fileType: string;
    fileExtention: string;
    fileData: string;
    discription?: string;
    expirationDate?: string;
    mimeType: string;
    uploadedDate: string;
    uploadedBy: number;
    modiFiedOn: string;
    modiFiedBy: number;
  }>): Observable<Array<{
    success: boolean;
    message?: string;
    fileName: string;
    error?: any;
  }>> {
    // Convert the array into an observable stream
    return from(pendingUploads).pipe(
      // Process each upload sequentially
      concatMap(pendingUpload => {
        const uploadData = {
          ...pendingUpload,
          userId: userId
        };
        
        // Return the upload request with error handling
        return new Observable<Array<{
          success: boolean;
          message?: string;
          fileName: string;
          error?: any;
        }>>(observer => {
          this.uploadAdjusterAttachment(uploadData).subscribe({
            next: response => {
              observer.next([{
                success: response.success,
                message: response.message,
                fileName: pendingUpload.fileName
              }]);
              observer.complete();
            },
            error: error => {
              console.error('Error uploading attachment:', error);
              observer.next([{
                success: false,
                fileName: pendingUpload.fileName,
                error: error
              }]);
              observer.complete();
            }
          });
        });
      })
    );
  }

  /**
   * Process multiple pending attachments in parallel
   * Use this if sequential processing is not required
   */
  processPendingUploadsParallel(userId: number, pendingUploads: Array<{
    fileName: string;
    fileType: string;
    fileExtention: string;
    fileData: string;
    discription?: string;
    expirationDate?: string;
    mimeType: string;
    uploadedDate: string;
    uploadedBy: number;
    modiFiedOn: string;
    modiFiedBy: number;
  }>): Observable<Array<{
    success: boolean;
    message?: string;
    fileName: string;
    error?: any;
  }>> {
    const uploads = pendingUploads.map(pendingUpload => {
      const uploadData = {
        ...pendingUpload,
        userId: userId
      };
      
      return this.uploadAdjusterAttachment(uploadData).pipe(
        map(response => ({
          success: response.success,
          message: response.message,
          fileName: pendingUpload.fileName
        })),
        catchError(error => {
          console.error('Error uploading attachment:', error);
          return from([{
            success: false,
            fileName: pendingUpload.fileName,
            error: error
          }]);
        })
      );
    });

    return forkJoin(uploads);
  }
}
