import { Component, OnInit,Input,Output,EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FilterExpression} from '@progress/kendo-angular-filter';
import { CompositeFilterDescriptor, FilterDescriptor, FilterOperator, filterBy } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { FileTracService } from 'src/app/services/file-trac.service';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent implements OnInit {

  @Input() filteredData:any;
  @Output() data =new EventEmitter<any>;
  public filters: FilterExpression[] = [
    { field: 'companyName', title: 'Client Company', editor: 'string', operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'totalNumberOfClaims', title: 'Total Number Of Claims', editor: 'number', operators: ['eq','neq','gt','lt','lte' ,'gte','isnull','isnotnull'] },
    { field: 'claims_Received', title: 'Claim Date Received', editor: 'date', operators: ['gt','lt','lte' ,'gte'] },
    { field: 'what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned', title: 'Assignment Preference', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'clickClaims', title: 'Click Claims', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'casualty', title: 'Casualty', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'commercial_Property_Desk', title: 'Commercial Property Desk', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'commercial_Property_Field', title: 'Commercial Property Field', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'fileTrac', title: 'FileTrac', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'], },
    { field: 'i_Am_Interested_In_The_Following_Assignments', title: 'I’m Interested in', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'modifiedOn', title: 'Last Activity', editor: 'date', operators: ['gt','lt','lte' ,'gte'] },
    { field: 'lastLogin', title: 'Last Login', editor: 'date', operators: ['gt','lt','lte' ,'gte'] },
    { field: 'adjuster_Licenses', title: 'Licensed States', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'city', title: 'Mailing City', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'state', title: 'Mailing State', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'status', title: 'Status', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull'] },
    { field: 'userTypeName', title: 'User Type', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'prevetting', title: 'Prevetting', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'residential_Property_Desk', title: 'Residential Property Desk', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'residential_Property_Field', title: 'Residential Property Field', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
    { field: 'xactimate_Estimating', title: 'Xactimate Estimating', editor: 'string',operators: ['eq','neq','contains','doesnotcontain','isnull','isnotnull']},
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
    filters: []
  };
  originalUserData: any[] = []
  dataForFilter:any
  public fieldDataMap: { [key: string]: string[] } = {};
  sqlQuery: any;
  private savedFilterState: CompositeFilterDescriptor | null = null;

  companyNamesLoaded: boolean=false;
  surveyTitleLoaded: boolean=false;
  activeCompaniesLoaded: boolean=false;
  companyNames: string[]=[]
  activeCompanies: string[]=[]
  surveyTitle: string[]=[]
  surveyName: string[]=[]
  public range: {
    start: Date | null,
    end: Date | null
  } = {
    start: null,
    end: null
  };
  companyName: any;
  

  constructor(private sharedAS:SharedAdjusterService ,private fileTracService:FileTracService,private cdr: ChangeDetectorRef,private authService:AuthService) { }

  ngOnInit(): void {
    this.originalUserData=this.filteredData;
    this.applySavedFilter()
    //console.log("originalUserData in init",this.filteredData)
    this.sortFilterList()
    this.initializeFieldDataMap();
    this.getListOfCompanyName()
    this.getFileTracActiveCompanies()
    this.getGetSurveyTitleList()
  }

  
  applySavedFilter(){
    const savedFilterState = localStorage.getItem('filterStateFind');
      if (savedFilterState ) {
        //console.log("savedFilterState",savedFilterState);
        this.value = JSON.parse(savedFilterState);
        this.dataForFilter = this.value;
        // console.log("this.dataForFilter", this.dataForFilter);
        
        this.sqlQuery= this.convertFilterToSQL(this.dataForFilter)
      this.data.emit(this.sqlQuery)
      this.sharedAS.isFilterApplyed(true)
      }
      else{
        this.sharedAS.isFilterApplyed(false)
      }
     
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredData'] && changes['filteredData'].currentValue !== changes['filteredData'].previousValue) {
      this.originalUserData = [...changes['filteredData'].currentValue];
      //console.log("originalUserData in init",this.originalUserData)
      // You might also want to call other initialization methods here, like sortFilterList() and initializeFieldDataMap()
    }
  }
  sortFilterList(){
    this.filters.sort((a, b) => {
      if (a.title! < b.title!) return -1;
      if (a.title! > b.title!) return 1;
      return 0;
  });
  }
  private initializeFieldDataMap(): void {
    for (let filterItem of this.filters) {
        this.fieldDataMap[filterItem.field] = this.getOptionsForField(filterItem.field);
    }
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
        state:['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
        prevetting:["A", "B", "C", "D", "X","PF","Pre-vet field residential", "Pre-vet field commercial", "Pre-vet desk residential","Pre-vet desk commercial","Pre-Vetted Proctor","Vetted Proctor"],
        residential_Property_Desk:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
        residential_Property_Field:['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'],
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
isArrayOptionsEmpty(fieldName: string): boolean {
  const options = this.getOptionsForField(fieldName);
  return options.length === 0;
}
getListOfCompanyName(){
  this.fileTracService.GetListOfCompanyName().subscribe({
    next: (item: any) => {
      if(item && item.data){
        this.companyNames = item.data;
      }
      this.fieldDataMap['companyName'] = this.companyNames;
      this.companyNamesLoaded = true;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Error loading company names:', err);
      this.companyNames = [];
      this.companyNamesLoaded = false;
      this.cdr.detectChanges();
    }
  });
}
getFileTracActiveCompanies(){
  this.authService.getClients().subscribe({
    next: (item: any) => {
      if(item.success && item.data){
        this.activeCompanies = item.data.map((client: any) => 
          client.fName
        );
      }
      this.fieldDataMap['goodCandidateFor'] = this.activeCompanies.sort((a: any, b: any) => a.localeCompare(b));
      this.activeCompaniesLoaded = true;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Error loading active companies:', err);
      this.activeCompanies = [];
      this.activeCompaniesLoaded = false;
      this.cdr.detectChanges();
    }
  });
}
getGetSurveyTitleList(){
  this.fileTracService.GetSurveyTitleList().subscribe({
    next: (item: any) => {
      if(item && item.data){
        this.surveyTitle = item.data['titles'];
        this.surveyName = item.data['surveyName'];
        this.fieldDataMap['surveyTitle'] = this.surveyTitle;
        this.fieldDataMap['surveyName'] = this.surveyName;
        this.surveyTitleLoaded = true;
      }
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Error loading survey titles:', err);
      this.surveyTitle = [];
      this.surveyName = [];
      this.surveyTitleLoaded = false;
      this.cdr.detectChanges();
    }
  });
}

isOperatorEmptyOrNotEmpty(filterValue: FilterDescriptor): boolean {
  return filterValue?.operator === 'isnull' || filterValue?.operator === 'isnotnull';
}


applyFilters(value: CompositeFilterDescriptor) {
  if (value) {
    value.filters.forEach((filter: any) => {
      if(filter.field === 'lastLogin' || filter.field==='modifiedOn' || filter.field==='claims_Received'){
        if (filter.value){
          const formattedDate = moment(filter.value).format('MM-DD-YYYY');
          filter.value = formattedDate;
        }
        
      }
   });



    // Apply custom filtering logic for multiselect fields
    // console.log("filter value ",value);
    
    localStorage.setItem('filterStateFind', JSON.stringify(value));
    this.sqlQuery= this.convertFilterToSQL(value)
    // console.log("sqlQuery",this.sqlQuery)
    this.sharedAS.setFilter(this.sqlQuery)
    this.sharedAS.isFilterApplyed(true)
    this.data.emit( this.sqlQuery);
  } else {
    this.data.emit('');
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
}





  
  initializeValue() {
    this.value={
      logic:'and',
      filters:[]
    }
    this.applyFilters(this.value)
    localStorage.removeItem('filterStateFind');
    // localStorage.removeItem('savedRangeStringFind');
    this.range.start=null;
    this.range.end=null;
    this.data.emit("");
    this.dataForFilter=this.value
    this.sharedAS.isFilterApplyed(false)
    // this.sharedAS.setDateForFilter("")
    this.sharedAS.setcompanyNamevalue("")
    this.sharedAS.setSurveyName("")
    this.sharedAS.setSurveyTitle("")
    
  }


  public filterFn(event:CompositeFilterDescriptor){
    // console.log("**event filter**",event);
    event.filters.forEach(filter=>{
      if ('operator' in filter && filter.operator === "eq" || 'operator' in filter && filter.operator === "neq" ) {
       if(filter.value && typeof filter.value==='object'){
        filter.value = filter.value[0];
  
       }
      }
    })
    this.dataForFilter=event
   }


applyfiltersManual() {
  // console.log("dataForFilter", this.dataForFilter);

  let claimsReceivedPresent = false;
  let companyNamePresent = false;
  let surveyTitlePresent = false;
  let surveyNamePresent = false;
  let canApplyFilters = true; 

  // First, check if 'claims_Received' is in the filters
  if (this.dataForFilter && this.dataForFilter.filters.length > 0) {
    claimsReceivedPresent = this.dataForFilter.filters.some((filter: any) => filter.field === 'claims_Received');
    companyNamePresent = this.dataForFilter.filters.some((filter: any) => filter.field === 'companyName');
    surveyTitlePresent = this.dataForFilter.filters.some((filter: any) => filter.field === 'surveyTitle');
    surveyNamePresent = this.dataForFilter.filters.some((filter: any) => filter.field === 'surveyName');
  
  }

 
  if(!companyNamePresent){
    this.sharedAS.setcompanyNamevalue('')
  }
  if(!surveyTitlePresent){
    this.sharedAS.setSurveyTitle('')
  }
  if(!surveyNamePresent){
    this.sharedAS.setSurveyName('')
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
  }else {
    this.data.emit("");
    this.sharedAS.setcompanyNamevalue('')
    this.sharedAS.setSurveyTitle('')
    this.sharedAS.setSurveyName('')
    // this.sharedAS.setDateForFilter("")
    this.sharedAS.setFilter('')
    this.value = { logic: 'and', filters: [] };
    this.dataForFilter = this.value;
  }
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
  
    if (typeof event === 'string' && typeof currentItem.field === 'string') {
      // If currentItem.field corresponds to a date editor
      if (this.isDateEditor(currentItem.field)) {
        // Convert the string to a Date object and assign it to currentItem.value
        currentItem.value = new Date(event);
      }
    } 
  
    // console.log("Final currentItem.value:", currentItem.value);
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
  isArray(value: any): boolean | null {
    if (value == null) {  // This checks for both null and undefined
      return null;
    }
    return Array.isArray(value);
  }


  getDateValue(currentItem: any) {
    if (currentItem.value instanceof Date && !isNaN(currentItem.value.getDate())) {
      return currentItem.value; // return as it is, if it's a valid date
    }
    return null; // return null if it's not a valid date
  }


  convertFilterToSQL(filter:any) {
    // console.log("filter",filter)
    if (!filter.filters || filter.filters.length === 0) return '';

    let conditions = [];
    let fieldConditions:any = {}; // Object to hold conditions by field
    let companyNameConditions:any = []; // Specifically for companyName
    let surveyTitleConditions:any = []; // Specifically for surveyTitle
    let surveyNameConditions:any = []; // Specifically for surveyName
    this.sharedAS.setOperator(filter.logic);

    filter.filters.forEach((f:any) => {
        if (f.logic) {
            // Handle nested filters
            
            let nestedCondition = this.convertFilterToSQL(f);
            if (nestedCondition) conditions.push(`(${nestedCondition})`);
        } else {
            let sqlOperator = this.convertOperatorToSQL(f.operator);
            
            // Handle isnull/isnotnull operators with NULLIF function
            if (f.operator === 'isnull' || f.operator === 'isnotnull') {
                let condition = `NULLIF(LTRIM(RTRIM(${f.field})), '') ${sqlOperator}`;
                
                if (f.field === 'companyName') {
                    companyNameConditions.push(condition);
                } else if (f.field === 'surveyTitle') {
                    surveyTitleConditions.push(condition);
                } else if (f.field === 'surveyName') {
                    surveyNameConditions.push(condition);
                } else {
                    if (!fieldConditions[f.field]) {
                        fieldConditions[f.field] = [];
                    }
                    fieldConditions[f.field].push(condition);
                }
            } else {
                let conditionParts;
                if (Array.isArray(f.value)) {
                    conditionParts = f.value.map((val:any) => `${f.field} ${sqlOperator} ${this.handleValueForSQL(val, f.operator)}`);
                } else {
                    conditionParts = [`${f.field} ${sqlOperator} ${this.handleValueForSQL(f.value, f.operator)}`];
                }
                let fieldLogic = (f.operator === 'contains' || f.operator === 'doesnotcontain') ? ' AND ' : ' OR '; // Adjust logical operator for array values

                if (f.field === 'companyName') {
                    companyNameConditions.push(`(${conditionParts.join(fieldLogic)})`);
                } else if (f.field === 'surveyTitle') {
                    surveyTitleConditions.push(`(${conditionParts.join(fieldLogic)})`);
                } else if (f.field === 'surveyName') {
                    surveyNameConditions.push(`(${conditionParts.join(fieldLogic)})`);
                }
                else {
                    if (!fieldConditions[f.field]) {
                        fieldConditions[f.field] = [];
                    }
                    fieldConditions[f.field].push(`(${conditionParts.join(fieldLogic)})`);
                }
            }
        }
    });
    // console.log("survey name convert", surveyNameConditions)
    // console.log("survey title convert", surveyTitleConditions)

    // Special handling for companyName
    if (companyNameConditions.length > 0) {
        let companyNameQuery = companyNameConditions.join(filter.logic === 'and' ? ' AND ' : ' OR ');
        this.sharedAS.setcompanyNamevalue(companyNameQuery); // Emit using the appropriate mechanism
        conditions.push(`(${companyNameQuery})`);
    }

    // Special handling for surveyTitle
    if (surveyTitleConditions.length > 0) {
        let surveyTitleQuery = surveyTitleConditions.join(filter.logic === 'and' ? ' AND ' : ' OR ');
        this.sharedAS.setSurveyTitle(surveyTitleQuery); // Emit using the appropriate mechanism
        conditions.push(`(${surveyTitleQuery})`);
    }
    if (surveyNameConditions.length>0){
      let surveyNameQuery= surveyNameConditions.join(filter.logic==='and'? ' AND ':' OR ');
      this.sharedAS.setSurveyName(surveyNameQuery);
      conditions.push(`(${surveyNameQuery})`);
    }

    // Combine conditions for each field based on the filter logic ('and' or 'or')
    Object.keys(fieldConditions).forEach(field => {
        if (fieldConditions[field].length > 1) {
            let groupLogic = filter.logic === 'and' ? ' AND ' : ' OR ';
            conditions.push(`(${fieldConditions[field].join(groupLogic)})`);
        } else {
            conditions.push(fieldConditions[field][0]);
        }
    });

    let logicOperator = filter.logic === 'and' ? ' AND ' : ' OR ';
    return conditions.join(logicOperator);
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


}