import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { ViewAdjusterInfoComponent } from './view-adjuster-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewAdjusterInfoComponent', () => {
  let component: ViewAdjusterInfoComponent;
  let fixture: ComponentFixture<ViewAdjusterInfoComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ViewAdjusterInfoComponent>>;

  const mockAdjusterData = {
    adjuster: [
      { 
        name: 'John Doe', 
        email: 'john@example.com', 
        emailDate: new Date('2023-01-15'), 
        respondedOn: new Date('2023-01-17'), 
        response: 'Accepted',
        isSelected: true,
        title: 'Test Request' 
      },
      { 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        emailDate: new Date('2023-01-15'), 
        respondedOn: new Date('2023-01-18'), 
        response: 'Declined',
        isSelected: false,
        title: 'Test Request' 
      },
      { 
        name: 'Bob Johnson', 
        email: 'bob@example.com', 
        emailDate: new Date('2023-01-15'), 
        respondedOn: null, 
        response: 'Pending',
        isSelected: false,
        title: 'Test Request' 
      }
    ]
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ViewAdjusterInfoComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatDividerModule,
        MatCheckboxModule,
        MatTooltipModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockAdjusterData }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAdjusterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    expect(component.title).toBe('Test Request');
    const titleElement = fixture.debugElement.query(By.css('h5'));
    expect(titleElement.nativeElement.textContent).toContain('TEST REQUEST');
  });

  it('should initialize the data table with adjuster information', () => {
    expect(component.viewAdjusterInfo.length).toBe(3);
    expect(component.dataSource.data.length).toBe(3);
    
    // Verify table rows
    const tableRows = fixture.debugElement.queryAll(By.css('tr.mat-row'));
    expect(tableRows.length).toBe(3);
    
    // Check first row content
    const firstRowCells = tableRows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('John Doe');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('john@example.com');
  });

  it('should filter data based on search input', () => {
    // Filter by name
    component.searchControl.setValue('Jane');
    component.filterData('Jane');
    fixture.detectChanges();
    
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Jane Smith');
    
    // Filter by email
    component.searchControl.setValue('bob@');
    component.filterData('bob@');
    fixture.detectChanges();
    
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Bob Johnson');
    
    // Reset filter
    component.searchControl.setValue('');
    component.filterData('');
    fixture.detectChanges();
    
    expect(component.dataSource.data.length).toBe(3);
  });

  it('should handle case-insensitive search', () => {
    // Search with lowercase
    component.searchControl.setValue('john');
    component.filterData('john');
    fixture.detectChanges();
    
    // The filter should match only John Doe
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].name).toBe('John Doe');
    
    // Reset the data
    component.filterData('');
    fixture.detectChanges();
    
    // Search with uppercase - component converts to lowercase internally
    component.searchControl.setValue('JANE');
    component.filterData('JANE');
    fixture.detectChanges();
    
    // The filter should match only Jane Smith
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Jane Smith');
  });

  it('should properly setup the paginator after view init', () => {
    expect(component.paginator).toBeDefined();
    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should display checkboxes for selected adjusters', () => {
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBe(3);
    
    // First adjuster is selected
    expect(component.viewAdjusterInfo[0].isSelected).toBeTrue();
    
    // Others are not selected
    expect(component.viewAdjusterInfo[1].isSelected).toBeFalse();
    expect(component.viewAdjusterInfo[2].isSelected).toBeFalse();
  });

  it('should handle correct date formatting', () => {
    const dateElements = fixture.debugElement.queryAll(By.css('td:nth-child(3)'));
    const firstRowDate = dateElements[0].nativeElement.textContent.trim();
    
    // Check date format (MM/dd/yyyy)
    expect(firstRowDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should filter multiple adjusters correctly', () => {
    // Search for common domain
    component.searchControl.setValue('example.com');
    component.filterData('example.com');
    fixture.detectChanges();
    
    // Should match all adjusters with example.com in their email
    expect(component.dataSource.data.length).toBe(3);
  });
});
