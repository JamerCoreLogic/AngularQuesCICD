import { Component, OnInit,Input,Output,EventEmitter, ChangeDetectorRef} from '@angular/core';
import { FilterExpression} from '@progress/kendo-angular-filter';
import { CompositeFilterDescriptor, FilterDescriptor, FilterOperator, filterBy, toDataSourceRequestString } from '@progress/kendo-data-query';
import{Observable} from 'rxjs'
import { FileTracService } from 'src/app/services/file-trac.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() filteredData$= new Observable<any[]>
  @Output() data =new EventEmitter<any>;
  @Output() dateForFilter =new EventEmitter<any>;
  @Output() resetSearchvalue =new EventEmitter<any>;
  @Output() companyNamevalue =new EventEmitter<any>;
  @Output() surveyNameValue = new EventEmitter<any>();
  @Output() operatorValue = new EventEmitter<any>();
  @Output() surveyTitleValue = new EventEmitter<any>();
  public filters: FilterExpression[] = [
    { field: 'companyName', title: 'Client Company', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'totalNumberOfClaims', title: 'Total Number Of Claims', editor: 'number', operators: ['eq','neq','gt','lt','lte' ,'gte','isnull','isnotnull'] },
    { field: 'claims_Received', title: 'Claim Date Received', editor: 'date', operators: ['gt','lt','lte' ,'gte'] },
    { field: 'what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned', title: 'Assignment Preference', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'casualty', title: 'Casualty', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'clickClaims', title: 'Click Claims', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'commercial_Property_Desk', title: 'Commercial Property Desk', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'commercial_Property_Field', title: 'Commercial Property Field', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'fileTrac', title: 'FileTrac', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'i_Am_Interested_In_The_Following_Assignments', title: 'I’m Interested in', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'modifiedOn', title: 'Last Activity', editor: 'date', operators: ['gt','lt','lte' ,'gte'] },
    { field: 'lastLogin', title: 'Last Login', editor: 'date', operators: ['gt','lt','lte' ,'gte'] },
    { field: 'adjuster_Licenses', title: 'Licensed States', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'isLocked', title: 'Locked', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'state', title: 'Mailing State', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'prevetting', title: 'Prevetting', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'residential_Property_Desk', title: 'Residential Property Desk', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'residential_Property_Field', title: 'Residential Property Field', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'userRoleDataCSV', title: 'Role', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'status', title: 'Status', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'userTypeName', title: 'User Type', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'xactimate_Estimating', title: 'Xactimate Estimating', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    {field: 'goodCandidateFor', title: 'Good Candidate', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'surveyName', title: 'Survey Name', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'surveyTitle', title: 'Survey Title', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'residential_Field_Grade', title: 'Residential Field Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'commercial_Field_Grade', title: 'Commercial Field Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'liability_Grade', title: 'Liability Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'inspector_Grade', title: 'Inspector Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'desk_Grade', title: 'Desk Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'claims_Supervisor_Grade', title: 'Claims Supervisor Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
      { field: 'file_Review_Grade', title: 'File Review Grade', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },

  ];
  public value: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
  dataForFilter:any
  originalUserData: any[] = []
  public fieldDataMap: { [key: string]: string[] } = {};
  multiselect:any
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
  sqlQuery: any;
  companyName: any;
  constructor(private fileTracService:FileTracService,private cdr: ChangeDetectorRef,private authService:AuthService) { }

  ngOnInit(): void {
    this.applySavedFilter()
    this.initializeFieldDataMap();
    this.sortFilterlist();
    this.getListOfCompanyName()
    this.getFileTracActiveCompanies()
    this.getGetSurveyTitleList()
  }
 
private initializeFieldDataMap(): void {
    for (let filterItem of this.filters) {
        this.fieldDataMap[filterItem.field] = this.getOptionsForField(filterItem.field);
    }
}
applySavedFilter(){
  const savedFilterState = localStorage.getItem('filterState');
    if (savedFilterState ) {
      //console.log("savedFilterState",savedFilterState);
      this.value = JSON.parse(savedFilterState);
      
      this.filterFn(this.value); // Manually trigger if needed
      this.dataForFilter = this.value;
        this.cdr.detectChanges(); // Manually trigger change detection
      // console.log("this.dataForFilter", this.dataForFilter);
      
      this.sqlQuery= this.convertFilterToSQL(this.dataForFilter)
    this.data.emit(this.sqlQuery)
    }
    const savedRangeString = localStorage.getItem('savedRangeString');
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
      this.fieldDataMap['surveyTitle']= this.surveyTitle;
      this.fieldDataMap['surveyName'] = this.surveyName;
      this.surveyTitleLoaded=true;
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
        fileTrac:["None", "Beginner", "Intermediate", "Advanced"],
        i_Am_Interested_In_The_Following_Assignments:['Claims Supervisor', 'Desk Assignments', 'Field Assignments', 'File Review', 'Underwriting Field Inspections', 'Virtual Adjusting', 'W2 Positions'],
        adjuster_Licenses:['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        isLocked: ["Unlocked","Locked"],
        state:['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        prevetting:["A", "B", "C", "D", "X","PF","Pre-vet field residential", "Pre-vet field commercial", "Pre-vet desk residential","Pre-vet desk commercial","Pre-Vetted Proctor","Vetted Proctor"],
        residential_Property_Desk:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
        residential_Property_Field:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
        userRoleDataCSV:['Adjuster','Adjuster_Lead', 'Admin','Employee','Super Admin'],
        status:['Active','Inactive'],
        userTypeName:['Internal User','External User'],
        xactimate_Estimating:["None", "Beginner", "Intermediate", "Advanced"],
        companyName:this.companyNames,
        goodCandidateFor:this.activeCompanies,
        surveyName:this.surveyName,
        surveyTitle:this.surveyTitle,
        residential_Field_Grade:["A", "B", "C", "D", "X"],
        commercial_Field_Grade:["A", "B", "C", "D", "X"],
        liability_Grade:["A", "B", "C", "D", "X"],
        inspector_Grade:["A", "B", "C", "D", "X"],
        desk_Grade:["A", "B", "C", "D", "X"],
        claims_Supervisor_Grade:["A", "B", "C", "D", "X"],
        file_Review_Grade:["A", "B", "C", "D", "X"],
    };
    return (data as any)[fieldName] || [];
}


isArray(value: any): boolean | null {
  if (value == null) {  // This checks for both null and undefined
    return null;
  }
  return Array.isArray(value);
}
isArrayOptionsEmpty(fieldName: string): boolean {
  const options = this.getOptionsForField(fieldName);
  return options.length === 0;
}


isOperatorEmptyOrNotEmpty(filterValue: FilterDescriptor): boolean {
  return filterValue?.operator === 'isnotnull' || filterValue?.operator === 'isnull';
}
applyFilters(value: CompositeFilterDescriptor) {
  // console.log("filter value befoure apply manual",value);
  
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
    localStorage.removeItem("filterState")
    localStorage.setItem('filterState', JSON.stringify(value));
  
    // console.log("filtered value",value)
    this.sqlQuery= this.convertFilterToSQL(value)
    // console.log("sqlQuery",this.sqlQuery)
    

    this.data.emit(this.sqlQuery);
  } else {
    this.data.emit('');
    this.companyNamevalue.emit('');
    this.surveyTitleValue.emit('');
    this.surveyNameValue.emit('');
    this.operatorValue.emit('AND');
    this.dateForFilter.emit('')
    localStorage.setItem('filterState', JSON.stringify(''));
  }
  if(value){
    value.filters.forEach((filter: any) => {
      if(filter.field === 'lastLogin' || filter.field==='modifiedOn' || filter.field==='claims_Received'){
        if(filter.value){
            filter.value = new Date(filter.value)
          }
     }
   });
  }
 
  this.dataForFilter = value;
  this.cdr.detectChanges()
  // console.log("dataForFilter after apply",this.dataForFilter)
}


 filterFn(event:CompositeFilterDescriptor){
//  console.log("filterFn",event)
  event.filters.forEach(filter=>{
    if ('operator' in filter && filter.operator === "eq" || 'operator' in filter && filter.operator === "neq" ) {
     if(filter.value && typeof filter.value==='object'){
      filter.value = filter.value[0];

     }
    }
  })
  
  this.dataForFilter=event
  // console.log("dataForFilter",this.dataForFilter)
  this.cdr.detectChanges()
 }
 applyfiltersManual() {
  //console.log("dataForFilter", this.dataForFilter);

  let claimsReceivedPresent = false;
  let companyNamePresent = false;
  let surveyNamePresent = false;
  let surveyTitlePresent = false;
  let canApplyFilters = true; // Flag to determine if applyFilters can be called

  // First, check if 'claims_Received' and 'companyName' are in the filters
  if (this.dataForFilter && this.dataForFilter.filters.length > 0) {
    claimsReceivedPresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'claims_Received');
    companyNamePresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'companyName');
    surveyNamePresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'surveyName');
    surveyTitlePresent = this.dataForFilter.filters.some((filter:any) => filter.field === 'surveyTitle');
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
  if(!surveyNamePresent){
    this.surveyNameValue.emit('');
  }
  if(!surveyTitlePresent){
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
  
  this.resetSearchvalue.emit('')
  this.companyNamevalue.emit('')
  this.surveyNameValue.emit('')
  this.operatorValue.emit('AND')
  this.surveyTitleValue.emit('')
  this.value = { logic: 'and', filters: [] };
  this.applyFilters(this.value);
  localStorage.removeItem('filterState');
  localStorage.removeItem('savedRangeString');
  
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
  // debugger
  // console.log("event",event)
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

  if (typeof event === 'string' && typeof currentItem.field === 'string') {
    // If currentItem.field corresponds to a date editor
    if (this.isDateEditor(currentItem.field)) {
      // Convert the string to a Date object and assign it to currentItem.value
      currentItem.value = new Date(event);
    }
  } 
  this.cdr.detectChanges();
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

private isDateEditor(fieldName: string): boolean {
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
  let surveyNameConditions: any[] = [];
  let surveyTitleConditions: any[] = [];

  this.operatorValue.emit(filter.logic === 'and' ? 'AND' : 'OR'); // Emit the top-level logic operator

  let conditions = filter.filters.map((f:any) => {
      if (f.logic) {
          // Handle nested filters with a check to avoid empty conditions
          let nestedCondition = this.convertFilterToSQL(f);
          return nestedCondition ? `(${nestedCondition})` : '';
      } else {
          let sqlOperator = this.convertOperatorToSQL(f.operator);
          if ((f.operator === 'contains' || f.operator === 'doesnotcontain') && Array.isArray(f.value)) {
              let arrayConditions = f.value.map((val:any) => `${f.field} ${sqlOperator} ${this.handleValueForSQL(val, f.operator)}`).join(' AND ');
              if (f.field === 'companyName') {
                  companyNameConditions.push(`(${arrayConditions})`);
              } else if(f.field === 'surveyName'){
                  surveyNameConditions.push(`(${arrayConditions})`);
              } else if(f.field === 'surveyTitle'){
                  surveyTitleConditions.push(`(${arrayConditions})`);
              }
              else {
                  specialConditions.push(`(${arrayConditions})`);
              }
              return ''; // Skip adding to conditions directly
          } else if(f.operator === 'isnull' || f.operator === 'isnotnull'){
            // when operator is isnull or isnotnull then the in the field value could be genrated like this  NULLIF(LTRIM(RTRIM(col)), '')
            let condition = `NULLIF(LTRIM(RTRIM(${f.field})), '') ${sqlOperator}`;
            if (f.field === 'companyName') {
                companyNameConditions.push(condition);
                return ''; // Skip for companyName
            } else if(f.field === 'surveyName'){
                surveyNameConditions.push(condition);
                return '';
            } else if(f.field === 'surveyTitle'){
                surveyTitleConditions.push(condition);
                return '';
            }
            return condition;
          }
          
          
          else {
              let value = this.handleValueForSQL(f.value, f.operator);
              let condition = `${f.field} ${sqlOperator} ${value}`;
              if (f.field === 'companyName') {
                  companyNameConditions.push(condition);
                  return ''; // Skip for companyName
              }else if(f.field === 'surveyName'){
                  surveyNameConditions.push(condition);
                  return '';
              }
              else if(f.field === 'surveyTitle'){
                  surveyTitleConditions.push(condition);
                  return '';
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
  // console.log("surveyNameConditions",surveyNameConditions)
  // console.log("surveyTitleConditions",surveyTitleConditions)
  if(surveyNameConditions.length > 0){
    
    let surveyNameQuery = surveyNameConditions.join(logicOperator);
    this.surveyNameValue.emit(surveyNameQuery);
    conditions.push(`(${surveyNameQuery})`);
  }
  if(surveyTitleConditions.length > 0){
 
    let surveyTitleQuery = surveyTitleConditions.join(logicOperator);
    this.surveyTitleValue.emit(surveyTitleQuery);
    conditions.push(`(${surveyTitleQuery})`);
  }

  // Handle special conditions for other fields
  if (specialConditions.length > 0) {
      let specialQuery = specialConditions.join(logicOperator);
      conditions.push(`(${specialQuery})`); // Group special conditions for other fields
  }

  
  let finalQuery = conditions.join(logicOperator);
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


dateToUS(data :any){
  if(data){
    return moment(data).format('MM-DD-YYYY')
  }
  return ''

}

}

