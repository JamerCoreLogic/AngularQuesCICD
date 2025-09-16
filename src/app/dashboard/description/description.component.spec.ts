import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DescriptionComponent } from './description.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ViewRequestComponent } from '../view-request/view-request.component';
import { GraphComponent } from '../graph/graph.component';
import { By } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// Create a mock GraphComponent
@Component({
  selector: 'app-graph',
  template: '<div>Mock Graph Component</div>'
})
class MockGraphComponent {
  @Input() data: any;  // Changed from graphData to data to match the template
}

describe('DescriptionComponent', () => {
  let component: DescriptionComponent;
  let fixture: ComponentFixture<DescriptionComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;
  const mockGraphData = {
    acceptedPercent: 33,
    declinedPercent: 33,
    noResponsePercent: 34
  };

  const mockData = {
    acceptedRequestDetails: [
      {
        adjusterResponseId: 1,
        commRequestId: 100,
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        location: 'New York',
        distance: '10.5',
        actionDate: '2024-03-20'
      }
    ],
    declinedRequestDetails: [] as any[],
    notRespondedRequestDetails: [] as any[],
    graphData: mockGraphData
  };

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['MarkedCompleted']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ 
        DescriptionComponent,
        MockGraphComponent
      ],
      imports: [
        BrowserAnimationsModule,
        SharedMaterialModule,
        ChartsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        RouterTestingModule,
        CommonModule,
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgxSpinnerService, useValue: mockSpinner }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with accepted requests data', () => {
    expect(component.dataSource.data).toEqual(mockData.acceptedRequestDetails);
    expect(component.legendItemName).toBe('Accepted');
  });

  it('should handle legend item click for different categories', () => {
    // Test Accepted
    component.onLegendItemClick('Accepted');
    expect(component.dataSource.data).toEqual(mockData.acceptedRequestDetails);
    expect(component.legendItemName).toBe('Accepted');

    // Test Declined
    component.onLegendItemClick('Declined');
    expect(component.dataSource.data).toEqual(mockData.declinedRequestDetails);
    expect(component.legendItemName).toBe('Declined');

    // Test No Response
    component.onLegendItemClick('No Response');
    expect(component.dataSource.data).toEqual(mockData.notRespondedRequestDetails);
    expect(component.legendItemName).toBe('No Response');
  });

  it('should handle checkbox selection', () => {
    const mockEvent = { checked: true };
    component.toggleAllRows(mockEvent);
    expect(component.selection.selected.length).toBe(component.dataSource.data.length);

    // Uncheck all
    component.toggleAllRows({ checked: false });
    expect(component.selection.selected.length).toBe(0);
  });

  it('should generate correct checkbox label', () => {
    const row = mockData.acceptedRequestDetails[0];
    expect(component.checkboxLabel()).toBe('select all');
    expect(component.checkboxLabel(row as any)).toContain('select row');
  });

  it('should handle mark complete with no selection', fakeAsync(() => {
    const swalSpy = spyOn(Swal, 'fire');
    component.markComplete();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error'
    }));
  }));

  it('should handle mark complete successfully', fakeAsync(() => {
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    mockDashboardService.MarkedCompleted.and.returnValue(of(true));
    
    // Select a row
    component.selection.select(mockData.acceptedRequestDetails[0] as any);
    component.markComplete();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockDashboardService.MarkedCompleted).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success'
    }));
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should handle mark complete error', fakeAsync(() => {
    const swalSpy = spyOn(Swal, 'fire');
    mockDashboardService.MarkedCompleted.and.returnValue(throwError(() => new Error('Test error')));
    
    component.selection.select(mockData.acceptedRequestDetails[0] as any);
    component.markComplete();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error'
    }));
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

  it('should open view request dialog', () => {
    const mockDialogRef = { afterClosed: () => of(null) };
    mockDialog.open.and.returnValue(mockDialogRef as any);
    
    const testData = { adjusterResponseId: 1 };
    component.viewRequest(testData);
    
    expect(mockDialog.open).toHaveBeenCalledWith(
      ViewRequestComponent,
      jasmine.objectContaining({
        data: { data: 1 },
        width: '1000px'
      })
    );
  });

  it('should handle selected rows', () => {
    const row = mockData.acceptedRequestDetails[0];
    component.selection.select(row as any);
    const selectedIds = component.getSelectedRowIds();
    expect(selectedIds).toBe('1'); // adjusterResponseId of the mock data
  });

  it('should render table with correct columns', () => {
    const tableColumns = fixture.debugElement.queryAll(By.css('th'));
    expect(tableColumns.length).toBeGreaterThan(0);
    expect(component.displayedColumns).toContain('name');
    expect(component.displayedColumns).toContain('phone');
    expect(component.displayedColumns).toContain('email');
  });

 

  it('should update data source when legend items are clicked', () => {
    component.onLegendItemClick('Accepted');
    expect(component.dataSource.data).toEqual(mockData.acceptedRequestDetails);
    expect(component.legendItemName).toBe('Accepted');
    
    component.onLegendItemClick('Declined');
    expect(component.dataSource.data).toEqual(mockData.declinedRequestDetails);
    expect(component.legendItemName).toBe('Declined');
    
    component.onLegendItemClick('No Response');
    expect(component.dataSource.data).toEqual(mockData.notRespondedRequestDetails);
    expect(component.legendItemName).toBe('No Response');
  });
});
