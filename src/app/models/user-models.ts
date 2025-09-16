export interface User {
  emailAddress: string;
  password: string;
  role: Role[];
  token: string;
  userId: string;
  status: string;
  userName: string;
  connectionString: string;
  latitude: string;
  longitude: string;
  profilePic: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  rolePermissionData: RolePermissionData[];
}

export interface RolePermissionData {
  userRolePermissionId: number;
  pageName: string;
  pageURL: string;
}
export interface AdminElement {
  select: number;
  Name: string;
  Role: string;
  State: string;
  Phone: string;
  Email: string;
  Status: string;
  LastActivity: Date;
  lastLogin:Date;
  // Action: string;
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
  zip: string;
  country: string;
  address1: string;
  street: string;
  state: string;
  roleName: string;
  modifiedOn: Date;
  userTypeName: string;
  isActive: string;
  [Name: string]: any;
  prevetting: string;
  i_Am_Interested_In: string;
  adjuster_Licenses: string;
  residential_Property_Desk: string;
  residential_Property_Field: string;
  commercial_Property_Desk: string;
  commercial_Property_Field: string;
  casualty:string;
  fileTrac: string;
  clickClaims: string;
  xactimate_Estimating: string;
  what_Type_Of_Claims: string;
  fileTracId:Number;
  totalNumberOfClaims:Number
}
export interface ReportsElement {
  select: number;
  name :  string ,
  emailAddress :  string ,
  userRoleData : [],
  userId :  number ,
  mobile : string,
  address1 : string,
  address2 : string,
  street : string,
  city : string,
  state : string,
  zip : string,
  country : string,
  emailOption : boolean,
  secondaryEmail : string,
  xactNetAddress : string,
  status :  string ,
  lastLogin : string,
  isDeleted : boolean,
  isActive : boolean,
  isLocked : boolean,
  failedLoginCount : number,
  failedLoginStatus :  string ,
  createdBy :  number ,
  modifiedOn :  string ,
  latitude : string,
  longitude : string,
  profilePic :   any,
  userTypeId : number,
  confirmEmail :  string ,
  companyName : string  ,
  mobileNumber :  number ,
  what_Type_Of_Phone_Do_You_Use :   string,
  standby : string,
  i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In : string,
  i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In : string,
  prevetting : string,
  what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned : string,
  residential_Property_Desk : string,
  residential_Property_Field : string,
  commercial_Property_Desk : string,
  commercial_Property_Field : string,
  fileTrac : string,
  casualty : string,
  clickClaims : string,
  xactimate_Estimating : string,
  adjusterInformationId :  string ,
  i_Am_Interested_In_The_Following_Assignments : string,
  largest_Claim_I_Have_Handled : string,
  file_Review_Experience : string,
  writing_Denial_Or_Coverage_Letters : string,
  experience_With_PAs : string,
  experience_With_AOB : string,
  fluent_In_Spanish : string,
  what_Sets_You_Apart_From_Other_Adjusters : string,
  iA_Firms_I_Have_Worked_With : string,
  carriers_You_Have_Worked_For : string,
  flood_Desk : string,
  flood_Field : string,
  auto : string,
  auto_Appraisal : string,
  heavy_Equipment : string,
  on_SceneInvestigations : string,
  homeowner_Liability : string,
  general_Liability : string,
  construction : string,
  construction_Defect : string,
  sinkhole : string,
  water_Mitigation_Estimating : string,
  crop : string,
  large_Loss_Contents : string,
  large_Loss_Fire : string,
  large_Loss_Commercial : string,
  litigation : string,
  high_End_Residential : string,
  business_Interruption : string,
  mobile_Homes : string,
  municipality_Losses : string,
  claims_Supervisor : string,
  earthquake : string,
  environment_Disaster : string,
  xactimate_Collaboration : string,
  xactAnalysis : string,
  mitchell : string,
  symbility : string,
  guidewire : string,
  hover : string,
  claimXperience : string,
  plnar : string,
  bio_Or_Mini_Resume : string,
  zohoId : string,
  approximate_Date_I_Began_Adjusting : string,
  location_Preference : string,
  insurance_Designations : string,
  insurance_Designations_Other : string,
  certifications : string,
  certifications_Other : string,
  fcn : string,
  adjuster_Licenses : string,
  national_Producer_Number : string,
  how_Did_You_Hear_About_Us : string,
  how_Did_You_Hear_About_Us_Other : string,
  average_Mgr_Rating_Internal : string,
  qB_Status_Internal : string,
  qB_Line_Of_Business_Internal : string,
  deployment_Status_Internal : string,
  content_Loss : string,
  auto_Liability : string,
  auto_Total_Loss : string,
  auto_Commertial : string,
  juris : string,
  next_Gen : string,
  fox_Pro : string,
  aS400 : string,
  simsol : string,
  diamond : string,
  inland_Marine : string,
  xactNetAddressSkill : string,
  goodCandidateFor: string,
}
export interface FiledsListModel{
  keyName:string,
  keyValue:string,
  isDefault:boolean,
  type:string
}

export interface Tasks {
  userId: string;
  name: string;
  phone: string;
  emailAddress: string;
  backgroundCheckStatus: string;
  fieldAdjusterContract: string;
  deskAdjusterContract: string;
  supervisorContract: string;
  adminContract: string;
  payrollStatus: string;
}
