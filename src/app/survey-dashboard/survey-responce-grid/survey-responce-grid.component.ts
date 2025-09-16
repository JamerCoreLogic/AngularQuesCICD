import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { CompositeFilterDescriptor, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { AiApiService } from 'src/app/services/ai-api.service';
import { ColumnMenuSettings, FilterService, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { NgxSpinnerService } from 'ngx-spinner';
import { fileExcelIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { MatDialog } from '@angular/material/dialog';
import { CustomViewDialogComponent, CustomViewDialogData, CustomViewResult } from '../custom-view-dialog/custom-view-dialog.component';
import Swal from 'sweetalert2';
import { MatMenu } from '@angular/material/menu';

export interface GridStateColumn {
  field: string;
  isVisible: boolean;
}

export interface GridState {
  id: number;
  surveyId: number;
  name: string;
  columns: GridStateColumn[];
  filters: string;
  createdDate?: Date;
}

@Component({
  selector: 'app-survey-responce-grid',
  templateUrl: './survey-responce-grid.component.html',
  styleUrls: ['./survey-responce-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyResponceGridComponent implements OnInit, AfterViewInit, OnDestroy {
  // Data and UI properties
  responseTitle: string = '';
  surveyID: number = 0;
  dynamicColumns: any[] = [];
  allColumns: any[] = [];
  gridData: GridDataResult = { data: [], total: 0 };
  originalData: any[] = [];
  loading = true;
  // Paging: default 100 and options in steps of 100 up to 1000
  pageSize = 100;
  pageSizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  buttonCount = 5;
  info = true;
  previousNext = true;
  skip = 0;
  filter: CompositeFilterDescriptor = { logic: "and", filters: [] };
  selectedFilters: { [key: string]: any[] } = {};
  FiledsList: any[] = [];
  allFields: string[] = [];
  toppings = new FormControl<string[]>([]);
  loggedUserTypeCheck = Number((localStorage.getItem('LoggedUserType')));
  loggedUserRoleCheck = Number((localStorage.getItem('LoggedUserRole')));

  // Grid state management
  savedGridStates: GridState[] = [];
  showSaveDialog = false;
  newStateName = '';
  selectedView: GridState | null = null;
  hasGridChanges: boolean = false;
  // Ordered list of currently visible column fields
  columnOrder: string[] = [];
  // Non-removable default fields
  private readonly REQUIRED_FIELDS: string[] = ['InspectionName','Name','Submitted_On'];

  @ViewChild(GridComponent) public grid: GridComponent;
  @ViewChild('savedViewsMenu') public savedViewsMenu: MatMenu;
  public menuSettings: ColumnMenuSettings = {
    view: "tabbed",
    lock: true,
    stick: true,
    setColumnPosition: { expanded: true },
    autoSizeColumn: true,
    autoSizeAllColumns: true,
  };
  public fileExcelIcon: SVGIcon = fileExcelIcon;

  private onDestroy$ = new Subject<void>();
  private distinctCache: { [field: string]: any[] } = {};
  private filterCache: { [key: string]: any[] } = {};
  // Precomputed distinct values for filter menus, keyed by field
  distinctValues: { [field: string]: any[] } = {};
  // Per-field filtered view of distinct values for the MultiSelect search box
  filteredDistinctValues: { [field: string]: any[] } = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private AIService: AiApiService,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ////////////////
  // Data Fetching & Initialization
  ////////////////

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.surveyID = Number(params.id);
      this.responseTitle = params.title;
      this.hasGridChanges = false;
      this.fetchSurveyResponse();
    });
  }

  ngAfterViewInit(): void {
    this.fitColumns();
  }

  fetchSurveyResponse(): void {
    this.spinner.show();
    this.loading = true;
    this.AIService.getServeyResponse(this.surveyID)
      .pipe(
        catchError((error: any) => {
          console.error("Error fetching survey response", error);
          this.loading = false;
          this.spinner.hide();
          this.cdr.markForCheck();
          return [];
        })
      )
      .subscribe((response: any) => {
        this.spinner.hide();
        this.loading = false;
        if (response && response.data && response.data.length > 0) {
          const keys = Object.keys(response.data[0]);
          this.dynamicColumns = keys.map(key => ({
            field: key,
            title: this.formatColumnTitle(key),
            isRequired: this.REQUIRED_FIELDS.includes(key)
          }));
          this.FiledsList = response.data;
          // canonical list of all columns used by template; start with all visible
          this.allColumns = keys.map(key => ({
            field: key,
            title: this.formatColumnTitle(key),
            isRequired: this.REQUIRED_FIELDS.includes(key),
            hidden: false
          }));
          this.allFields = this.allColumns.map(col => col.field);
          this.toppings.setValue(this.allFields);
          this.columnOrder = this.dynamicColumns.map(col => col.field);
          this.originalData = response.data;
          // Precompute distinct values for all columns once per dataset
          this.computeDistinctValues(this.originalData);
          // reset any previously filtered lists when data set changes
          this.filteredDistinctValues = {};
          this.gridData = {
            data: this.originalData.slice(this.skip, this.skip + this.pageSize),
            total: this.originalData.length,
          };
          this.fitColumns();
          this.loadSavedGridStates();
          this.cdr.markForCheck();
        }
      });
  }

  //////////////////
  // Customize View (new dialog)
  //////////////////

  openCustomizeViewDialog(): void {
    if (!this.allColumns || this.allColumns.length === 0) {
      return;
    }

    // Currently visible/ordered grid columns
    const selected = this.dynamicColumns.map((c: any) => ({ field: c.field, title: c.title, isRequired: !!c.isRequired }));
    const selectedFields = new Set(selected.map(c => c.field));
    // Available = all columns not currently selected, excluding required
    const available = this.allColumns
      .filter((c: any) => !selectedFields.has(c.field) && !this.REQUIRED_FIELDS.includes(c.field))
      .map((c: any) => ({ field: c.field, title: c.title }));

    const dialogRef = this.dialog.open<CustomViewDialogComponent, CustomViewDialogData, CustomViewResult>(CustomViewDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        availableColumns: available,
        selectedColumns: selected,
      },
      autoFocus: false,
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result || !result.applied || !result.selectedColumns) {
        return;
      }

      // Ensure required fields are present (cannot be removed)
      const ensured = [...result.selectedColumns];
      for (const req of this.REQUIRED_FIELDS) {
        if (!ensured.find(c => c.field === req)) {
          const idx = this.allColumns.findIndex((c: any) => c.field === req);
          if (idx > -1) {
            ensured.unshift({ field: this.allColumns[idx].field, title: this.allColumns[idx].title, isRequired: true });
          }
        }
      }
      // Build candidate layout to compare with current
      const dynamicColumnsCandidate = ensured.map(col => ({ field: col.field, title: col.title, isRequired: this.REQUIRED_FIELDS.includes(col.field) }));
      // If no effective change in fields order/selection, do nothing
      if (this.areSameColumnLayout(dynamicColumnsCandidate, this.dynamicColumns)) {
        return;
      }
      // Apply selection and order back to the grid
      this.dynamicColumns = ensured.map(col => ({ field: col.field, title: col.title, isRequired: this.REQUIRED_FIELDS.includes(col.field) }));
      this.columnOrder = this.dynamicColumns.map(col => col.field);
      this.allFields = this.dynamicColumns.map(col => col.field);
      this.toppings.setValue(this.allFields, { emitEvent: false });
      // Mark layout as changed to enable Save View
      this.hasGridChanges = true;

      // Refresh grid view and autosize
      setTimeout(() => {
        const filteredData = filterBy(this.originalData, this.filter);
        this.gridData = {
          data: filteredData.slice(this.skip, this.skip + this.pageSize),
          total: filteredData.length,
        };
        this.fitColumns();
        this.cdr.markForCheck();
      }, 0);
    });
  }

  ////////////////
  // Grid State Management
  ////////////////

  loadSavedGridStates(): void {
    this.AIService.getSurveyCustomViews(this.surveyID).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.savedGridStates = response.data.map((item: any) => ({
            ...item,
            filters: item.filters === null ? JSON.parse('{}') : JSON.parse(item.filters)
          }));
          // Preserve selectedView reference by id if it exists
          if (this.selectedView && this.selectedView.id) {
            const matched = this.savedGridStates.find(v => v.id === this.selectedView!.id);
            if (matched) {
              this.selectedView = matched as any;
            }
          }
          this.cdr.markForCheck();
        }
      },
      error => {
        console.error('Error loading grid states', error);
      }
    );
  }

  openSaveStateDialog(): void {
    this.showSaveDialog = true;
    this.newStateName = '';
    this.cdr.markForCheck();
  }

  cancelSaveState(): void {
    this.showSaveDialog = false;
    this.cdr.markForCheck();
  }

  saveGridState(): void {
    // console.log("saveGridState new",this.newStateName)
    // console.log("update saveGridState",this.selectedView)
    if (!this.newStateName.trim() && !this.selectedView) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a name for this view',
        confirmButtonColor: '#ffa022',
      });
      return;
    }
    const isUpdate = !!this.selectedView;
    const visibleColumns: GridStateColumn[] = [];
    // Read the current visual order directly from the grid, after a microtask flush
    const visibleFieldsOrdered: string[] = this.getVisibleFieldsInVisualOrder();
    // console.log("visibleFieldsOrdered",visibleFieldsOrdered)
    // Fallback: if nothing collected (edge case), derive from allColumns order and hidden flags
    if (visibleFieldsOrdered.length === 0) {
      this.allColumns.forEach((c: any) => {
        if (!c.hidden) {
          visibleFieldsOrdered.push(c.field);
        }
      });
    }
    // Sync our state to the grid's actual order (or fallback)
    if (visibleFieldsOrdered.length > 0) {
      this.columnOrder = [...visibleFieldsOrdered];
    }
    // Build the payload in the exact order
    for (const field of visibleFieldsOrdered) {
      visibleColumns.push({ field, isVisible: true });
    }
    // Do not modify order by forcing required fields; they are enforced via UI constraints

    const gridState: GridState = {
      id: this.selectedView ? this.selectedView.id : 0,
      surveyId: this.surveyID,
      name: this.selectedView ? this.selectedView.name : this.newStateName,
      columns: visibleColumns,
      filters: JSON.stringify(this.filter)
    };

    

    this.AIService.saveCustomView(gridState).subscribe(
      (response: any) => {
        if (response && response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          }).then(() => {
            // Create/Update the selected view locally with the returned id
            const newId = response.data;
            const newSelected: GridState = { ...gridState, id: newId } as any;
            if (isUpdate) {
              this.savedGridStates = this.savedGridStates.map(s => s.id === newSelected.id ? ({ ...newSelected } as any) : s);
            } else {
              this.savedGridStates = [...this.savedGridStates, ({ ...newSelected } as any)];
            }
            this.selectedView = newSelected;
            this.hasGridChanges = false;
            // Reconcile with server and preserve selection by id
            this.loadSavedGridStates();
            this.cdr.markForCheck();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          });
        }
        this.cancelSaveState();
      },
      error => {
        console.error('Error saving grid state', error);
      }
    );
  }

  applyGridState(state: GridState): void {
    if (!state) { return; }
    this.selectedView = state;
    // Build visibility set from saved state
    let visibleFields = state.columns.filter(col => col.isVisible).map(col => col.field);
    const seenFields = new Set<string>();
    visibleFields = visibleFields.filter(f => {
      if (seenFields.has(f)) { return false; }
      seenFields.add(f);
      return true;
    });
    for (const req of this.REQUIRED_FIELDS) {
      if (!seenFields.has(req)) {
        visibleFields.push(req);
        seenFields.add(req);
      }
    }
    // Ensure all original columns exist based on the current dataset
    const baseFields = this.originalData && this.originalData.length > 0
      ? Object.keys(this.originalData[0])
      : this.allColumns.map((c: any) => c.field);
    const allMap = new Map(this.allColumns.map((c: any) => [c.field, c]));
    const rebuiltAll = baseFields.map((field: string) => {
      const existing = allMap.get(field);
      return existing ? { ...existing } : {
        field,
        title: this.formatColumnTitle(field),
        isRequired: this.REQUIRED_FIELDS.includes(field),
        hidden: false
      };
    });
    // Toggle hidden on ALL columns so chooser shows all items
    const visibleSet = new Set(visibleFields);
    this.allColumns = rebuiltAll.map((c: any) => ({
      ...c,
      hidden: !visibleSet.has(c.field)
    }));
    // Order columns: saved first (in order), then the rest (preserving their previous order)
    const orderIndex = new Map<string, number>();
    visibleFields.forEach((f, i) => orderIndex.set(f, i));
    this.allColumns.sort((a: any, b: any) => {
      const ai = orderIndex.has(a.field) ? orderIndex.get(a.field)! : Number.MAX_SAFE_INTEGER;
      const bi = orderIndex.has(b.field) ? orderIndex.get(b.field)! : Number.MAX_SAFE_INTEGER;
      if (ai !== bi) { return ai - bi; }
      return 0;
    });
    this.columnOrder = [...visibleFields];
    this.toppings.setValue(visibleFields);
    this.allFields = [...visibleFields];
    // Keep dynamicColumns in sync with visible set and order
    const colMapSync = new Map(this.allColumns.map((c: any) => [c.field, c]));
    this.dynamicColumns = this.columnOrder
      .map(f => colMapSync.get(f))
      .filter((c: any) => !!c && !c.hidden)
      .map((c: any) => ({ field: c.field, title: c.title, isRequired: this.REQUIRED_FIELDS.includes(c.field) }));

    this.filter = typeof state.filters === 'string'
      ? JSON.parse(state.filters) as CompositeFilterDescriptor
      : state.filters as CompositeFilterDescriptor;

    this.selectedFilters = {};
    this.syncSelectedFiltersWithFilter();
    this.filterChange(this.filter);
    this.fitColumns();
    this.hasGridChanges = false;
    this.savedViewsMenu.closed;
    this.cdr.markForCheck();
  }


  deleteGridState(stateId: number): void {
    // used sweetalert2 to confirm the delete
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: '#ffa022',
    }).then((result) => {
      if (result.isConfirmed) {
        this.AIService.deleteSurveyCustomView(stateId).subscribe(
          (response: any) => {
            if (response && response.success) {
            this.loadSavedGridStates();
            this.clearAllFilters();
            this.selectedView = null;
            this.cdr.markForCheck();
          }
        },
        error => {
            console.error('Error deleting grid state', error);
          }
        );
      }
    });
  }

  previewGridState(state: GridState): void {
    // console.log("state", state);

    // Parse and format filters
    let filterDescription = 'No filters applied';
    if (state.filters) {
      const filters = typeof state.filters === 'string' ? 
        JSON.parse(state.filters) as CompositeFilterDescriptor : 
        state.filters as CompositeFilterDescriptor;

      if (filters.filters && filters.filters.length > 0) {
        const filterStrings: string[] = [];
        
        const processFilter = (filter: any) => {
          if (filter.filters) {
            // Handle nested filter groups
            filter.filters.forEach((f: any) => processFilter(f));
          } else if (filter.field) {
            // Handle individual filter
            const fieldName = this.formatColumnTitle(filter.field);
            const value = filter.value === null ? '(Blank)' : filter.value;
            const operator = filter.operator === 'isempty' ? 'is empty' : '=';
            filterStrings.push(`${fieldName} ${operator} ${value}`);
          }
        };

        filters.filters.forEach(processFilter);
        filterDescription = filterStrings.join('\n• ');
      }
    }

    // Show preview using SweetAlert2
    Swal.fire({
      title: `View Name: ${state.name}`,
      html: `
        <div style="text-align: left; margin-top: 1rem;">  
          <strong style="margin-top: 1rem; display: block;">Applied Filters:</strong>
          <pre style="margin-top: 0.5rem; white-space: pre-wrap;">• ${filterDescription}</pre>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#ffa022',
      width: '600px'
    });
  }

  ////////////////
  // Filtering and Paging
  ////////////////

  clearAllFilters(): void {
    this.filter = { logic: "and", filters: [] };
    this.selectedFilters = {};
    this.selectedView = null;
    
    // Restore all original columns as visible
    this.allColumns = this.allColumns.map((c: any) => ({ ...c, hidden: false }));
    this.allFields = this.allColumns.map(col => col.field);
    this.toppings.setValue(this.allFields);
    // Reset column order and caches to initial state
    this.columnOrder = [...this.allFields];
    // Sync dynamicColumns to visible order
    const allMap = new Map(this.allColumns.map((c: any) => [c.field, c]));
    this.dynamicColumns = this.columnOrder
      .map(f => allMap.get(f))
      .filter((c: any) => !!c && !c.hidden)
      .map((c: any) => ({ field: c.field, title: c.title, isRequired: this.REQUIRED_FIELDS.includes(c.field) }));
    this.filteredDistinctValues = {};
    this.filterCache = {};
    
    this.gridData = {
      data: this.originalData.slice(this.skip, this.skip + this.pageSize),
      total: this.originalData.length,
    };
    this.hasGridChanges = false;
    
    // Update grid layout after restoring columns
    setTimeout(() => {
      this.fitColumns();
      // Force grid to rebind by toggling data reference
      const temp = [...this.gridData.data];
      this.gridData = { data: temp, total: this.gridData.total };
      this.cdr.detectChanges();
    }, 10);
    
    this.cdr.markForCheck();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    // console.log("filter in filterChange", filter);
    this.filter = filter;
    const filteredData = filterBy(this.originalData, filter);
    this.gridData = {
      data: filteredData.slice(this.skip, this.skip + this.pageSize),
      total: filteredData.length,
    };
    
    // Sync selectedFilters with current filter state
    this.syncSelectedFiltersWithFilter();
    
    if(this.filter && 'filters' in this.filter && this.filter.filters.length > 0) {
      // Only mark as changed if we have a selected view and the filters differ
      if (this.selectedView) {
        const viewFilters = typeof this.selectedView.filters === 'string' ? 
          JSON.parse(this.selectedView.filters) as CompositeFilterDescriptor : 
          this.selectedView.filters as CompositeFilterDescriptor;
          
        // Compare current filters with the selected view's filters
        const currentFilterFields = this.extractFilterFields(this.filter);
        const viewFilterFields = this.extractFilterFields(viewFilters);
        
        // Check if filters have changed
        this.hasGridChanges = !this.areFiltersEqual(currentFilterFields, viewFilterFields);
      } else {
        // If no view is selected, any filter means changes
        this.hasGridChanges = true;
      }
    } else if (this.selectedView) {
      // If we have a selected view but no filters, mark as changed if view has filters
      const viewFilters = typeof this.selectedView.filters === 'string' ? 
        JSON.parse(this.selectedView.filters) as CompositeFilterDescriptor : 
        this.selectedView.filters as CompositeFilterDescriptor;
      this.hasGridChanges = viewFilters && viewFilters.filters && viewFilters.filters.length > 0;
    } else {
      // No view, no filters - no changes
      this.hasGridChanges = false;
    }
    
    this.cdr.markForCheck();
  }
  
  // Helper method to sync selectedFilters with the current filter state
  private syncSelectedFiltersWithFilter(): void {
    // First, create a map of fields currently in the filter
    const fieldsInFilter: { [field: string]: boolean } = {};
    
    // Process filters to identify all fields that should be kept
    if (this.filter && 'filters' in this.filter && this.filter.filters.length > 0) {
      this.filter.filters.forEach((filterGroup: any) => {
        if (filterGroup.filters && Array.isArray(filterGroup.filters)) {
          // Process each filter condition in the group
          filterGroup.filters.forEach((condition: any) => {
            if (condition.field) {
              // Mark this field as present in the filter
              fieldsInFilter[condition.field] = true;
              
              // Ensure the field exists in selectedFilters
              if (!this.selectedFilters[condition.field]) {
                this.selectedFilters[condition.field] = [];
              }
              
              // Add the value if not already present
              const raw = condition.operator === 'isempty' ? '(Blank)' : condition.value;
              const normalized = (raw === null || raw === undefined || raw === '') ? '(Blank)' : raw;
              if (!this.selectedFilters[condition.field].includes(normalized)) {
                this.selectedFilters[condition.field].push(normalized);
              }
            }
          });
        } else if (filterGroup.field) {
          // It's a simple filter condition
          fieldsInFilter[filterGroup.field] = true;
          
          // Ensure the field exists in selectedFilters
          if (!this.selectedFilters[filterGroup.field]) {
            this.selectedFilters[filterGroup.field] = [];
          }
          
          // Add the value if not already present
          const raw = filterGroup.operator === 'isempty' ? '(Blank)' : filterGroup.value;
          const normalized = (raw === null || raw === undefined || raw === '') ? '(Blank)' : raw;
          if (!this.selectedFilters[filterGroup.field].includes(normalized)) {
            this.selectedFilters[filterGroup.field].push(normalized);
          }
        }
      });
    }
    
    // Remove any fields from selectedFilters that are no longer in the filter
    Object.keys(this.selectedFilters).forEach(field => {
      if (!fieldsInFilter[field]) {
        delete this.selectedFilters[field];
      }
    });
  }
  
  // Helper method to extract filter fields and values
  private extractFilterFields(filter: CompositeFilterDescriptor): {[field: string]: any[]} {
    const result: {[field: string]: any[]} = {};
    
    if (filter && filter.filters && filter.filters.length > 0) {
      filter.filters.forEach((filterGroup: any) => {
        if (filterGroup.filters && Array.isArray(filterGroup.filters)) {
          filterGroup.filters.forEach((condition: any) => {
            if (condition.field) {
              if (!result[condition.field]) {
                result[condition.field] = [];
              }
              
              const value = condition.operator === 'isempty' ? '(Blank)' : condition.value;
              if (!result[condition.field].includes(value)) {
                result[condition.field].push(value);
              }
            }
          });
        } else if (filterGroup.field) {
          if (!result[filterGroup.field]) {
            result[filterGroup.field] = [];
          }
          
          const value = filterGroup.operator === 'isempty' ? '(Blank)' : filterGroup.value;
          if (!result[filterGroup.field].includes(value)) {
            result[filterGroup.field].push(value);
          }
        }
      });
    }
    
    return result;
  }
  
  // Helper method to compare two filter field objects
  private areFiltersEqual(filters1: {[field: string]: any[]}, filters2: {[field: string]: any[]}): boolean {
    const fields1 = Object.keys(filters1);
    const fields2 = Object.keys(filters2);
    
    // Different number of fields
    if (fields1.length !== fields2.length) {
      return false;
    }
    
    // Check if all fields in filters1 exist in filters2 with the same values
    for (const field of fields1) {
      if (!filters2[field]) {
        return false;
      }
      
      const values1 = [...filters1[field]].sort();
      const values2 = [...filters2[field]].sort();
      
      // Different number of values
      if (values1.length !== values2.length) {
        return false;
      }
      
      // Check all values
      for (let i = 0; i < values1.length; i++) {
        if (values1[i] !== values2[i]) {
          return false;
        }
      }
    }
    
    return true;
  }

  pageChange(event: { skip: number; take: number }): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    const filteredData = filterBy(this.originalData, this.filter);
    this.gridData = {
      data: filteredData.slice(this.skip, this.skip + this.pageSize),
      total: filteredData.length,
    };
    this.cdr.markForCheck();
  }

  ////////////////
  // Utility Methods
  ////////////////

  formatColumnTitle(columnKey: string): string {
    return columnKey.replace(/_/g, ' ');
  }
  // Compare column layouts by ordered field identifiers
  private areSameColumnLayout(a: any[], b: any[]): boolean {
    if (!Array.isArray(a) || !Array.isArray(b)) { return false; }
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
      if ((a[i] && a[i].field) !== (b[i] && b[i].field)) { return false; }
    }
    return true;
  }

  getSafeFieldValue(item: any, field: string): any {
    return item && item[field] !== undefined ? item[field] : '';
  }

  trackByField(index: number, col: any): string {
    return col.field;
  }

  private getVisibleFieldsInVisualOrder(): string[] {
    // Prefer Kendo's internal ordering (orderIndex / leafIndex)
    const columnsRef: any = (this.grid as any)?.columns;
    let cols: any[] = [];
    if (columnsRef) {
      cols = typeof columnsRef.toArray === 'function' ? columnsRef.toArray() : (Array.isArray(columnsRef) ? columnsRef : []);
    }
    const visibleWithIndex = cols
      .filter((c: any) => c && c.field && !c.hidden)
      .map((c: any, i: number) => ({
        field: c.field,
        idx: (typeof c.orderIndex === 'number') ? c.orderIndex : ((typeof c.leafIndex === 'number') ? c.leafIndex : i)
      }))
      .sort((a, b) => a.idx - b.idx);
    let ordered = visibleWithIndex.map(x => x.field);
    if (ordered.length === 0) {
      // Fallback to our maintained order filtered by visibility
      const visibleSet = new Set(this.allColumns.filter((c: any) => !c.hidden).map((c: any) => c.field));
      if (this.columnOrder && this.columnOrder.length) {
        ordered = this.columnOrder.filter(f => visibleSet.has(f));
      } else {
        // Final fallback: current allColumns order
        ordered = this.allColumns.filter((c: any) => !c.hidden).map((c: any) => c.field);
      }
    }
    return ordered;
  }

  distinctPrimitive(field: string): any[] {
    // console.log("distinctPrimitive",field);
    if (!this.filterCache[field]) {
      this.filterCache[field] = [
        ...new Set(this.gridData.data.map((item: any) => item[field] || "(Blank)"))
      ];
      return this.filterCache[field];
    }else{

      this.filterCache[field] = [
        ...new Set(this.originalData.map((item: any) => item[field] || "(Blank)"))
      ];
      return this.filterCache[field];
    }
    
  }

  // Compute and cache distinct values per field to avoid recomputation on every CD cycle
  private computeDistinctValues(sourceData: any[]): void {
    const distinctMap: { [field: string]: any[] } = {};
    for (const col of this.allColumns) {
      const field = col.field;
      // Use Set to get uniques and include explicit placeholder for blanks
      distinctMap[field] = Array.from(new Set(sourceData.map((item: any) => {
        const value = item[field];
        return (value === null || value === undefined || value === '') ? "(Blank)" : value;
      })));
    }
    this.distinctValues = distinctMap;
  }

  onMultiSelectFilterChange(selectedValues: any[], field: string, filterService: FilterService): void {
    // console.log("onMultiSelectFilterChange",selectedValues,field,filterService);
    // Normalize blanks to single token and de-duplicate
    const normalized = (selectedValues || []).map(v => (v === null || v === undefined || v === '') ? '(Blank)' : v);
    this.selectedFilters[field] = Array.from(new Set(normalized));
    const filters: FilterDescriptor[] = selectedValues.map(val => ({
      field,
      operator: val === "(Blank)" ? "isempty" : "eq",
      value: val === "(Blank)" ? null : val,
    }));
    filterService.filter({
      logic: "or",
      filters: filters.length > 0 ? filters : [],
    });
  }
  onMuiltiSelectBlur(field: string) {
    // check if the filter has this field
    // console.log("onMuiltiSelectBlur",field);
  setTimeout(() => {
    // Rebuild the selected values for this field from the current filter
    const collected: any[] = [];
    const pushNormalized = (rawVal: any, operator?: string) => {
      const raw = operator === 'isempty' ? "(Blank)" : rawVal;
      const normalized = (raw === null || raw === undefined || raw === '') ? "(Blank)" : raw;
      if (!collected.includes(normalized)) {
        collected.push(normalized);
      }
    };

    if (this.filter && 'filters' in this.filter && Array.isArray(this.filter.filters)) {
      for (const node of this.filter.filters as any[]) {
        // Composite group
        if (node && 'filters' in node && Array.isArray(node.filters)) {
          for (const condition of node.filters) {
            if (condition && condition.field === field) {
              pushNormalized(condition.value, condition.operator);
            }
          }
        } else if (node && node.field === field) {
          // Single condition at top-level
          pushNormalized(node.value, node.operator);
        }
      }
    }

    this.selectedFilters[field] = collected;
  }, 300);
   
   
  }

  // Update the visible options of the MultiSelect based on the search text
  filterDistinct(searchText: string, field: string): void {
    const source = this.distinctValues[field] || [];
    const term = (searchText || '').toString().toLowerCase();
    this.filteredDistinctValues[field] = term
      ? source.filter((v: any) => String(v).toLowerCase().includes(term))
      : [...source];
    this.cdr.markForCheck();
  }
IsIncluded(prop:any):boolean {
    const hiddenCol = prop;
     let isincluded=true;
    //const fixedColumnFields=["Name","InspectionName","Submitted_Date"];
    if (this.REQUIRED_FIELDS.includes(hiddenCol) ) {
      // Revert hiding since these columns must remain visible
      isincluded= false;
    }
    return isincluded;
      
  }
  onColumnVisibilityChange(event:any): void {
    // console.log("onColumnVisibilityChange");
    // Using a short timeout to ensure the grid has updated its internal state
    debugger;
    setTimeout(() => {
      // Do not allow required fields to be hidden
      this.grid.columns.forEach((column: any) => {
        if (this.REQUIRED_FIELDS.includes(column.field) && column.hidden) {
          column.hidden = false;
        }
      });
      // Sync allColumns.hidden and columnOrder with current grid
      const nextVisibleOrder: string[] = [];
      const hiddenSet = new Set<string>();
      this.grid.columns.forEach((column: any) => {
        if (!!column.field) {
          if (column.hidden) {
            hiddenSet.add(column.field);
          } else {
            nextVisibleOrder.push(column.field);
          }
        }
      });
      this.allColumns = this.allColumns.map((c: any) => ({ ...c, hidden: hiddenSet.has(c.field) }));
      if (nextVisibleOrder.length > 0) {
        this.columnOrder = [...nextVisibleOrder];
      }
      // Sync dynamicColumns to the latest visible order
      const mapCol = new Map(this.allColumns.map((c: any) => [c.field, c]));
      this.dynamicColumns = this.columnOrder
        .map(f => mapCol.get(f))
        .filter((c: any) => !!c && !c.hidden)
        .map((c: any) => ({ field: c.field, title: c.title, isRequired: this.REQUIRED_FIELDS.includes(c.field) }));
      this.fitColumns();
      // Force data refresh to trigger grid layout update
      const tempData = [...this.gridData.data];
      this.gridData = {
        data: tempData,
        total: this.gridData.total
      };
      this.hasGridChanges = true;
      this.cdr.markForCheck();
    }, 100);
  }

  fitColumns(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.grid.autoFitColumns();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // fetchAllData(){
  //   this.AIService.getServeyResponse(this.surveyID).subscribe((response:any) => {
  //     this.originalData = response.data;
  //     this.gridData = {
  //       data: this.originalData.slice(this.skip, this.skip + this.pageSize),
  //       total: this.originalData.length,
  //     };
  //     this.cdr.markForCheck();
  //   });
  // }
  fetchAllData = (): Promise<ExcelExportData> => {
    return new Promise((resolve) => {
      let exportData = this.filter.filters.length > 0 ? filterBy(this.originalData, this.filter) : this.originalData;
      resolve({ data: exportData });
    });
  };
  getTruncatedViewName(name: string): string {
    const maxLength = 15;
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength) + '...';
  }
  onColumnReorder(event: any): void {
    // console.log("onColumnReorder",event);
    // If Kendo emits indexes, use them to reorder our arrays directly
    if (typeof event?.oldIndex === 'number' && typeof event?.newIndex === 'number' && event?.column?.field) {
      const movedField = event.column.field as string;
      // Update columnOrder
      const currentIndex = this.columnOrder.indexOf(movedField);
      if (currentIndex > -1) {
        this.columnOrder.splice(currentIndex, 1);
        this.columnOrder.splice(event.newIndex, 0, movedField);
      }
      // Update dynamicColumns in the same way
      const dynIndex = this.dynamicColumns.findIndex(c => c.field === movedField);
      if (dynIndex > -1) {
        const [moved] = this.dynamicColumns.splice(dynIndex, 1);
        this.dynamicColumns.splice(event.newIndex, 0, moved);
      }
      this.hasGridChanges = true;
      this.fitColumns();
      this.cdr.detectChanges();
      return;
    }

    // Fallback: read the new order from grid columns after reorder
    setTimeout(() => {
      const nextVisibleOrder: string[] = [];
      this.grid.columns.forEach((column: any) => {
        if (!column.hidden && !!column.field) {
          nextVisibleOrder.push(column.field);
        }
      });
      if (nextVisibleOrder.length > 0) {
        // Reorder allColumns so visible columns come first in the new order, followed by hidden ones preserving relative order
        const visibleSet = new Set(nextVisibleOrder);
        const visibleCols: any[] = [];
        const hiddenCols: any[] = [];
        const byField = new Map(this.allColumns.map((c: any) => [c.field, c]));
        nextVisibleOrder.forEach(f => { const c = byField.get(f); if (c) { visibleCols.push(c); } });
        this.allColumns.forEach(c => { if (!visibleSet.has(c.field)) { hiddenCols.push(c); } });
        this.allColumns = [...visibleCols, ...hiddenCols];
        this.columnOrder = [...nextVisibleOrder];
        // Sync dynamicColumns to visible
        this.dynamicColumns = visibleCols.map((c: any) => ({ field: c.field, title: c.title, isRequired: this.REQUIRED_FIELDS.includes(c.field) }));
        this.hasGridChanges = true;
        this.fitColumns();
        this.cdr.detectChanges();
      }
    }, 0);
  }
  preventDefaultchange(event:any){
    // console.log("preventDefaultchange",event);

  }

}

/** Simple function for comparing numbers or strings */
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
