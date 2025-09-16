import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LossViewProfileComponent } from './loss-view-profile.component';
import { AdjustersService } from 'src/app/services/adjusters.service';
import { PhoneMaskPipe } from 'src/app/Pipes/phone-mask.pipe';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

describe('LossViewProfileComponent', () => {
  let component: LossViewProfileComponent;
  let fixture: ComponentFixture<LossViewProfileComponent>;
  let adjustersServiceSpy: jasmine.SpyObj<AdjustersService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LossViewProfileComponent>>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.Spy;
  
  const mockDialogData = {
    adjuster: {
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      location: 'Atlanta, GA'
    }
  };

  const mockViewProfileResponse = {
    data: [{
      userId: '123',
      name: 'John Doe',
      emailAddress: 'john@example.com',
      mobile: '1234567890',
      address1: 'Atlanta, GA',
      profilePic: 'base64string',
      additionalAndInternalInformation: [{
        residential_Field_Grade: 'A',
        commercial_Field_Grade: 'B',
        liability_Grade: 'C',
        inspector_Grade: 'A',
        desk_Grade: 'B',
        claims_Supervisor_Grade: 'A',
        file_Review_Grade: 'B',
        prevetting: 'A',
        headLineOverview: 'Overview',
        internalNotes: 'Notes',
        goodCandidateFor: 'Commercial'
      }],
      deploymentData: [{
        availabilityStatus: 'Available'
      }]
    }]
  };

  beforeEach(async () => {
    adjustersServiceSpy = jasmine.createSpyObj('AdjustersService', ['GetViewProfileByUserId']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Set up localStorage spy once
    localStorageSpy = spyOn(localStorage, 'getItem');
    localStorageSpy.and.callFake((key: string) => {
      if (key === 'LoggedUserType') {
        return '1';
      }
      return null;
    });
    spyOn(localStorage, 'setItem');

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedMaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgxSpinnerModule
      ],
      declarations: [LossViewProfileComponent,PhoneMaskPipe ],

      providers: [
        FormBuilder,
        { provide: AdjustersService, useValue: adjustersServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
        { provide: Router, useValue: routerSpy },
    

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LossViewProfileComponent);
    component = fixture.componentInstance;
    adjustersServiceSpy.GetViewProfileByUserId.and.returnValue(of(mockViewProfileResponse));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data from dialog', () => {
    expect(component.data.adjuster).toEqual(mockDialogData.adjuster);
  });

  it('should create and disable internal info form', () => {
    expect(component.internalInfoForm).toBeDefined();
    expect(component.internalInfoForm.disabled).toBeTrue();
  });

  it('should load profile data on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(adjustersServiceSpy.GetViewProfileByUserId).toHaveBeenCalledWith(mockDialogData.adjuster.userId);
    expect(component.viewProfile).toEqual(mockViewProfileResponse.data[0]);
    expect(component.qustionList).toEqual(mockViewProfileResponse.data[0].additionalAndInternalInformation[0]);
    expect(component.deploymentData).toEqual(mockViewProfileResponse.data[0].deploymentData[0]);
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
  }));

  it('should handle error when loading profile data', fakeAsync(() => {
    adjustersServiceSpy.GetViewProfileByUserId.and.returnValue(throwError(() => new Error('Test error')));
    
    component.ngOnInit();
    tick();

    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
  }));

  it('should transform profile picture correctly', () => {
    component.viewProfile = { profilePic: 'testBase64String' };
    
    const result = component.transform();
    
    expect(result).toBe('data:image/png;base64,testBase64String');
  });

  it('should return undefined when no profile picture exists', () => {
    component.viewProfile = { profilePic: null };
    
    const result = component.transform();
    
    expect(result).toBeUndefined();
  });

  it('should navigate to view profile and close dialog', () => {
    component.viewAdjusterProfile();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('viewProfile', JSON.stringify({ userId: mockDialogData.adjuster.userId }));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/main/admin/view-profile']);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should navigate to edit profile and close dialog', () => {
    component.editAdjusterProfile();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('editUser', JSON.stringify(mockDialogData.adjuster));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/main/admin/add-user-tabs']);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should format label correctly', () => {
    const testCases = [
      { input: 'camelCase', expected: 'Camel Case' },
      { input: 'snake_case', expected: 'Snake case' },
      { input: 'simple', expected: 'Simple' },
      { input: 'MultipleWordsHere', expected: 'Multiple Words Here' }
    ];

    testCases.forEach(({ input, expected }) => {
      expect(component.formatLabel(input)).toBe(expected);
    });
  });

  it('should have correct field grades', () => {
    expect(component.fieldGrades).toEqual(['A', 'B', 'C', 'D', 'X']);
  });

  it('should have correct QB ratings', () => {
    expect(component.QbRating).toContain('Pre-vet field residential');
    expect(component.QbRating).toContain('Pre-vet field commercial');
    expect(component.QbRating).toContain('Pre-vet desk residential');
    expect(component.QbRating).toContain('Pre-vet desk commercial');
    expect(component.QbRating).toContain('Pre-Vetted Proctor');
    expect(component.QbRating).toContain('Vetted Proctor');
  });

  it('should patch form values from question list', fakeAsync(() => {
    component.ngOnInit();
    tick();

    const formValues = component.internalInfoForm.getRawValue();
    expect(formValues.residential_Field_Grade).toBe(mockViewProfileResponse.data[0].additionalAndInternalInformation[0].residential_Field_Grade);
    expect(formValues.commercial_Field_Grade).toBe(mockViewProfileResponse.data[0].additionalAndInternalInformation[0].commercial_Field_Grade);
    expect(formValues.liability_Grade).toBe(mockViewProfileResponse.data[0].additionalAndInternalInformation[0].liability_Grade);
  }));

  it('should check if user is admin', () => {
    expect(localStorageSpy).toHaveBeenCalledWith('LoggedUserType');
    expect(component.loggedUserTypeCheck).toBe(1);
  });
});
