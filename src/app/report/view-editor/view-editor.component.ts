import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FiledsListModel } from 'src/app/models/user-models';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject, finalize, switchMap, of } from 'rxjs';
import { ReportsService } from 'src/app/services/reports.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { FiltersComponent } from '../filters/filters.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent implements OnInit {
  @ViewChild('viewNameInput') viewNameInput: ElementRef;
  @ViewChild(FiltersComponent) filtersComponent: FiltersComponent;
  
  isCreateView: boolean = true;
  customViewId: number = 0;
  viewName: string = 'Untitled view';
  isEditingViewName: boolean = false;
  originalViewName: string = '';
  // Filter related properties
  filterData: any;
  sqlQuery: string = '';
  companyName: string = '';
  surveyName: string = '';
  surveyTitle: string = '';
  dateFilter: any;
  operator: string = '';
  filterObject: CompositeFilterDescriptor | null = null;
  savedFilterObject: CompositeFilterDescriptor | null = null;
  LoggedUserRoleCheck = Number((localStorage.getItem('LoggedUserRole')));
  
  FiledsList:FiledsListModel[]=[];
  originalUserData$ = new BehaviorSubject<any[]>([]); 
  loggedUserTypeCheck = Number((localStorage.getItem('LoggedUserType')));
   
   // Column selection
  availableColumns: FiledsListModel[] = [];
  selectedColumns: FiledsListModel[] = [];
   
    availableSearchTerm: string = '';
    selectedSearchTerm: string = '';
  
    get filteredAvailableColumns() {
      return this.availableColumns.filter(col => 
      col.keyValue.toLowerCase().includes(this.availableSearchTerm.toLowerCase())
    ).sort((a, b) => a.keyValue! < b.keyValue! ? -1 : 1);
    }
    
    get filteredSelectedColumns() {
      return this.selectedColumns.filter(col => 
      col.keyValue.toLowerCase().includes(this.selectedSearchTerm.toLowerCase())
    );
  }

  // Add this flag to track when view data is fully loaded
  isViewLoaded: boolean = false;
  isViewOnlyMode: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private reportsService: ReportsService, private SpinnerService: NgxSpinnerService, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, private authService: AuthService) {

    localStorage.removeItem('editUser');
    if (this.LoggedUserRoleCheck === 3) {
      this.isViewOnlyMode = true;
      // console.log("this.isViewOnlyMode", this.isViewOnlyMode);
    }

    var obj = this.authService.isUserAllowed(window.location)
    if (this.loggedUserTypeCheck=== 1) {
    }
    else {
      this.router.navigate([obj.allowedPath]);
    }
  }
 
  ngOnInit(): void {
    localStorage.removeItem('filterStateReports');
    // First check if we're editing an existing view by checking for a view ID in the route
    this.activatedRoute.queryParamMap.subscribe( params  => {
      // console.log("params", params);
      if (params.get('id')) {
        this.customViewId = parseInt(params.get('id')!);
        this.isCreateView = false;
        // console.log(`Editing existing view with ID: ${this.customViewId}`);
      } 
      else {
        this.isCreateView = true;
        this.customViewId = 0;
        // console.log('Creating new view');
        // For new views, we can mark as loaded immediately
        this.isViewLoaded = true;
      }


      
      // Modified approach: Chain the API calls to ensure correct order
      this.SpinnerService.show();
      
      // First load field list
      this.reportsService.GetActiveModuleColumns().subscribe({
        next: (res) => {
          if (!res.data) {
            console.error("Error fetching fields list: data is empty");
            this.SpinnerService.hide();
            return;
          }
    
          // Assign the original list for other tasks
          this.FiledsList = res.data;
          this.FiledsList.sort((a, b) => a.keyValue! < b.keyValue! ? -1 : 1);
          
          // Initialize available and selected columns
          // Default columns (selected)
          // console.log("this.selectedColumns", this.selectedColumns);
          
          // Available columns (not selected)
          this.availableColumns = this.FiledsList.filter(field => !field.isDefault);
    
          // Now that fields are loaded, load the existing view if in edit mode
          if (!this.isCreateView && this.customViewId > 0) {
            this.loadExistingView(this.customViewId);
          } else {
            this.isFilterSaved();
            this.SpinnerService.hide();
          }
        },
        error: (error) => {
          console.error("Error fetching fields list:", error);
          this.SpinnerService.hide();
        }
      });
    });
  }
 
 
 
  goBack(){
    this.router.navigate(['/main/report/custom-view']);
  }
  saveView() {
    // Ensure we're not in edit mode when saving
    if (this.filtersComponent) {
      this.filtersComponent.triggerApplyFilters();
    }
    if (this.isEditingViewName) {
      this.toggleEditViewName();
    }
    
    // Validate view name
    if (!this.viewName || this.viewName.trim() === '') {
      this.viewName = 'Untitled view';
    }
    
    // Enforce maximum length
    const maxLength = 100;
    if (this.viewName.length > maxLength) {
      this.viewName = this.viewName.substring(0, maxLength);
    }
    
    // Validation: Check if the view name is empty or default
    if (!this.viewName || this.viewName.trim() === '' || this.viewName === 'Untitled view') {
      Swal.fire({
        title: 'View Name Required',
        text: 'Please provide a name for your view before saving.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022'
      });
      return; // Stop execution if validation fails
    }
    
    // Validation: Check if sqlQuery is empty or null
    if (!this.sqlQuery || this.sqlQuery.trim() === '') {
      Swal.fire({
        title: 'No Filter Criteria',
        text: 'Please specify at least one filter criteria before saving the view.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022'
      });
      return; // Stop execution if validation fails
    }
    
    // Validation: Check if filterObject is properly set
    if (!this.filterObject || !this.filterObject.filters || this.filterObject.filters.length === 0) {
      Swal.fire({
        title: 'Invalid Filter Configuration',
        text: 'The filter configuration appears to be incomplete. Please set up your filters properly.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022',
      });
      return; // Stop execution if validation fails
    }
    
    // Validation: Check if any columns are selected
    if (!this.selectedColumns || this.selectedColumns.length === 0) {
      Swal.fire({
        title: 'No Columns Selected',
        text: 'Please select at least one column to display in your view.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffa022'
      });
      return; // Stop execution if validation fails
    }
    
    // Create filter string - contains all the necessary filter data
    const filterString = JSON.stringify({
      filterObject: this.filterObject,
      sqlQuery: this.sqlQuery,
      companyName: this.companyName,
      surveyName: this.surveyName,
      surveyTitle: this.surveyTitle,
      dateFilter: this.dateFilter,
      operator: this.operator,
      pageNumber: 1, 
      numberOfRecords: 10, 
      searchKey: '',
      searchValue: '',
      sortField: '',
      sortOrder: ''
    });
    
    // Format columns according to API requirement
    const formattedColumns = this.selectedColumns.map(column => ({
      id: 0, // New columns will have ID 0, existing ones would use their actual ID
      keyValue: column.keyValue,
      keyName: column.keyName,
      type: column.type
    }));
    
    // Get current user ID from local storage or appropriate source
    const currentUserId = this.getCurrentUserId();
    // console.log("currentUserId", currentUserId);
    // console.log("this.isCreateView", this.isCreateView);
    
    // Prepare request body according to API format
    const viewData = {
      customViewId: this.isCreateView ? 0 : this.customViewId, // Use 0 for new views, actual ID for updates
      name: this.viewName,
      filter: filterString,
      kendoFilter: JSON.stringify(this.filterObject),
      isAdmin: false, // Set according to your requirements
      isInternal: true, // Set according to your requirements
      createdBy: this.isCreateView ? currentUserId : 0, // Only set for new views
      modifiedBy: currentUserId, // Always set for both creates and updates
      columns: formattedColumns
    };
    
    // console.log('Saving view with data:', viewData);
    
    // Show loading indicator
    this.SpinnerService.show();
    
    // Call the API
    this.reportsService.AddUpdateCustomView(viewData).subscribe(
      (response: any) => {
        // console.log('View saved successfully', response);
        if (response.success === true) {
        this.SpinnerService.hide();
        
        Swal.fire({
          title: 'Success!',
          text: `Your view has been ${this.isCreateView ? 'created' : 'updated'} successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ffa022'
        }).then(() => {
          // Navigate back after user clicks OK
          this.router.navigate(['/main/report/custom-view']);
        });
      }
      else{
        this.SpinnerService.hide();
        Swal.fire({
          title: 'Error',
          text: response.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
      }
      },
      (error: any) => {
        console.error('Error saving view', error);
        this.SpinnerService.hide();
        
        Swal.fire({
          title: 'Error',
          text: `There was an error ${this.isCreateView ? 'creating' : 'updating'} your view. Please try again.`,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
      }
    );
  }
  
  /**
   * Get the current user ID from local storage or appropriate source
   * @returns The current user ID or 0 if not available
   */
  getCurrentUserId(): number {
    // Replace this with your actual logic for getting the current user ID
    debugger
    try {
      const userInfo = localStorage.getItem('LoggeduserId');
      // console.log("userInfo", userInfo);
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        return parsedUser || 0;
      }
    } catch (e) {
      console.error('Error getting current user ID:', e);
    }
    return 0;
  
  }

  
   addColumn(column: FiledsListModel) {
      // Remove from available and add to selected
    this.availableColumns = this.availableColumns.filter(c => c.keyValue !== column.keyValue);
    
    // Set isDefault to true for selected columns
    column.isDefault = true;
      this.selectedColumns.push(column);
    }
  
  removeColumn(column: FiledsListModel) {
      // Remove from selected and add to available
    this.selectedColumns = this.selectedColumns.filter(c => c.keyValue !== column.keyValue);
    
    // Set isDefault to false for available columns
    column.isDefault = false;
      this.availableColumns.push(column);
      
      // Sort available columns alphabetically
    this.availableColumns.sort((a, b) => a.keyValue.localeCompare(b.keyValue));
  }
  
  /**
   * Handles the drop event when a column is reordered in the selected columns list
   * @param event The drag and drop event
   */
  onColumnDrop(event: CdkDragDrop<FiledsListModel[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.selectedColumns, event.previousIndex, event.currentIndex);
      // console.log('Columns reordered:', this.selectedColumns);
    }
  }
  
  // Filter event handlers
  updateFilterData(event: any) {
    this.filterData = event;
    this.sqlQuery = event;
    // console.log('Filter data updated:', this.filterData);
  }

  getOperator(event: any) {
    // console.log('Operator value:', event);
    this.operator = event;
  }

  getCompanyName(event: any) {
    this.companyName = event;
    // console.log('Company name:', this.companyName);
  }

  getSurveyName(event: any) {
    this.surveyName = event;
    // console.log('Survey name:', this.surveyName);
  }

  getSurveyTitle(event: any) {
    this.surveyTitle = event;
    // console.log('Survey title:', this.surveyTitle);
  }

  getDateforFilter(event: any) {
    this.dateFilter = event;
    // console.log('Date filter:', this.dateFilter);
  }
  getFilterObject(event: any) {
    this.filterObject = event;
    // console.log('Filter object:', this.filterObject);
  }

  resetSearchvalueinReports(event: any) {
    // console.log('Reset search value:', event);
    // Reset filter related properties if needed
    if (event) {
      this.filterData = null;
      this.sqlQuery = '';
      this.companyName = '';
      this.surveyName = '';
      this.surveyTitle = '';
      this.dateFilter = null;
      this.filterObject = null;
      localStorage.removeItem('filterStateReports');
    }
  }

  // The GetFiledsList method is no longer used as its functionality is incorporated into ngOnInit
  GetFiledsList() {
    // This method is kept for reference but is now unused
    // console.log("GetFiledsList method is deprecated - functionality moved to ngOnInit");
  }

  /**
   * Returns a truncated version of the view name if it exceeds the character limit
   */
  getTruncatedViewName(): string {
    const maxLength = 30;
    if (this.viewName.length <= maxLength) {
      return this.viewName;
    }
    return this.viewName.substring(0, maxLength) + '...';
  }
  
  /**
   * Toggle the edit mode for the view name
   */
  toggleEditViewName() {
    this.isEditingViewName = !this.isEditingViewName;
    
    if (this.isEditingViewName) {
      // Store the original name in case user cancels
      this.originalViewName = this.viewName;
      if(this.viewName === 'Untitled view'){
        this.viewName = '';
      }
      
      // Focus the input field after it's rendered
      setTimeout(() => {
        if (this.viewNameInput) {
          this.viewNameInput.nativeElement.focus();
          
          // Place cursor at the end of the text
          const length = this.viewNameInput.nativeElement.value.length;
          this.viewNameInput.nativeElement.setSelectionRange(length, length);
        }
      });
    } else {
      // If we're exiting edit mode and the view name is empty, set a default name
      if (!this.viewName || this.viewName.trim() === '') {
        this.viewName = 'Untitled view';
      }
      
      // Enforce maximum length
      const maxLength = 100;
      if (this.viewName.length > maxLength) {
        this.viewName = this.viewName.substring(0, maxLength);
      }
      
      // Trigger the apply filters functionality when exiting edit mode
      
    }
  }
  
  /**
   * Cancel editing the view name and restore the original value
   */
  cancelEditViewName() {
    this.viewName = this.originalViewName;
    this.isEditingViewName = false;
  }

  /**
   * Loads an existing view by its ID
   * @param viewId The ID of the view to load
   */
  loadExistingView(viewId: number) {
    this.SpinnerService.show();
    
    this.reportsService.GetCustomView(viewId).subscribe(
      (response: any) => {
        if (!response) {
          console.error('Error loading view: No data received');
          this.SpinnerService.hide();
          this.handleViewLoadError();
          return;
        }
        
        const viewData = response;
        // console.log('Loaded view data:', viewData);
        
        // Set basic view properties
        this.customViewId = viewData.customViewId;
        this.viewName = viewData.name;
        
      
        
        // Parse filter data
        try {
          if (viewData.filter) {
            const filterData = JSON.parse(viewData.filter);
            this.sqlQuery = filterData.sqlQuery || '';
            this.companyName = filterData.companyName || '';
            this.surveyName = filterData.surveyName || '';
            this.surveyTitle = filterData.surveyTitle || '';
            this.dateFilter = filterData.dateFilter || null;
            this.operator = filterData.operator || '';
          }
          
          if (viewData.kendoFilter) {
            try {
              this.savedFilterObject = JSON.parse(viewData.kendoFilter);
              // console.log("Parsed Kendo filter:", this.savedFilterObject);
            } catch (e) {
              console.error('Error parsing Kendo filter:', e);
            }
          }
        } catch (e) {
          console.error('Error parsing filter data:', e);
        }

        // Process columns
        if (viewData.columns && Array.isArray(viewData.columns) && viewData.columns.length > 0) {
          this.processColumns(viewData.columns);
        }
        
        // Mark view as loaded - IMPORTANT: This should come AFTER all data is processed
        // so the app-filters component gets the correct initial state
        this.isViewLoaded = true;
        
        // Force change detection to apply the changes
        this.cdr.detectChanges();
        
        this.SpinnerService.hide();
      },
      (error: any) => {
        console.error('Error loading view:', error);
        this.SpinnerService.hide();
        this.handleViewLoadError();
      }
    );
  }
  
  /**
   * Process columns from loaded view
   * @param columns The columns from the loaded view
   */
  processColumns(columns: any[]) {
    // First reset our selections to ensure clean state
    this.selectedColumns = [];
    
    // Process each column from the view
    columns.forEach(viewColumn => {
      // Find the matching column in our FiledsList
      const matchingField = this.FiledsList.find(field => 
        field.keyValue === viewColumn.keyValue
      );
      
      if (matchingField) {
        // Mark as selected and add to selected columns
       
        this.selectedColumns.push(matchingField);
        
        // Remove from available columns
        this.availableColumns = this.availableColumns.filter(col => 
          col.keyValue !== matchingField.keyValue
        );
      }
    });

    //add columns that are avalable in FiledsList but not in viewColumns
    const missingColumns = this.FiledsList.filter(col => 
      !columns.some(viewColumn => viewColumn.keyValue === col.keyValue)
    );
    
    // console.log("missingColumns",missingColumns)
    this.availableColumns = missingColumns;
    
    // Sort only available columns - preserve the order of selected columns
    this.availableColumns.sort((a, b) => a.keyName.localeCompare(b.keyName));
    
    // No need to sort selected columns - they are already in the order from the database
    // this.selectedColumns.sort((a, b) => a.keyName.localeCompare(b.keyName));
  }
  
  /**
   * Handle error when loading a view
   */
  handleViewLoadError() {
    Swal.fire({
      title: 'Error',
      text: 'Could not load the requested view. Please try again or create a new view.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545'
    }).then(() => {
      // Navigate back to views list
      this.router.navigate(['/main/report/custom-view']);
    });
  }
  
  /**
   * Check if there's a saved filter state in local storage
   */
  isFilterSaved() {
    const savedFilterState = localStorage.getItem('filterStateReports');
    if (savedFilterState) {
      this.filterObject = JSON.parse(savedFilterState);
      // console.log("filterObject", this.filterObject);
    }
  }

  /**
   * Get the page title based on whether we're creating or editing a view
   */
  getPageTitle(): string {
    return this.isCreateView ? 'Create Custom View' : 'Edit Custom View';
  }
  
  /**
   * Set document title based on create/edit mode
   */

}
