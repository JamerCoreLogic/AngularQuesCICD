import { environment } from 'src/environments/environment';

export class AppSettings {
    //Dev
    // public static API_ENDPOINT = 'http://10.130.205.130:7172/';
    // public static googleMapsApiKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyApGW6riz_TdzjJqCI-ER3GIR6G0QI6TSE&callback=initMap'

    //UAT 2 
    //  public static API_ENDPOINT = 'https://uat.myfpdportal.com/API/';
    //  public static googleMapsApiKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyApGW6riz_TdzjJqCI-ER3GIR6G0QI6TSE&callback=initMap'

    //QA UAT
    // public static API_ENDPOINT = 'https://qa.myfpdportal.com/api/';
    // public static googleMapsApiKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyApGW6riz_TdzjJqCI-ER3GIR6G0QI6TSE&callback=initMap'

    //production before build change kendo-ui-license key
    // public static API_ENDPOINT = 'https://www.myfpdportal.com/api/';
    // public static googleMapsApiKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBKTVrDJCP1PJba8MTi3WCkSybEw1RRWyY&callback=initMap'

    //set the API_ENDPOINT to the environment file
    public static API_ENDPOINT = environment.API_ENDPOINT;
    public static googleMapsApiKey = environment.googleMapsApiKey;

    //adjuster
    public static GetUserByAddress = 'ClientAdmin/GetUserByAddress';
    public static InitiateRequest = 'Request/InitiateRequest';
    public static GetClientList = 'ClientAdmin/GetClientList';
    public static GetAssessmentList = 'Common/GetAssessmentList';
    public static GetReleaseVersionDetails = 'Common/GetReleaseVersionDetails';
    public static GetViewProfileByUserId = 'ClientAdmin/GetViewProfileByUserId';
    public static GetUserRequestDetailsByUserId = 'ClientAdmin/GetUserRequestDetailsByUserId';

    //communication
    public static GetDataForBindUIScreen = 'Response/GetDataForBindUIScreen';
    public static SubmitResponce = 'Response/Response';

    //dashboard
    public static GetDashboardData = 'CommunicationDashboard/Communication';
    public static GetActiveUserPercentage = 'CommunicationDashboard/GetActiveUserPercentage';
    public static MarkedCompleted = 'CommunicationDashboard/MarkedCompleted';
    public static GetCommunicationResponse = 'CommunicationDashboard/GetCommunicationResponse';

    //Admin and Auth
    public static GetRoleList = 'common/GetRoleList'
    public static GetRoleTypeList = 'common/GetTypeList'
    public static login = 'common/login'
    public static GetUserByRoleId = 'ClientAdmin/GetUserByRoleId?roleId='
    public static GetUserListForAdminDashboard = 'ClientAdmin/GetUserListForAdminDashboard'
    public static GetTaskListForAdminDashboard = 'ClientAdmin/GetUserListForTasksDashboard'
    public static GetUserDataById = 'ClientAdmin/GetUserDataById?userId='
    public static EditUser = 'ClientAdmin/EditUser'
    public static SendLinkFrogetPassword = 'ForgetPassword/SendLinkFrogetPassword'
    public static VerifyOTP = 'common/VerifyOTP'
    public static saveForgotPass = 'ForgetPassword/SaveForgetPassword'
    public static updatePass = 'ForgetPassword/UpdatePassword'
    public static deleteUser = 'ClientAdmin/DeleteUser'
    public static GetUserResources = 'ClientAdmin/GetUserResourceCount'
    public static lockProfile = 'ClientAdmin/LockProfile?'
    public static unlockProfile = 'ClientAdmin/UnlockProfile?'
    public static updateResetPassword = 'ForgetPassword/UpdateResetPassword'
    public static CheckUserForSubmit = 'ClientAdmin/CheckUserForSubmit?userId='
    public static GetStates = 'Common/GetStateList?countryId='
    public static AddUserRegistration='ClientAdmin/AddUserRegistration'
    public static AddUpdateUser='ClientAdmin/AddUpdateUser'
    public static GetFileTracDataGroupByYear ="FileTrac/GetFileTracDataGroupByYear"
    public static GetFileTracDataGroupByCompanyName ="FileTrac/GetFileTracDataGroupByCompanyName"
    public static GetFileTracId ="FileTrac/GetFileTracId"
    public static GetTotalNumberOfClaims ="FileTrac/GetTotalNumberOfClaims"
    public static UpdateFileTracId ="FileTrac/UpdateFileTracId"
    public static GetFileTracActiveCompanies ="FileTrac/GetFileTracActiveCompanies"
    public static GetHeartbeat = 'Heartbeat/Get'
    public static GetAuditLogEntry = 'ClientAdmin/getAuditLogEntry'
    public static GetUserSummary = 'ClientAdmin/GetUserSummary'
    public static GetUserTaskSummary = 'ClientAdmin/GetUserTaskSummary'
    public static GetActiveFileTypes = 'ClientAdmin/GetActiveFileTypes'
    public static GetAdjusterAttachmentsByUserId = 'ClientAdmin/GetAdjusterAttachmentsByUserId'
    public static UploadAdjusterAttachment = 'ClientAdmin/UploadAdjusterAttachment'
    public static GetAdjusterAttachmentByIdAndUserId = 'ClientAdmin/GetAdjusterAttachmentByIdAndUserId'
    public static DeleteAttachment = 'ClientAdmin/DeleteAttachment'

    //Client
    public static getClients = 'ClientAdmin/GetClientList';
    public static addClient = 'ClientAdmin/AddClient';
    public static editClient = 'ClientAdmin/EditClient';
    public static deleteClient = 'ClientAdmin/DeleteClient?clientId=';

    // Assessment
    public static getAssessments = 'Common/GetAssessmentList';
    public static addAssessments = 'Common/AddAssessment';
    public static editAssessment = 'Common/EditAssessment';
    public static deleteAssessment = 'Common/DeleteAssessment?assessmentTypeId=';

    //Reports
    public static GetUserListForReports = 'ClientAdmin/GetUserDataForReport';
    public static GetFiledsListForReports = 'ClientAdmin/GetFiledsListForReports';
    public static GetRequestedListForReportDashboard = 'ClientAdmin/GetRequestedListForReportDashboard';
    
    //FileTrac
    public static GetListOfFileTracData = 'FileTrac/GetListOfFileTracData';
    public static GetListOfCompanyName = 'FileTrac/GetListOfCompanyName';

    //ai API
    public static GetSurveyList = 'Survey/GetSurveyList?ClientId='
    public static GetEmailPreviewData='Survey/GetEmailTemplateById?TemplateId='
    public static SendSurvey = 'Survey/SendSurvey'
    public static GetInitiatedRecordCount = 'Survey/GetInitiatedRecordCount'
    public static GetSurveyDashBoardDetails ='Survey/GetSurveyDashBoardDetails'
    public static GetSurveyRecordsById = 'Survey/getSurveyRecordsById'
    public static MarkComplete = 'Survey/MarkComplete?SurveyRequestId='
    public static GetSurveysByAdjusterId = 'Survey/GetSurveysByAdjusterId?adjusterId='
    public static GetDataSourceColumn = 'Survey/GetDataSourceColumn?AIInspectionSurveyId=' 
    public static UpdateSurveyInfo='Survey/UpdateSurveyInfo'
    public static GetInternalUsers = 'Survey/GetInternalUsers'
    public static AddUpdateAssignTo = 'Survey/AddUpdateAssignTo'
    public static GetServeyResponse = 'Survey/getServeyResponse?SurveyId='
    public static GetSurveyTitleList = 'Survey/GetSurveyTitleList'
    
    // Grid state management endpoints
    public static GetSurveyFiltercolumnsList = 'Survey/GetSurveyFiltercolumnsList?inspectionId='
    public static SaveCustomView = 'Survey/SaveCustomView'
    public static DeleteSurveyCustomView = 'Survey/DeleteSurveyCustomView?Id='
    public static GetSurveyCustomViews = 'Survey/GetSurveyCustomViews?surveyId='

    //file Explorer
    public static Getresources = 'Resource/getresources/getresources'
    public static Getfile = 'Resource/getfile/getfile'
    public static Streamvideo = 'Resource/streamvideo'
    public static Updateresources = 'Resource/UpdateResources/updateresources'
    public static Downloadfile = 'Resource/DownloadFile'


    //CustomView
    public static GetActiveModuleColumns = 'CustomView/GetActiveModuleColumns'
    public static AddUpdateCustomView = 'CustomView/AddUpdateCustomView'
    public static GetCustomView = 'CustomView/GetCustomView/'
    public static DeleteCustomView = 'CustomView/DeleteCustomView?id='
    public static GetCustomViewList = 'CustomView/GetCustomViewList'

}