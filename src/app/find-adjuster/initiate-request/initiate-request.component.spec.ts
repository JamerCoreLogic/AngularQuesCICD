import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { InitiateRequestComponent } from './initiate-request.component';
import { AdjustersService } from '../../services/adjusters.service';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { ViewAdjusterInfoComponent } from '../view-adjuster-info/view-adjuster-info.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

describe('InitiateRequestComponent', () => {
  let component: InitiateRequestComponent;
  let fixture: ComponentFixture<InitiateRequestComponent>;
  let adjustersServiceSpy: jasmine.SpyObj<AdjustersService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<InitiateRequestComponent>>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let sharedAdjusterServiceSpy: jasmine.SpyObj<SharedAdjusterService>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;
  let formBuilder: FormBuilder;

  const mockClients = {
    data: [
      { clientId: 1, fName: 'John', lName: 'Doe' },
      { clientId: 2, fName: 'Jane', lName: 'Smith' }
    ]
  };

  const mockAssessments = {
    data: [
      { assessmentTypeId: 1, type: 'Residential' },
      { assessmentTypeId: 2, type: 'Commercial' }
    ]
  };

  const mockData = {
    adjusters: [
      { userId: '1', distance: '10' },
      { userId: '2', distance: '20' }
    ],
    data: {
      isViewRequest: false,
      title: 'Test Request',
      client: '1',
      assignmentType: 'Residential',
      date: new Date(),
      isSingleClaim: true,
      description: 'Test description',
      ajusterDetails: [
        { name: 'Adjuster 1', email: 'adj1@example.com' },
        { name: 'Adjuster 2', email: 'adj2@example.com' }
      ]
    }
  };

  beforeEach(async () => {
    // Create spies for all dependencies
    adjustersServiceSpy = jasmine.createSpyObj('AdjustersService', [
      'GetClientList',
      'GetAssessmentList',
      'InitiateRequest'
    ]);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    sharedAdjusterServiceSpy = jasmine.createSpyObj('SharedAdjusterService', ['getCurrentSearchText']);
    spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    // Set up mock responses
    adjustersServiceSpy.GetClientList.and.returnValue(of(mockClients));
    adjustersServiceSpy.GetAssessmentList.and.returnValue(of(mockAssessments));
    adjustersServiceSpy.InitiateRequest.and.returnValue(of({ success: true, message: 'Success' }));
    sharedAdjusterServiceSpy.getCurrentSearchText.and.returnValue('NEW YORK');

    // Mock SweetAlert
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);

    await TestBed.configureTestingModule({
      declarations: [InitiateRequestComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatTooltipModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        FormBuilder,
        { provide: AdjustersService, useValue: adjustersServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: SharedAdjusterService, useValue: sharedAdjusterServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(InitiateRequestComponent);
    component = fixture.componentInstance;
    
    // Manually set up the clients and assessments arrays
    component.clients = [
      { clientId: 1, fullName: 'John Doe' },
      { clientId: 2, fullName: 'Jane Smith' }
    ];
    
    component.assessment = [
      { assessmentId: 2, assessmentType: 'Commercial' },
      { assessmentId: 1, assessmentType: 'Residential' }
    ];
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.requestForm).toBeDefined();
    expect(component.requestForm.get('title')).toBeDefined();
    expect(component.requestForm.get('client')).toBeDefined();
    expect(component.requestForm.get('assignmentType')).toBeDefined();
    expect(component.requestForm.get('requestDate')).toBeDefined();
    expect(component.requestForm.get('isSingleClaim')).toBeDefined();
    expect(component.requestForm.get('description')).toBeDefined();
  });

  it('should have clients array populated', () => {
    expect(component.clients.length).toBe(2);
    expect(component.clients[0].fullName).toBe('John Doe');
  });

  it('should have assessment array populated', () => {
    expect(component.assessment.length).toBe(2);
    expect(component.assessment[0].assessmentType).toBe('Commercial');
  });

  it('should update form values when in view state', () => {
    const viewData = {
      data: {
        isViewRequest: true,
        title: 'View Request',
        client: '2',
        assignmentType: 'Commercial',
        date: new Date(),
        isSingleClaim: false,
        description: 'View description'
      }
    };
    
    component.data = viewData;
    component.ngOnChanges({
      data: {
        currentValue: viewData,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    
    expect(component.isViewState).toBeTrue();
    expect(component.requestForm.disabled).toBeTrue();
    expect(component.requestForm.get('title')?.value).toBe('View Request');
    expect(component.requestForm.get('client')?.value).toBe('2');
    expect(component.requestForm.get('assignmentType')?.value).toBe('Commercial');
    expect(component.requestForm.get('isSingleClaim')?.value).toBeFalse();
    expect(component.requestForm.get('description')?.value).toBe('View description');
  });

  it('should correctly identify invalid controls', () => {
    // Initially all controls are untouched
    expect(component.isControlInvalid('title')).toBeFalse();
    
    // Mark control as touched but keep it valid
    component.requestForm.get('title')?.setValue('Test Title');
    component.requestForm.get('title')?.markAsTouched();
    expect(component.isControlInvalid('title')).toBeFalse();
    
    // Make control invalid and touched
    component.requestForm.get('title')?.setValue('');
    component.requestForm.get('title')?.markAsTouched();
    expect(component.isControlInvalid('title')).toBeTrue();
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    // Spy on markAllAsTouched
    spyOn(component.requestForm, 'markAllAsTouched');
    
    // Form is initially invalid because no values are set
    component.onSubmit();
    
    // Verify markAllAsTouched was called
    expect(component.requestForm.markAllAsTouched).toHaveBeenCalled();
    
    // Verify API call was not made
    expect(adjustersServiceSpy.InitiateRequest).not.toHaveBeenCalled();
  });

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should reset the form when clearForm is called', () => {
    // Spy on form reset
    spyOn(component.requestForm, 'reset');
    
    component.clearForm();
    expect(component.requestForm.reset).toHaveBeenCalled();
  });

  it('should open adjuster info dialog when viewAdjusterInfo is called', () => {
    // Create view state data
    component.data = {
      data: {
        isViewRequest: true,
        title: 'View Request',
        ajusterDetails: [
          { id: 1, name: 'Adjuster 1' },
          { id: 2, name: 'Adjuster 2' }
        ]
      }
    };
    
    component.viewAdjusterInfo();
    
    // Verify dialog was opened with correct data
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ViewAdjusterInfoComponent,
      jasmine.objectContaining({
        panelClass: 'view_adjuster_info',
        data: jasmine.anything()
      })
    );
    
    // Verify data passed to dialog - use type assertion for accessing dialog data
    const dialogCall = matDialogSpy.open.calls.first();
    const dialogConfig = dialogCall.args[1];
    const dialogData = dialogConfig.data as { adjuster: any[] };
    expect(dialogData.adjuster.length).toBe(2);
    expect(dialogData.adjuster[0].title).toBe('View Request');
  });

  it('should show and hide appropriate buttons based on view state', () => {
    // Set view state to true
    component.isViewState = true;
    fixture.detectChanges();
    
    // Should show View Adjuster Info and Cancel buttons
    const viewButtons = fixture.debugElement.queryAll(
      By.css('button.grn-dark[type="button"]')
    );
    const cancelButtons = fixture.debugElement.queryAll(
      By.css('button.out_grn-dark[type="button"]')
    );
    
    expect(viewButtons.length).toBeGreaterThan(0);
    expect(cancelButtons.length).toBeGreaterThan(0);
    
    // This is a more reliable approach since the ngIf directive may make the buttons 
    // not exist in the DOM rather than just being hidden
    expect(fixture.debugElement.query(
      By.css('button[type="submit"]')
    )).toBeFalsy();
  });
});
