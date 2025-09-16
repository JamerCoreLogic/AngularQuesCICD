import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterExpression } from '@progress/kendo-angular-filter';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FileTracService } from 'src/app/services/file-trac.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taskfilter',
  templateUrl: './taskfilter.component.html',
  styleUrls: ['./taskfilter.component.scss']
})
export class TaskfilterComponent implements OnInit {
  @Input() filteredData$= new Observable<any[]>
  @Input() isPending: boolean = true;
  @Output() data =new EventEmitter<any>;
  @Output() resetSearchvalue =new EventEmitter<any>;
  @Output() operatorValue = new EventEmitter<any>();
  public filters: FilterExpression[] = [
      { field: 'name', title: 'Name', editor: 'string', operators: ['eq','contains'] },
      { field: 'mobile', title: 'Phone', editor: 'string', operators: ['eq','contains'] },
      { field: 'emailAddress', title: 'Email', editor: 'string', operators: ['eq','contains'] },
      { field: 'backgroundCheckStatus', title: 'Background Check Status', editor: 'string', operators: ['eq','contains'] },
      { field: 'deskAdjusterContract', title: 'Desk Adjuster Contract ', editor: 'string', operators: ['eq','contains'] },
      { field: 'adminContract', title: 'Admin Contract ', editor: 'string', operators: ['eq','contains'] },
      { field: 'payrollStatus', title: 'Payroll Status ', editor: 'string', operators: ['eq','contains'] },
      { field: 'supervisorContract', title: 'Supervisor Contract  ', editor: 'string', operators: ['eq','contains'] },
      { field: 'fieldAdjusterContract', title: 'Field Adjuster Contract', editor: 'string', operators: ['eq','contains'] },
  ];
  public value: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
  dataForFilter:any
  originalUserData: any[] = []
  public fieldDataMap: { [key: string]: string[] } = {};
  multiselect:any
  public range: {
    start: Date | null,
    end: Date | null
  } = {
    start: null,
    end: null
  };
  sqlQuery: any;
  isDefaultFilterApplied = true; // Track if current filters match default
  defaultFilter: CompositeFilterDescriptor = {
    logic: 'or',
    filters: []
  };

isSameFilter(a: CompositeFilterDescriptor, b: CompositeFilterDescriptor): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
  constructor(private fileTracService:FileTracService,private cdr: ChangeDetectorRef,private authService:AuthService) { }

  ngOnInit(): void {
    this.applySavedFilter();
    this.initializeFieldDataMap();
    this.sortFilterlist();
    this.setDefaultFilter();
  }
 
private initializeFieldDataMap(): void {
    for (let filterItem of this.filters) {
        this.fieldDataMap[filterItem.field] = this.getOptionsForField(filterItem.field);
    }
}

setDefaultFilter(){
  if(this.isPending){
    this.defaultFilter = {
      logic: 'or',
      filters: [
        { field: 'fieldAdjusterContract', operator: 'eq', value: 'Requested' },
        { field: 'fieldAdjusterContract', operator: 'eq', value: 'Requested Update' },
        { field: 'deskAdjusterContract', operator: 'eq', value: 'Requested' },
        { field: 'deskAdjusterContract', operator: 'eq', value: 'Requested Update' },
        { field: 'supervisorContract', operator: 'eq', value: 'Requested' },
        { field: 'supervisorContract', operator: 'eq', value: 'Requested Update' },
        { field: 'adminContract', operator: 'eq', value: 'Requested' },
        { field: 'adminContract', operator: 'eq', value: 'Requested Update' },
        { field: 'backgroundCheckStatus', operator: 'eq', value: 'Requested' },
      ]
    }
  }else{
    // field is Expired and all others are None / Completed / Completed Update.
    this.defaultFilter = {
      logic: 'or',
      filters: [
        { field: 'fieldAdjusterContract', operator: 'eq', value: 'Expired' },
        { field: 'deskAdjusterContract', operator: 'eq', value: 'Expired' },
        { field: 'supervisorContract', operator: 'eq', value: 'Expired' },
        { field: 'adminContract', operator: 'eq', value: 'Expired' },
        { field: 'backgroundCheckStatus', operator: 'eq', value: 'Expired' },
      
      ]
    }
  
  }
  this.value = this.defaultFilter;
  this.initializeFieldDataMap()
  this.applyFilters(this.value);
  this.cdr.detectChanges()
}


applySavedFilter() {
  const savedFilterState = localStorage.getItem('taskfilterState');

  if (savedFilterState) {
    this.value = JSON.parse(savedFilterState);
  } else {
    this.value = this.defaultFilter;
    localStorage.setItem('taskfilterState', JSON.stringify(this.value));
  }

  this.isDefaultFilterApplied = this.isSameFilter(this.value, this.defaultFilter);

  this.filterFn(this.value);
  this.dataForFilter = this.value;
  this.sqlQuery = this.convertFilterToSQL(this.dataForFilter);
  this.data.emit(this.sqlQuery);
  this.cdr.detectChanges();
}

sortFilterlist(): void {
  this.filters.sort((a, b) => a.title! < b.title! ? -1 : 1);
}
  getOptionsForField(fieldName: string): string[] {
    if (this.isPending){
      const data = {
        backgroundCheckStatus : ["Requested"],
        fieldAdjusterContract : ["Requested", "Requested Update"],
        deskAdjusterContract : [ "Requested", "Requested Update"],
        adminContract : [ "Requested", "Requested Update"],
        supervisorContract : [ "Requested", "Requested Update"],
        payrollStatus : ["Inactive", "Active", "Upwork"]
      };
      return (data as any)[fieldName] || [];
    }
    else{
      const data = {
        backgroundCheckStatus : ["Expired"],
        fieldAdjusterContract : ["Expired"],
        deskAdjusterContract : ["Expired"],
        adminContract : ["Expired"],
        supervisorContract : ["Expired"],
      };
      return (data as any)[fieldName] || [];
    }
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
  debugger
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
    localStorage.removeItem("taskfilterState")
    localStorage.setItem('taskfilterState', JSON.stringify(value));
  
    // console.log("filtered value",value)
    this.sqlQuery= this.convertFilterToSQL(value)
    // console.log("sqlQuery",this.sqlQuery)
    

    this.data.emit(this.sqlQuery);
  } else {
    this.data.emit('');
    this.operatorValue.emit('AND');
    localStorage.setItem('taskfilterState', JSON.stringify(''));
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
  let canApplyFilters = true; // Flag to determine if applyFilters can be called
  if (canApplyFilters) {
    this.applyFilters(this.dataForFilter);
    this.isDefaultFilterApplied = this.isSameFilter(this.dataForFilter, this.defaultFilter);
  }

  // First, check if 'claims_Received' and 'companyName' are in the filters
  if (this.dataForFilter && this.dataForFilter.filters.length > 0) {
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
    this.operatorValue.emit('AND');
    this.value = { logic: 'and', filters: [] };
  }
}



initializeValue(): void {
  this.resetSearchvalue.emit('');
  this.operatorValue.emit('AND');
  this.value = { ...this.defaultFilter }; // Ensure a new object is created
  this.applyFilters(this.value);
  localStorage.removeItem('taskfilterState');
  localStorage.removeItem('savedRangeString');
  this.isDefaultFilterApplied = true;
  this.cdr.detectChanges(); // Trigger change detection to update the UI immediately
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
  debugger
  if (!filter.filters || filter.filters.length === 0) return '';

  let specialConditions:any = []; // For fields with 'contains' or 'doesnotcontain'
  // let companyNameConditions:any = []; // Specifically for companyName
  // let surveyNameConditions: any[] = [];
  // let surveyTitleConditions: any[] = [];

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
             
              return arrayConditions;
          } else if(f.operator === 'isnull' || f.operator === 'isnotnull'){
            // when operator is isnull or isnotnull then the in the field value could be genrated like this  NULLIF(LTRIM(RTRIM(col)), '')
            let condition = `NULLIF(LTRIM(RTRIM(${f.field})), '') ${sqlOperator}`;
            return condition;
          }
          
          
          else {
              let value = this.handleValueForSQL(f.value, f.operator);
              let condition = `${f.field} ${sqlOperator} ${value}`;
              // if (f.field === 'companyName') {
              //     companyNameConditions.push(condition);
              //     return ''; // Skip for companyName
              // }else if(f.field === 'surveyName'){
              //     surveyNameConditions.push(condition);
              //     return '';
              // }
              // else if(f.field === 'surveyTitle'){
              //     surveyTitleConditions.push(condition);
              //     return '';
              // }
              
               if (f.operator === 'contains' || f.operator === 'doesnotcontain') {
                  specialConditions.push(condition);
                  return ''; // Skip for these operators
              }
              return condition;
          }
      }
  }).filter((condition:any) => condition !== ''); // Remove empty strings
  let logicOperator = filter.logic === 'and' ? ' AND ' : ' OR ';
  // Adjusting companyNameConditions joining based on top-level logic
  // if (companyNameConditions.length > 0) {
     
  //     let companyNameQuery = companyNameConditions.join(logicOperator);
  //     this.companyNamevalue.emit(companyNameQuery); // Emit using the appropriate mechanism
  //     conditions.push(`(${companyNameQuery})`); // Group companyName conditions with correct logic
  // }
  // console.log("surveyNameConditions",surveyNameConditions)
  // console.log("surveyTitleConditions",surveyTitleConditions)
  // if(surveyNameConditions.length > 0){
    
  //   let surveyNameQuery = surveyNameConditions.join(logicOperator);
  //   this.surveyNameValue.emit(surveyNameQuery);
  //   conditions.push(`(${surveyNameQuery})`);
  // }
  // if(surveyTitleConditions.length > 0){
 
  //   let surveyTitleQuery = surveyTitleConditions.join(logicOperator);
  //   this.surveyTitleValue.emit(surveyTitleQuery);
  //   conditions.push(`(${surveyTitleQuery})`);
  // }

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


}
