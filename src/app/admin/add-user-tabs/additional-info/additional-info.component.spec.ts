import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdditionalInfoComponent } from './additional-info.component';
import { ReactiveFormsModule, FormsModule, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/services/auth.service';
import { ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Swal, { SweetAlertResult } from 'sweetalert2';

class MockAuthService {
  fetchData() {
    return of({});
  }
}

describe('AdditionalInfoComponent (Extended Tests)', () => {
  let component: AdditionalInfoComponent;
  let fixture: ComponentFixture<AdditionalInfoComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalInfoComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SharedMaterialModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ElementRef, useValue: new ElementRef(null) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // Initialize the form as it is done in the component
    component.additionalInfoForm = formBuilder.group({
      adjusterInformationId: [1],
      approximate_Date_I_Began_Adjusting: [null],
      i_Am_Interested_In_The_Following_Assignments: formBuilder.array([]),
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: [null, [Validators.required]],
      location_Preference: [null, [Validators.required]],
      largest_Claim_I_Have_Handled: [null, [Validators.min(0)]],
      xactNetAddressSkill: [],
      writing_Denial_Or_Coverage_Letters: [],
      experience_With_PAs: [],
      experience_With_AOB: [],
      fluent_In_Spanish: [],
      what_Sets_You_Apart_From_Other_Adjusters: [],
      iA_Firms_I_Have_Worked_With: [],
      carriers_You_Have_Worked_For: [],
      residential_Property_Desk: [null, [Validators.required]],
      residential_Property_Field: [null, [Validators.required]],
      commercial_Property_Desk: [],
      commercial_Property_Field: [],
      flood_Desk: [],
      flood_Field: [],
      casualty: [],
      auto: [],
      auto_Appraisal: [],
      heavy_Equipment: [],
      on_SceneInvestigations: [],
      homeowner_Liability: [],
      inland_Marine: [],
      general_Liability: [],
      construction: [],
      construction_Defect: [],
      sinkhole: [],
      water_Mitigation_Estimating: [],
      crop: [],
      large_Loss_Contents: [],
      large_Loss_Fire: [],
      large_Loss_Commercial: [],
      litigation: [],
      high_End_Residential: [],
      business_Interruption: [],
      mobile_Homes: [],
      municipality_Losses: [],
      claims_Supervisor: [],
      earthquake: [],
      environment_Disaster: [],
      xactimate_Estimating: [null, [Validators.required]],
      xactimate_Collaboration: [],
      xactAnalysis: [],
      mitchell: [],
      symbility: [],
      guidewire: [],
      hover: [],
      claimXperience: [],
      plnar: [],
      fileTrac: [null, [Validators.required]],
      clickClaims: [],
      resume: [],
      file_Review_Experience: [],
      bio_Or_Mini_Resume: [null, [Validators.maxLength(1000)]],
      userId: [],
      createdBy: [Number(sessionStorage.getItem('LoggeduserId'))],
    });
    fixture.detectChanges();
  });

  // Basic existence tests
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required controls', () => {
    expect(component.additionalInfoForm).toBeDefined();
    expect(Object.keys(component.additionalInfoForm.controls))
      .toContain('approximate_Date_I_Began_Adjusting');
    expect(Object.keys(component.additionalInfoForm.controls))
      .toContain('residential_Property_Desk');
  });

  // Form validation scenarios
  it('should mark the form as invalid if required fields are missing', () => {
    component.additionalInfoForm.patchValue({
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: null,
      residential_Property_Desk: null,
      residential_Property_Field: null,
    });
    expect(component.additionalInfoForm.valid).toBeFalse();
  });

  it('should mark the form as valid if all required fields are filled', () => {
    component.additionalInfoForm.patchValue({
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: 'CAT',
      location_Preference: ['In State'],
      residential_Property_Desk: 'Intermediate',
      residential_Property_Field: 'Beginner',
      xactimate_Estimating: 'Advanced',
      fileTrac: 'Beginner',
    });
    expect(component.additionalInfoForm.valid).toBeTrue();
  });

  it('should add a value to i_Am_Interested_In_The_Following_Assignments on checkbox check', () => {
    const event = { checked: true, source: { value: 'Field Assignments' } };
    component.onCheckboxChangeforAssignments(event);
    const formArray = component.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
    expect(formArray.value).toContain('Field Assignments');
  });

  it('should remove a value from i_Am_Interested_In_The_Following_Assignments on checkbox uncheck', () => {
    const formArray = component.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
    formArray.push(new FormControl('Field Assignments'));
    const event = { checked: false, source: { value: 'Field Assignments' } };
    component.onCheckboxChangeforAssignments(event);
    expect(formArray.value).not.toContain('Field Assignments');
  });

  // Date validation tests
  it('should invalidate approximate_Date_I_Began_Adjusting if date is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    component.additionalInfoForm.patchValue({ approximate_Date_I_Began_Adjusting: futureDate });
    component.listenForDateInputChanges();
    fixture.detectChanges();
    const control = component.additionalInfoForm.get('approximate_Date_I_Began_Adjusting');
    expect(control?.valid).toBeFalse();
    expect(control?.hasError('futureDate')).toBeTrue();
  });

  it('should invalidate approximate_Date_I_Began_Adjusting if date is before 1950', () => {
    const outOfRangeDate = new Date('1900-01-01');
    component.additionalInfoForm.patchValue({ approximate_Date_I_Began_Adjusting: outOfRangeDate });
    component.listenForDateInputChanges();
    fixture.detectChanges();
    const control = component.additionalInfoForm.get('approximate_Date_I_Began_Adjusting');
    expect(control?.valid).toBeFalse();
    expect(control?.hasError('dateRange')).toBeTrue();
  });

  it('should validate approximate_Date_I_Began_Adjusting if date is within valid range', () => {
    const validDate = new Date('2000-01-01');
    component.additionalInfoForm.patchValue({ approximate_Date_I_Began_Adjusting: validDate });
    component.listenForDateInputChanges();
    fixture.detectChanges();
    const control = component.additionalInfoForm.get('approximate_Date_I_Began_Adjusting');
    expect(control?.valid).toBeTrue();
  });

  // File upload logic

  
  
  
  


  it('should show error if file size exceeds 10MB', () => {
    const largeContent = new Blob([new Array(11 * 1024 * 1024).join('a')], { type: 'application/pdf' });
    const largeFile = new File([largeContent], 'large.pdf');
    const event = { target: { files: [largeFile] } };
    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve({} as SweetAlertResult<any>));
    component.onFileSelected(event as any);
    expect(component.isFileUploaded).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: '',
      text: 'File size exceeds the 10MB limit.',
      icon: 'error',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    }));
  });

  // Lifecycle hook tests
  it('should call listenForDateInputChanges and isAdditionalInfoFormView on ngOnInit', () => {
    spyOn(component, 'listenForDateInputChanges').and.callThrough();
    spyOn(component, 'isAdditionalInfoFormView').and.callThrough();
    component.ngOnInit();
    expect(component.listenForDateInputChanges).toHaveBeenCalled();
    expect(component.isAdditionalInfoFormView).toHaveBeenCalled();
  });

  // Input/Output and conditional logic
  it('should patch form values in FetchUser if data and skillsAndWorkHistory are present', () => {
    component.data = {
      fName: 'John',
      lName: 'Doe',
      skillsAndWorkHistory: [{
        approximate_Date_I_Began_Adjusting: '2000-01-01T00:00:00Z',
        i_Am_Interested_In_The_Following_Assignments: ['Field Assignments'],
        what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: 'CAT'
      }]
    };
    component.FetchUser();
    expect(component.additionalInfoForm.get('what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned')?.value).toBe('CAT');
    const assignments = component.additionalInfoForm.get('i_Am_Interested_In_The_Following_Assignments') as FormArray;
    expect(assignments.value).toContain('Field Assignments');
  });

  it('should not patch form if skillsAndWorkHistory is absent', () => {
    component.data = {};
    component.FetchUser();
    expect(component.additionalInfoForm.get('what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned')?.value).toBeNull();
  });

  // isAdditionalInfoFormValid tests
  it('should return form raw value if userType == 1', () => {
    component.userType = 1;
    const result = component.isAdditionalInfoFormValid();
    expect(result).toEqual({ additionalInfoForm: component.additionalInfoForm.getRawValue() });
  });

  it('should show warning and return false if form is invalid and userType != 1', () => {
    spyOn(Swal, 'fire');
    component.userType = 2;
    component.additionalInfoForm.get('what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned')?.setValue(null);
    const result = component.isAdditionalInfoFormValid();
    expect(result).toBeFalse();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('should return form raw value if form is valid and userType != 1', () => {
    component.userType = 2;
    component.additionalInfoForm.patchValue({
      what_Type_Of_Claims_Would_You_Prefer_To_Be_Assigned: 'CAT',
      location_Preference: ['Local'],
      residential_Property_Desk: 'Intermediate',
      residential_Property_Field: 'Beginner',
      xactimate_Estimating: 'Advanced',
      fileTrac: 'Beginner'
    });
    const result = component.isAdditionalInfoFormValid();
    expect(result).toEqual({ additionalInfoForm: component.additionalInfoForm.getRawValue() });
  });

  // Utility methods
  it('should prevent entering e, E, +, -, . in restrictEnteringE method', () => {
    const input = document.createElement('input');
    input.value = '123';
    const event = new KeyboardEvent('keydown', { key: 'e' });
    Object.defineProperty(event, 'target', { value: input });
  
    spyOn(event, 'preventDefault');
    
    component.restrictEnteringE(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent other keys in restrictEnteringE method', () => {
    const input = document.createElement('input');
    input.value = '123';
    const event = new KeyboardEvent('keydown', { key: '1' });
    Object.defineProperty(event, 'target', { value: input });
  
    spyOn(event, 'preventDefault');
    
    component.restrictEnteringE(event);
    
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should scroll to paragraph if element exists', () => {
    const div = document.createElement('div');
    div.id = 'myParagraph';
    document.body.appendChild(div);
    spyOn(div, 'scrollIntoView');
    component.scrollToParagraph('myParagraph');
    expect(div.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(div);
  });

  it('should return true if form is dirty', () => {
    component.additionalInfoForm.markAsDirty();
    expect(component.isAdditionalInfoFormDirty()).toBeTrue();
  });


});
