/*
 * survey‑sent‑list.component.spec.ts – complete, error‑free test suite
 * ------------------------------------------------------------------
 * Covers every public branch of SurveySentListComponent:
 *  – creation & basic initialisation
 *  – paginator/sort wiring in ngAfterViewInit
 *  – FormControl‑driven search & explicit filterData() behaviour
 *  – graceful reset when search box cleared
 *  – dialog close interaction
 * Uses NO_ERRORS_SCHEMA so no Material templates are required at runtime.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SurveySentListComponent } from './survey-sent-list.component';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// MatTableDataSource is used directly by the component – import real class
import { MatTableDataSource } from '@angular/material/table';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Pipe, PipeTransform } from '@angular/core';

// Create a mock phoneMask pipe for testing
@Pipe({name: 'phoneMask'})
class MockPhoneMaskPipe implements PipeTransform {
  transform(value: any): any {
    return value; // Just return the original value for testing
  }
}

// ---------------------------------------------------------------------------
// Test doubles / fixtures
// ---------------------------------------------------------------------------
interface Adjuster {
  name: string;
  phone: string;
  emailId: string;
  address: string;
  submittedOn: Date;
  distance: string;
}

const EXPANDED_DATA: Adjuster[] = [
  {
    name: 'Alice',
    phone: '1234567890',
    emailId: 'alice@test.com',
    address: 'Delhi',
    submittedOn: new Date('2025-01-01'),
    distance: '10 km',
  },
  {
    name: 'Bob',
    phone: '9876543210',
    emailId: 'bob@test.com',
    address: 'Mumbai',
    submittedOn: new Date('2025-02-02'),
    distance: '20 km',
  },
];

const DIALOG_DATA = {
  element: {
    title: 'Test Survey',
    expandedData: EXPANDED_DATA,
  },
};

const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------
describe('SurveySentListComponent – full suite', () => {
  let component: SurveySentListComponent;
  let fixture: ComponentFixture<SurveySentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        SharedMaterialModule,
        MatLegacyDialogModule,
        NgxSpinnerModule,
      ],
      declarations: [SurveySentListComponent, MockPhoneMaskPipe],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_DATA },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignore template material tags
    }).compileComponents();

    fixture = TestBed.createComponent(SurveySentListComponent);
    component = fixture.componentInstance;

    // Create proper stubs for MatPaginator and MatSort
    component.paginator = {
      page: jasmine.createSpyObj('page', ['subscribe']),
      length: 0,
      pageIndex: 0,
      pageSize: 10,
      pageSizeOptions: [5, 10, 20]
    } as any;
    
    component.sort = {
      sortChange: jasmine.createSpyObj('sortChange', ['subscribe']),
      active: '',
      direction: ''
    } as any;

    // Run initial change detection cycle
    fixture.detectChanges();

    // Manually invoke ngAfterViewInit to connect the paginator and sort
    component.ngAfterViewInit();
  });

  // -------------------------------------------------------------------------
  // Creation & initialisation
  // -------------------------------------------------------------------------
  it('creates the component and initialises title/dataSource', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('Test Survey');
    expect(component.dataSource instanceof MatTableDataSource).toBeTrue();
    expect(component.dataSource.data.length).toBe(EXPANDED_DATA.length);
  });

  it('wires paginator & sort in ngAfterViewInit', () => {
    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.dataSource.sort).toBe(component.sort);
  });

  // -------------------------------------------------------------------------
  // filterData()
  // -------------------------------------------------------------------------
  it('filterData() filters rows by name/email/phone case‑insensitively', () => {
    // Create a fresh instance of dataSource to avoid table rendering issues
    component.dataSource = new MatTableDataSource(EXPANDED_DATA);
    
    // Test filtering by name
    component.filterData('ali'); // matches Alice by name
    expect(component.dataSource.data.length).toBe(1);
    expect((component.dataSource.data[0] as Adjuster).name).toBe('Alice');

    // Reset data and test filtering by phone
    component.dataSource.data = EXPANDED_DATA;
    component.filterData('9876'); // matches Bob by phone
    expect(component.dataSource.data.length).toBe(1);
    expect((component.dataSource.data[0] as Adjuster).name).toBe('Bob');

    // Reset data and test no matches
    component.dataSource.data = EXPANDED_DATA;
    component.filterData('non‑existent'); // no match
    expect(component.dataSource.data.length).toBe(0);
  });

  it('filterData() resets to full list when search cleared', () => {
    // Create a fresh instance of dataSource to avoid table rendering issues
    component.dataSource = new MatTableDataSource(EXPANDED_DATA);
    
    // Filter and then clear
    component.filterData('ali');
    expect(component.dataSource.data.length).toBe(1);

    component.filterData(''); // clear
    expect(component.dataSource.data.length).toBe(EXPANDED_DATA.length);
  });

  // -------------------------------------------------------------------------
  // Reactive search input behaviour
  // -------------------------------------------------------------------------
  it('searchControl pushes values into filterData()', fakeAsync(() => {
    // Setup spy that doesn't call through to avoid table rendering issues
    const spy = spyOn(component, 'filterData').and.stub();
    
    // Trigger the form control change
    component.searchControl.setValue('alice');
    
    // Flush any pending async operations
    tick();
    
    // Verify the method was called with the right value
    expect(spy).toHaveBeenCalledWith('alice');
  }));

  // -------------------------------------------------------------------------
  // Dialog close
  // -------------------------------------------------------------------------
  it('onClose() closes the dialog', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
