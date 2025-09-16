import { Component, OnInit,Input,Output,EventEmitter, ChangeDetectorRef, ViewChild} from '@angular/core';
import { FilterEditor, FilterOperator } from '@progress/kendo-angular-filter/model/filter-expression';
import { CompositeFilterDescriptor, FilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { FilterExpression } from '@progress/kendo-angular-filter';
import{Observable} from 'rxjs'
import { FileTracService } from 'src/app/services/file-trac.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

interface FilterData {
  keyValue: string;
  keyName: string;
  isDefault: boolean;
  type:string
}
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() filteredData$= new Observable<any[]>
  @Input() filterFieldsData:any;
  @Input() savedFilterObject:any;
  @Input() hideActionButtons: boolean = false;
  @Input() isViewOnlyMode: boolean = false;
  @Output() data =new EventEmitter<any>;
  @Output() dateForFilter =new EventEmitter<any>;
  @Output() resetSearchvalue =new EventEmitter<any>;
  @Output() companyNamevalue =new EventEmitter<any>;
  @Output() surveyTitleValue =new EventEmitter<any>;
  @Output() surveyNameValue =new EventEmitter<any>;
  @Output() operatorValue =new EventEmitter<any>;
  @Output() filterObject =new EventEmitter<any>;
  public filters: FilterExpression[] = [];
  public value: CompositeFilterDescriptor = {
    logic: "and",
    filters: []
  };
  dataForFilter:any
  originalUserData: any[] = []
  public fieldDataMap: { [key: string]: string[] } = {};
  multiselect:any
  private savedFilterState: CompositeFilterDescriptor | null = null;
  sqlQuery: any;
  companyNames: string[]=[]
  activeCompanies: string[]=[]
  surveyTitle: string[]=[]
  surveyName: string[]=[]
  public companyNamesLoaded: boolean = false;
  public surveyTitleLoaded: boolean = false;
  public activeCompaniesLoaded: boolean = false;
  public range: {
    start: Date | null,
    end: Date | null
  } = {
    start: null,
    end: null
  };
  @ViewChild('filter') filter: any;
  @ViewChild('filterReadOnly') filterReadOnly: any;
  constructor(private fileTracService:FileTracService,private cdr: ChangeDetectorRef,private authService:AuthService) { }

  ngOnInit(): void {
    // debugger
    this.handleFilterFieldDataInitialization();
    this.applySavedFilter()
    this.initializeFieldDataMap()
    this.sortFilterlist()
    this.getListOfCompanyName()
    this.getFileTracActiveCompanies()
    this.getGetSurveyTitleList()
  }
  
  private handleFilterFieldDataInitialization(): void {
    if (this.filterFieldsData) {
      const providedData: FilterData[] = this.filterFieldsData;
      this.filters = providedData ? this.createFilterExpressions(providedData) : [];
    }
  }

  applySavedFilter(){
    const savedFilterState = localStorage.getItem('filterStateReports');
    
      if (savedFilterState ) {
        //console.log("savedFilterState",savedFilterState);
        this.value = JSON.parse(savedFilterState);
        this.dataForFilter = this.value;
        // console.log("this.dataForFilter", this.dataForFilter);
        
        this.sqlQuery= this.convertFilterToSQL(this.dataForFilter)
      this.data.emit(this.sqlQuery)
      }
      if (this.savedFilterObject) {
        
        this.value = this.savedFilterObject;
        this.dataForFilter = this.value;
        this.sqlQuery = this.convertFilterToSQL(this.dataForFilter);
        this.data.emit(this.sqlQuery);
      }
      const savedRangeString = localStorage.getItem('savedRangeStringReports');
    if (savedRangeString) {
      try {
        const savedRange = JSON.parse(savedRangeString);
        this.range.start = savedRange.start ? new Date(savedRange.start) : null;
        this.range.end = savedRange.end ? new Date(savedRange.end) : null;
        // const dateFilter: FilterDescriptor = {
        //   field: 'claims_Received',
        //   operator: 'gt',
        //   value: [this.range.start, this.range.end]
        // };
        this.dateForFilter.emit(this.range)
        // this.value.filters.push(dateFilter);
      } catch (e) {
        console.error("Error parsing saved date range", e);
        // Set to null or some default values as per your requirement
        this.range.start = null;
        this.range.end = null;
  
      }
    } else {
      // If there's no saved range, you might want to set a default range or leave them as null
      this.range.start = null; // Adjust as needed
      this.range.end = null; // Adjust as needed
      this.dateForFilter.emit(this.range)
    }
  }




  
private createFilterExpressions(filterData: FilterData[]): FilterExpression[] {
  if (!filterData) {
    console.error('filterData is undefined');
    return [];
  }
  return filterData.map(item => {
    // console.log("item",item)
    let editor: FilterEditor;
    let operators: FilterOperator[];

    switch (item.type) {
      case 'string':
        editor = 'string';
        operators = ['eq', 'neq', 'contains', 'doesnotcontain', 'isnull', 'isnotnull'];
        break;
      case 'boolean':
        editor = 'boolean';
        operators = ['eq'];
        break;
      case 'number':
        editor = 'number';
        operators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'isnull', 'isnotnull'];
        break;
      case 'date':
        editor = 'date';
        operators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'isnull', 'isnotnull'];
        break;
      default:
        editor = 'string'; // Default editor
        operators = ['eq', 'neq', 'contains', 'doesnotcontain', 'isnull', 'isnotnull'];
    }

    return {
      field: item.keyName,
      title: item.keyValue,
      editor: editor,
      operators: operators
    };
  });
}
 
  private initializeFieldDataMap(): void {
    for (let filterItem of this.filters) {
        this.fieldDataMap[filterItem.field] = this.getOptionsForField(filterItem.field);
    }
}
sortFilterlist(): void {
  this.filters.sort((a, b) => a.title! < b.title! ? -1 : 1);
}
getListOfCompanyName(){
  this.fileTracService.GetListOfCompanyName().subscribe((item:any)=>{
    if(item && item.data){
      this.companyNames = item.data
    }
    this.fieldDataMap['companyName'] = this.companyNames;
    this.companyNamesLoaded = true;
    this.cdr.detectChanges();
  })
}

getFileTracActiveCompanies(){
  this.authService.getClients().subscribe((item:any)=>{
    if(item.success && item.data){
      this.activeCompanies = item.data.map((client: any) => 
        client.fName
      );
    }

    this.fieldDataMap['goodCandidateFor'] = this.activeCompanies.sort( (a:any,b:any)=> a.localeCompare(b))
    this.activeCompaniesLoaded = true;
    this.cdr.detectChanges();
  })
}

getGetSurveyTitleList(){
  this.fileTracService.GetSurveyTitleList().subscribe((item:any)=>{
    if(item && item.data){
      this.surveyTitle = item.data['titles']
      this.surveyName = item.data['surveyName']
      this.fieldDataMap['Title'] = this.surveyTitle;
      this.fieldDataMap['SurveyName'] = this.surveyName;

   this.surveyTitleLoaded = true;
    }
    this.cdr.detectChanges();
  })
}
  getOptionsForField(fieldName: string): string[] {
    const data = {
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: ['Both', 'CAT', 'Daily'],
      casualty: ['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      clickClaims:["None", "Beginner", "Intermediate", "Advanced"],
      commercial_Property_Desk:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      commercial_Property_Field:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      residential_Property_Desk:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      residential_Property_Field:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      flood_Desk:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      flood_Field:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      auto:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      auto_Appraisal:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      construction:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      construction_Defect:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      general_Liability:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      heavy_Equipment:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      homeowner_Liability:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      inland_Marine:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      on_SceneInvestigations:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      business_Interruption:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      claims_Supervisor:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      earthquake:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      high_End_Residential:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      large_Loss_Commercial:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      large_Loss_Contents:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      large_Loss_Fire:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      litigation:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      mobile_Homes:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      municipality_Losses:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      sinkhole:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      water_Mitigation_Estimating:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
      fileTrac:["None", "Beginner", "Intermediate", "Advanced"],
      xactimate_Estimating:["None", "Beginner", "Intermediate", "Advanced"],
      claimXperience:["None", "Beginner", "Intermediate", "Advanced"],
      guidewire:["None", "Beginner", "Intermediate", "Advanced"],
      hover:["None", "Beginner", "Intermediate", "Advanced"],
      mitchell:["None", "Beginner", "Intermediate", "Advanced"],
      plnar:["None", "Beginner", "Intermediate", "Advanced"],
      symbility:["None", "Beginner", "Intermediate", "Advanced"],
      xactAnalysis:["None", "Beginner", "Intermediate", "Advanced"],
      xactimate_Collaboration:["None", "Beginner", "Intermediate", "Advanced"],
      i_Am_Interested_In_The_Following_Assignments:['Claims Supervisor', 'Desk Assignments', 'Field Assignments', 'File Review', 'Underwriting Field Inspections', 'Virtual Adjusting', 'W2 Positions'],
      adjuster_Licenses:['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
      failedLoginStatus: ["Unlocked","Locked"],
      state:['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
      prevetting:["A", "B", "C", "D", "X","PF","Pre-vet field residential", "Pre-vet field commercial", "Pre-vet desk residential","Pre-vet desk commercial","Pre-Vetted Proctor","Vetted Proctor"],
      userRoleDataCSV:['Adjuster','Adjuster_Lead', 'Admin','Employee','Super Admin'],
      status:['Active','Inactive'],
      userTypeName:['Internal User','External User'],
      location_Preference:["Local", "In State", "Out of State"],
      insurance_Designations:['AIC', 'ARM', 'CPCU', 'Haag Commercial', 'Haag Residential', 'HAAG Reviewer', 'IICRC', 'PTC1', 'PTC2', 'PTC3', 'Other'],
      certifications:["American Family", "Earthquake", "Florida Citizens", "Liberty Mutual", "NFIP/Flood", "Nationwide", "Part 107 Drone License", "Rope and Harness", "State Farm", "The Hartford", "Tower Hill", "TWIA", "USAA", "Zurich", "Other"],
      how_Did_You_Hear_About_Us:["Catadjuster.org","Facebook","LinkedIn","NACA","Recommended by another adjuster","Twitter"],
      qB_Status_Internal:["Discarded","Does Not Meet","Do Not Deploy","FileTrac Processing","Onboarding Complete","Qualifying","Systems Setup","Unknown","Unresponsive","Vetted","Vetting"],
      qB_Line_Of_Business_Internal:["Auto", "Casualty", "Commercial", "Flood", "Liability", "Mobile Home", "Residential", "Workman Comp"],
      deployment_Status_Internal:["CAT Standby","Non-CAT Standby","Not A Good Candidate","Poor Past Performancce","Remove From Roster (see notes)","Reserve"],
      isActive:["Yes","No"],
      isLocked:["Unlocked","Locked"],
      i_Would_Like_To_Receive_Email_Communications_From_Field_Pros_Direct_Email_Opt_In:["Yes","No"],
      i_Would_Like_To_Receive_Text_Communications_From_Field_Pros_Direct_Text_Opt_In:["Yes","No"],
      companyName:this.companyNames,
      goodCandidateFor:this.activeCompanies,
      Title:this.surveyTitle,
      SurveyName:this.surveyName,
      residential_Field_Grade:["A", "B", "C", "D", "X"],
      commercial_Field_Grade:["A", "B", "C", "D", "X"],
      liability_Grade:["A", "B", "C", "D", "X"],
      inspector_Grade:["A", "B", "C", "D", "X"],
      desk_Grade:["A", "B", "C", "D", "X"],
      claims_Supervisor_Grade:["A", "B", "C", "D", "X"],
      file_Review_Grade:["A", "B", "C", "D", "X"],

  };
  const options = (data as any)[fieldName] || [];
  return options;
}

isArrayOptionsEmpty(fieldName: string): boolean {
  const options = this.getOptionsForField(fieldName);
  return options.length === 0;
}


getPreselectedValues(fieldName: string): any[] {
  const filters = this.value.filters.filter(filter => 
      'field' in filter && 
      filter.field === fieldName
  ) as FilterDescriptor[];

  return filters.map(filter => filter.value);
}

isArray(value: any): boolean | null {
  if (value == null) {  // This checks for both null and undefined
    return null;
  }
  return Array.isArray(value);
}


isOperatorEmptyOrNotEmpty(filterValue: FilterDescriptor): boolean {
  return filterValue?.operator === 'isnotnull' || filterValue?.operator === 'isnull';
}
applyFilters(value: CompositeFilterDescriptor) {
  if (value.filters.length > 0) {
    // Map the dataset to convert date strings back to Date objects, if necessary
    value.filters.forEach((filter: any) => {
       if(filter.field === 'lastLogin' || filter.field==='modifiedOn' || filter.field==='claims_Received'){
        if (filter.value){
          const formattedDate = moment(filter.value).format('MM-DD-YYYY');
          filter.value = formattedDate;
        }
        
      }
      if(filter.field === 'isLocked' ){
        const formattedValue = filter.value.toLowerCase()
        filter.value = formattedValue
      }
    });
  
    //console.log("filtered value",value)
    this.sqlQuery= this.convertFilterToSQL(value)
    // console.log("sqlQuery",this.sqlQuery)
    localStorage.setItem('filterStateReports', JSON.stringify(value));
    this.filterObject.emit(value);

    this.data.emit(this.sqlQuery);
  } else {
    this.data.emit('');
    this.companyNamevalue.emit('');
    this.surveyNameValue.emit('');
    this.surveyTitleValue.emit('');
    this.operatorValue.emit('AND');
    localStorage.setItem('filterStateReports', JSON.stringify(''));
  }
  if(value){
    value.filters.forEach((filter: any) => {
      if(filter.field === 'lastLogin' || filter.field==='modifiedOn' || filter.field==='claims_Received'){
       if (filter.value){
        filter.value = new Date(filter.value)
       }
       
     }
   });
  }
 
  this.dataForFilter = value;
  this.cdr.detectChanges()
  // console.log("dataForFilter after apply",this.dataForFilter)
}


 public filterFn(event:CompositeFilterDescriptor){
  if (this.isViewOnlyMode) {
    return; // Don't process filter changes in view-only mode
  }
  
  // Process filter values for eq and neq operators
  event.filters.forEach(filter => {
    if ('field' in filter) {
      // Find the corresponding filter definition
      const filterDef = this.filters.find(f => f.field === filter.field);
      
      // If this is a boolean field, force the operator to be 'eq'
      if (filterDef && filterDef.editor === 'boolean') {
        filter.operator = 'eq';
      }
      
      // Handle value conversion for eq and neq operators
      if ('operator' in filter && (filter.operator === "eq" || filter.operator === "neq")) {
        if (filter.value && typeof filter.value === 'object') {
          filter.value = filter.value[0];
        }
      }
    }
  });
  
  this.dataForFilter = event;
}
 applyfiltersManual() {
  if (this.isViewOnlyMode) {
    return; // Don't apply filters in view-only mode
  }
  
  //("dataForFilter", this.dataForFilter);

  let claimsReceivedPresent = false;
  let companyNamePresent = false;
  let surveyNamePresent = false;
  let surveyTitlePresent = false;
  let canApplyFilters = true; // Flag to determine if applyFilters can be called

  // First, check if 'claims_Received' and 'companyName' are in the filters
  if (this.dataForFilter && this.dataForFilter.filters.length > 0) {
    claimsReceivedPresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'claims_Received');
    companyNamePresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'companyName');
    surveyNamePresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'SurveyName');
    surveyTitlePresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'Title');
  }

  // Handle 'claims_Received' logic
  if (claimsReceivedPresent) {
    if (this.range.start && this.range.end) {
      localStorage.setItem("savedRangeString", JSON.stringify(this.range));
      this.dateForFilter.emit(this.range);
    } else {
      this.dateForFilter.emit("");
    }
  } else {
    this.range.start = null;
    this.range.end = null;
    this.dateForFilter.emit(null);
  }

  // Handle 'companyName' logic
  if (!companyNamePresent) {
    this.companyNamevalue.emit('');
  }
  if (!surveyNamePresent) {
    this.surveyNameValue.emit('');
  }
  if (!surveyTitlePresent) {
    this.surveyTitleValue.emit('');
  }
  const checkFiltersForValue = (filters:any) => {
    for (const filter of filters) {
        if (filter.logic && filter.filters) {
            // Recursively check nested filters
            if (!checkFiltersForValue(filter.filters)) return false;
        } else if (!(filter.operator === "isnull" || filter.operator === "isnotnull")) {
            // Check if filter has a value, considering array values
            if (Array.isArray(filter.value) ? filter.value.length === 0 : !filter.value) {
                Swal.fire({
                    title: 'Filter value missing',
                    text: 'Please select or enter a value before applying filter',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#ffa022',
                });
                return false; // Found a filter without a value
            }
        }
    }
    return true; // All filters have values
};

  // Check all filters for a value unless the operator is 'isnull' or 'isnotnull'
    // Call applyFilters if all conditions are met
    if (this.dataForFilter && this.dataForFilter.filters.length > 0) {
      canApplyFilters = checkFiltersForValue(this.dataForFilter.filters);

      if (canApplyFilters) {
          this.applyFilters(this.dataForFilter);
      }
  }
   else {
    // No filters are present
    this.data.emit("");
    this.companyNamevalue.emit('');
    this.surveyNameValue.emit('');
    this.surveyTitleValue.emit('');
    this.operatorValue.emit('AND');
    this.value = { logic: 'and', filters: [] };
    this.dataForFilter = this.value;
  }
}


initializeValue(): void {
  if (this.isViewOnlyMode) {
    return; // Don't initialize/reset values in view-only mode
  }
  
  this.resetSearchvalue.emit('')
  this.companyNamevalue.emit('')
  this.surveyNameValue.emit('')
  this.surveyTitleValue.emit('')
  this.operatorValue.emit('AND')
  this.value = { logic: 'and', filters: [] };
  this.applyFilters(this.value);
  localStorage.removeItem('filterStateReports');
  localStorage.removeItem('savedRangeStringReports');
  
  this.dataForFilter=this.value
  this.range= {
    start: null,
    end: null
  };
  this.dateForFilter.emit(this.range)
  
}

 public handleFilterChange(searchTerm: any, fieldName: string): void {
  const normalizedQuery = searchTerm.toLowerCase();
  let allData = this.getOptionsForField(fieldName);  // Gets all data for the given field
  let filteredData = allData.filter(item => item.toLowerCase().includes(normalizedQuery));  // Filters the data based on the search term
  this.fieldDataMap[fieldName] = filteredData;  // Updates the data bound to the Kendo MultiSelect
}
public updateDataForField(fieldName: string, filteredData: string[]): void {
  // Assume fieldDataMap is a property that maps field names to the data currently bound to the corresponding Kendo MultiSelect components
  this.fieldDataMap[fieldName] = filteredData;
}
public onChangeForMultiselect(event: any, currentItem: FilterDescriptor) {
  if (event) {
    currentItem.value = event;
  //  if(this.dataForFilter){
  //   this.dataForFilter.filters.forEach((filterItem: FilterDescriptor)=>{
  //     if(filterItem.field == currentItem.field){
  //       filterItem.value=currentItem.value
  //     }
  //   })
  //  }
  }
  // Check if the field is a date field and event is a date object or string
  if (this.isDateEditor(currentItem.field)) {
    if (event instanceof Date) {
      // If event is a Date object, format it to an ISO string
      currentItem.value = event.toISOString();
    } else if (typeof event === 'string') {
      // If event is a string (for example, from a manual input), attempt to parse it as a date
      currentItem.value = new Date(event).toISOString();
    }
  } else {
    // For non-date fields, assign the event value directly
    currentItem.value = event;
  }
  
}
onChangeForSingleValue(event: any, currentItem: FilterDescriptor){
  // console.log("event",event)
  if (event) {
    currentItem.value = event;
   if(this.dataForFilter){
    this.dataForFilter.filters.forEach((filterItem: FilterDescriptor)=>{
      if(filterItem.field == currentItem.field){
        filterItem.value=currentItem.value
      }
    })
   }
  }

  if (typeof event === 'string' && typeof currentItem.field === 'string') {
    // If currentItem.field corresponds to a date editor
    if (this.isDateEditor(currentItem.field)) {
      // Convert the string to a Date object and assign it to currentItem.value
      currentItem.value = new Date(event);
    }
  } 
  this.cdr.detectChanges();
}

private isDateEditor(fieldName: any): boolean {
  return this.filters.some(item => item.field === fieldName && item.editor === 'date');
}
getMultiselectValue(currentItem: any) {
  if (typeof currentItem.value === 'string' && currentItem.value.trim() !== "") {
    // Ensure splitting is only done when necessary and preserves actual values
    currentItem.value = currentItem.value.includes(',') ? [currentItem.value] : [currentItem.value];
  }
  return currentItem.value;
}
getDateValue(currentItem: any) {
  if (currentItem.value instanceof Date && !isNaN(currentItem.value.getDate())) {
    return currentItem.value; // return as it is, if it's a valid date
  }
  return null; // return null if it's not a valid date
}


convertFilterToSQL(filter:any) {
  if (!filter.filters || filter.filters.length === 0) return '';

  let specialConditions:any = []; // For fields with 'contains' or 'doesnotcontain'
  let companyNameConditions:any = []; // Specifically for companyName
  let surveyNameConditions:any = []; // Specifically for surveyName
  let surveyTitleConditions:any = []; // Specifically for surveyTitle
  this.operatorValue.emit(filter.logic  === 'and' ? 'AND' : 'OR');
  let conditions = filter.filters.map((f:any) => {
      if (f.logic) {
        // console.log("f",f)
          // Handle nested filters with a check to avoid empty conditions
          let nestedCondition = this.convertFilterToSQL(f);
          return nestedCondition ? `(${nestedCondition})` : '';
      } else {
          let sqlOperator = this.convertOperatorToSQL(f.operator);
          if ((f.operator === 'contains' || f.operator === 'doesnotcontain') && Array.isArray(f.value)) {
              let arrayConditions = f.value.map((val:any) => `${f.field} ${sqlOperator} ${this.handleValueForSQL(val, f.operator)}`).join(' AND ');
              if (f.field === 'companyName') {
                  companyNameConditions.push(`(${arrayConditions})`);
              } else if (f.field === 'SurveyName') {
                  surveyNameConditions.push(`(${arrayConditions})`);
              } else if (f.field === 'Title') {
                  surveyTitleConditions.push(`(${arrayConditions})`);
              }else {
                  specialConditions.push(`(${arrayConditions})`);
              }
              return ''; // Skip adding to conditions directly
          } else if(f.operator === 'isnull' || f.operator === 'isnotnull') {
              // Handle isnull/isnotnull operators with NULLIF function
              let condition = `NULLIF(LTRIM(RTRIM(${f.field})), '') ${sqlOperator}`;
              
              if (f.field === 'companyName') {
                  companyNameConditions.push(condition);
                  return ''; // Skip for companyName
              } else if (f.field === 'SurveyName') {
                  surveyNameConditions.push(condition);
                  return ''; // Skip for surveyName
              } else if (f.field === 'Title') {
                  surveyTitleConditions.push(condition);
                  return ''; // Skip for surveyTitle
              } else {
                  specialConditions.push(condition);
                  return ''; // Skip for these operators
              }
          } else {
              let value = this.handleValueForSQL(f.value, f.operator);
              let condition = `${f.field} ${sqlOperator} ${value}`;
              // console.log("condition",condition)
              if (f.field === 'companyName') {
                  companyNameConditions.push(condition);
                  return ''; // Skip for companyName
              } else if (f.field === 'SurveyName') {
                  surveyNameConditions.push(condition);
                  return ''; // Skip for surveyName
              } else if (f.field === 'Title') {
                  surveyTitleConditions.push(condition);
                  return ''; // Skip for surveyTitle
              }
              
              
              
              
              else if (f.operator === 'contains' || f.operator === 'doesnotcontain') {
                  specialConditions.push(condition);
                  return ''; // Skip for these operators
              }
              return condition;
          }
      }
  }).filter((condition:any) => condition !== ''); // Remove empty strings
  let logicOperator = filter.logic === 'and' ? ' AND ' : ' OR ';
  // Adjusting companyNameConditions joining based on top-level logic
  if (companyNameConditions.length > 0) {
     
      let companyNameQuery = companyNameConditions.join(logicOperator);
      this.companyNamevalue.emit(companyNameQuery); // Emit using the appropriate mechanism
      conditions.push(`(${companyNameQuery})`); // Group companyName conditions with correct logic
  }

  // Adjusting surveyNameConditions joining based on top-level logic
  if (surveyNameConditions.length > 0) {
      
      let surveyNameQuery = surveyNameConditions.join(logicOperator);
      this.surveyNameValue.emit(surveyNameQuery); // Emit using the appropriate mechanism
      conditions.push(`(${surveyNameQuery})`); // Group surveyName conditions with correct logic
  }

  // Adjusting surveyTitleConditions joining based on top-level logic
  if (surveyTitleConditions.length > 0) {
      
      let surveyTitleQuery = surveyTitleConditions.join(logicOperator);
      this.surveyTitleValue.emit(surveyTitleQuery); // Emit using the appropriate mechanism
      conditions.push(`(${surveyTitleQuery})`); // Group surveyTitle conditions with correct logic
  }

  // Handle special conditions for other fields
  if (specialConditions.length > 0) {
      let specialQuery = specialConditions.join(logicOperator);
      conditions.push(`(${specialQuery})`); // Group special conditions for other fields
  }

  
  let finalQuery = conditions.join(logicOperator);
  // console.log("finalQuery",finalQuery)
  return finalQuery.startsWith('(') && finalQuery.endsWith(')') && !finalQuery.includes(logicOperator) ? finalQuery.slice(1, -1) : finalQuery;
}



convertOperatorToSQL(operator:any) {
  // Map logical operators to their SQL equivalents, including numeric comparisons
  switch (operator) {
      case 'eq': return '=';
      case 'neq': return '<>';
      case 'contains': return 'LIKE'; // For string comparisons
      case 'gt': return '>';
      case 'gte': return '>=';
      case 'lt': return '<';
      case 'lte': return '<=';
      case 'isnull':return 'IS NULL';
      case 'isnotnull':return 'IS NOT NULL';
      case 'doesnotcontain':return 'NOT LIKE';
      default: return '';
  }
}

handleValueForSQL(value:any, operator:any) {
  // console.log("value",value)
  // console.log("operator",operator)

    // Check if the value is a string and needs LIKE operator handling
    if (operator === 'contains' || operator === 'doesnotcontain'){
        // Use LIKE and escape single quotes for string values
        return `'%${value.replace(/'/g, "''")}%'`;
    } else if (typeof value === 'number') {
        // Directly return numbers without quotes for numeric operations
        return value;
    } else if (value === null || value === undefined) {
        // Handle null or undefined values
        return '';
    } else {
        // For all other cases, convert the value to string and escape single quotes
        return `'${value}'`;
    }
}

public triggerApplyFilters(): void {
  if (this.isViewOnlyMode) {
    return; // Don't trigger apply filters in view-only mode
  }
  
  this.applyfiltersManual();
}

}
