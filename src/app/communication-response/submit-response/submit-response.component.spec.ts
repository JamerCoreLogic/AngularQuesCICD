import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SubmitResponseComponent } from './submit-response.component';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from './../../services/communication.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { SharedPipesModule } from 'src/app/shared-material/shared-pipes.module';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { CommunicationHeaderComponent } from '../communication-header/communication-header.component';
import { CommunicationFooterComponent } from '../communication-footer/communication-footer.component';
import { By } from '@angular/platform-browser';
import Swal from 'sweetalert2';

describe('SubmitResponseComponent', () => {
  let component: SubmitResponseComponent;
  let fixture: ComponentFixture<SubmitResponseComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCommunicationService: jasmine.SpyObj<CommunicationService>;
  let mockSpinner: jasmine.SpyObj<NgxSpinnerService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  const mockDetails = {
    adjusterRequestId: 123,
    title: 'Test Title',
    assignment: 'Test Assignment',
    location: 'Test Location',
    description: 'Test Description'
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(true));

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue(mockDialogRef);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCommunicationService = jasmine.createSpyObj('CommunicationService', 
      ['GetDataForBindUIScreen', 'SubmitResponce']);
    mockSpinner = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [ 
        SubmitResponseComponent,
        CommunicationHeaderComponent,
        CommunicationFooterComponent 
      ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedMaterialModule,
        SharedPipesModule,
        NgxSpinnerModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: CommunicationService, useValue: mockCommunicationService },
        { provide: NgxSpinnerService, useValue: mockSpinner },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: 'test-token' })
          }
        }
      ]
    })
    .compileComponents();

    mockCommunicationService.GetDataForBindUIScreen.and.returnValue(of({ 
      data: [mockDetails] 
    }));

    fixture = TestBed.createComponent(SubmitResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required fields', () => {
    expect(component.acceptanceForm.get('xactNetAddress')).toBeTruthy();
    expect(component.acceptanceForm.get('inspectLossTime')).toBeTruthy();
    expect(component.acceptanceForm.get('estimateReturnTime')).toBeTruthy();
    expect(component.acceptanceForm.get('remarks')).toBeTruthy();
  });

  it('should load details on init', () => {
    expect(component.details).toEqual(mockDetails);
    expect(component.adjusterRequestId).toBe(123);
  });

  it('should validate required fields', () => {
    const form = component.acceptanceForm;
    expect(form.valid).toBeFalsy();

    form.controls['xactNetAddress'].setValue('test@xact.net');
    form.controls['inspectLossTime'].setValue(2);
    form.controls['estimateReturnTime'].setValue(3);
    
    expect(form.valid).toBeTruthy();
  });

  it('should show validation errors when submitted with empty form', () => {
    component.onSubmit();
    expect(component.isSubmitted).toBeTrue();
    expect(component.acceptanceForm.valid).toBeFalse();
  });

  it('should submit form successfully', fakeAsync(() => {
    mockCommunicationService.SubmitResponce.and.returnValue(of({ success: true }));
    
    component.acceptanceForm.patchValue({
      xactNetAddress: 'test@xact.net',
      inspectLossTime: 2,
      estimateReturnTime: 3,
      remarks: 'Test remarks'
    });

    component.onSubmit();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
  }));

  it('should handle submission error', fakeAsync(() => {
    mockCommunicationService.SubmitResponce.and.returnValue(of({ 
      success: false, 
      message: 'Error message' 
    }));

    component.acceptanceForm.patchValue({
      xactNetAddress: 'test@xact.net',
      inspectLossTime: 2,
      estimateReturnTime: 3
    });

    const sweetAlertSpy = spyOn(Swal, 'fire');
    component.onSubmit();
    tick();

    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockSpinner.hide).toHaveBeenCalled();
    expect(sweetAlertSpy).toHaveBeenCalled();
  }));

  it('should show confirmation dialog on cancel', fakeAsync(() => {
    const sweetAlertSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    component.thanksPage();
    tick();

    expect(sweetAlertSpy).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['communication/thanks']);
  }));

  it('should render all form fields', () => {
    const xactNetInput = fixture.debugElement.query(By.css('input[formControlName="xactNetAddress"]'));
    const inspectLossInput = fixture.debugElement.query(By.css('input[formControlName="inspectLossTime"]'));
    const estimateReturnInput = fixture.debugElement.query(By.css('input[formControlName="estimateReturnTime"]'));
    const remarksTextarea = fixture.debugElement.query(By.css('textarea[formControlName="remarks"]'));

    expect(xactNetInput).toBeTruthy();
    expect(inspectLossInput).toBeTruthy();
    expect(estimateReturnInput).toBeTruthy();
    expect(remarksTextarea).toBeTruthy();
  });

  it('should display opportunity details correctly', () => {
    component.details = mockDetails;
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.opp')).nativeElement;
    expect(titleElement.textContent).toContain(mockDetails.title);
  });

  it('should apply danger class to invalid fields after submission', () => {
    component.onSubmit();
    fixture.detectChanges();

    const xactNetInput = fixture.debugElement.query(By.css('input[formControlName="xactNetAddress"]'));
    expect(xactNetInput.nativeElement.classList.contains('danger')).toBeTrue();
  });
});
