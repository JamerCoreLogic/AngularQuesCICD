import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewRequestComponent } from './view-request.component';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialog as MatDialog, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { SharedPipesModule } from 'src/app/shared-material/shared-pipes.module';
import { of, throwError } from 'rxjs';

describe('ViewRequestComponent', () => {
  let component: ViewRequestComponent;
  let fixture: ComponentFixture<ViewRequestComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;

  const mockCommunicationData = {
    data: 'test-communication-id'
  };

  const mockResponseData = {
    data: [{
      xactnetAddress: 'test@xactnet.com',
      insuredClaimantCanInspectLossInDays: 2,
      returnTheEstimateInDays: 3,
      remarks: 'Test remarks',
      title: 'Test Title',
      assignment: 'Test Assignment',
      location: 'Test Location',
      description: 'Test Description'
    }]
  };

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['GetCommunicationResponse']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ ViewRequestComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedMaterialModule,
        SharedPipesModule
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: MAT_DIALOG_DATA, useValue: mockCommunicationData }
      ]
    })
    .compileComponents();

    mockDashboardService.GetCommunicationResponse.and.returnValue(of(mockResponseData));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    expect(component.acceptanceForm).toBeDefined();
    expect(component.acceptanceForm.get('xactNetAddress')).toBeDefined();
    expect(component.acceptanceForm.get('inspectLossTime')).toBeDefined();
    expect(component.acceptanceForm.get('estimateReturnTime')).toBeDefined();
    expect(component.acceptanceForm.get('remarks')).toBeDefined();
  });

  it('should have required validators', () => {
    const form = component.acceptanceForm;
    expect(form.get('xactNetAddress')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('inspectLossTime')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('estimateReturnTime')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('remarks')?.hasValidator(Validators.required)).toBeFalse();
  });

  it('should fetch communication response on init when communicationID exists', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockDashboardService.GetCommunicationResponse).toHaveBeenCalledWith(mockCommunicationData.data);
    expect(mockSpinner.hide).toHaveBeenCalled();
    expect(component.details).toEqual(mockResponseData.data[0]);
  }));

  it('should patch form values after fetching communication response', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.acceptanceForm.get('xactNetAddress')?.value).toBe('test@xactnet.com');
    expect(component.acceptanceForm.get('inspectLossTime')?.value).toBe('2');
    expect(component.acceptanceForm.get('estimateReturnTime')?.value).toBe('3');
    expect(component.acceptanceForm.get('remarks')?.value).toBe('Test remarks');
    expect(component.acceptanceForm.disabled).toBeTrue();
  }));

  it('should handle error in fetching communication response', fakeAsync(() => {
    const error = new Error('Test error');
    mockDashboardService.GetCommunicationResponse.and.returnValue(throwError(() => error));
    
    component.ngOnInit();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
  }));

 



  it('should initialize with default values', () => {
    expect(component.isDeclined).toBeFalse();
    expect(component.isSubmitted).toBeUndefined();
  });

 
}); 