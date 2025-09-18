import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AQManageFormsComponent } from './manage-forms.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AQParameterService, AQStates, ProgramService } from '@agenciiq/aqadmin';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AQSession } from 'src/app/global-settings/session-storage';
import { AQFormsService } from '@agenciiq/aqforms';
import { AQUserInfo } from '@agenciiq/login';
import { LOBService, ILOBGetRequest } from '@agenciiq/quotes';
import { MgaConfigService } from '@agenciiq/mga-config';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { SetDateService } from 'src/app/shared/services/setDate/set-date.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

describe('ManageFormsComponent', () => {
  let component: AQManageFormsComponent;
  let fixture: ComponentFixture<AQManageFormsComponent>;
  let formBuilder: FormBuilder;
  let aqSate: AQStates;
  let parameter: AQParameterService;
  let loaderService: LoaderService;
  let router: Router;
  let aqSession: AQSession;
  let formsService: AQFormsService;
  let userInfo: AQUserInfo;
  let lOBService: LOBService;
  let mgaConfig: MgaConfigService;
  let programService: ProgramService;
  let trimValueService: TrimValueService;
  let popup: PopupService;
  let setDateService: SetDateService;
  let dataSubject = new Subject<any>();
  let activatedRoute: ActivatedRoute;



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [AQManageFormsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        AQStates,
        AQParameterService,
        LoaderService,
        Router,
        AQSession,
        AQFormsService,
        AQUserInfo,
        LOBService,
        MgaConfigService,
        ProgramService,
        TrimValueService,
        PopupService,
        SetDateService,
        { provide: ActivatedRoute, useValue: { data: dataSubject.asObservable() } },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQManageFormsComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    aqSate = TestBed.inject(AQStates);
    parameter = TestBed.inject(AQParameterService);
    formsService = TestBed.inject(AQFormsService);
    loaderService = TestBed.inject(LoaderService);
    userInfo = TestBed.inject(AQUserInfo);
    lOBService = TestBed.inject(LOBService);
    popup = TestBed.inject(PopupService);
    setDateService = TestBed.inject(SetDateService);
    mgaConfig = TestBed.inject(MgaConfigService);
    trimValueService = TestBed.inject(TrimValueService);
    router = TestBed.inject(Router);
    aqSession = TestBed.inject(AQSession);
    activatedRoute = TestBed.inject(ActivatedRoute);
    programService = TestBed.inject(ProgramService);
    spyOn(aqSession, 'getData').and.returnValue({
      LOB: 'WC',
      // Add other necessary properties as needed
    });

    component.aqFormsGroup = formBuilder.group({
      Lob: [''],
      SelectedLOB: formBuilder.array([]),
      QuoteType: [''],
      State: [''],
      EffectiveFrom: [''],
      EffectiveTo: [''],
      IsActive: [true],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  //ngOnInit method
  it('should initialize properties and call related methods in ngOnInit', () => {
    // Arrange: Mock necessary data and methods

    // Mock userInfo.UserId() return value
    spyOn(userInfo, 'UserId').and.returnValue(123);

    // Mock aqSession.getData('formData') return value
    // const mockFormData = { formName: 'Test Form' };
    // spyOn(aqSession, 'getData').and.returnValue(mockFormData);

    // Spy on component methods
    const creatingFormsSpy = spyOn(component, 'creatingForms').and.callThrough();
    const resolveDataSpy = spyOn(component, 'ResolveData').and.callThrough();
    const patchValueFormSpy = spyOn(component, 'patchValueForm').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert: Check property initializations
    expect(component.fileName).toBe('');
    expect(component.base64EncodedExcel).toBe('');
    expect(component.formId).toBe(0);
    expect(component.userId).toBe(123);
    //expect(component.formData).toEqual(mockFormData);

    // Assert: Check method calls
    expect(creatingFormsSpy).toHaveBeenCalled();
    expect(resolveDataSpy).toHaveBeenCalled();
    expect(patchValueFormSpy).toHaveBeenCalled();
  });


  //creatingForms method
  it('should create a form group with expected controls in creatingForms', () => {
    // Act: Call the method
    component.creatingForms();

    // Assert: Check the form group
    expect(component.aqFormsGroup).toBeDefined();
    expect(component.aqFormsGroup instanceof FormGroup).toBeTrue();

    const formGroup = component.aqFormsGroup;

    // Check individual controls
    expect(formGroup.contains('Lob')).toBeTrue();
    expect(formGroup.contains('SelectedLOB')).toBeTrue();
    expect(formGroup.contains('QuoteType')).toBeTrue();
    expect(formGroup.contains('State')).toBeTrue();
    expect(formGroup.contains('EffectiveFrom')).toBeTrue();
    expect(formGroup.contains('EffectiveTo')).toBeTrue();
    expect(formGroup.contains('IsActive')).toBeTrue();

    // Check default values
    expect(formGroup.get('Lob')?.value).toBe('');
    expect(formGroup.get('SelectedLOB') instanceof FormArray).toBeTrue();
    expect((formGroup.get('SelectedLOB') as FormArray).length).toBe(0);
    expect(formGroup.get('QuoteType')?.value).toBe('');
    expect(formGroup.get('State')?.value).toBe('');
    expect(formGroup.get('EffectiveFrom')?.value).toBe('');
    expect(formGroup.get('EffectiveTo')?.value).toBe('');
    expect(formGroup.get('IsActive')?.value).toBeTrue();

    // Check validators
    const lobControl = formGroup.get('Lob');
    lobControl?.setValue('');
    expect(lobControl?.valid).toBeFalse();
    lobControl?.setValue('Test Lob');
    expect(lobControl?.valid).toBeTrue();

    const quoteTypeControl = formGroup.get('QuoteType');
    quoteTypeControl?.setValue('');
    expect(quoteTypeControl?.valid).toBeFalse();
    quoteTypeControl?.setValue('Test Quote');
    expect(quoteTypeControl?.valid).toBeTrue();
  });



  it('should set form state when formId exists in session', () => {
    // spyOn(aqSession, 'getData').and.callFake((key: string) => {
    //   if (key === 'formId') return 123; // Simulate formId present
    // });

    spyOn(component, 'getFormById');

    component.patchValueForm();

    expect(component.isFileExists).toBeTrue();
    expect(component.isvalidExtension).toBeTrue();
    expect(component.getFormById).toHaveBeenCalled();
    expect(component.FormName).toBe('Edit Form');
    expect(component.isEdit).toBeTrue();
  });

  it('should patch form controls and set validators when formId does not exist', () => {
    // spyOn(aqSession, 'getData').and.callFake((key: string) => {
    //   if (key === 'formId') return null; // Simulate no formId
    // });

    spyOn(component, 'filteStateList');

    component.patchValueForm();

    expect(component.FormName).toBe('Add Form');
    expect(component.isEdit).toBeFalse();
    expect(component.BusinessLine.value).toBe('PP');
    expect(component.FormType.value).toBe('TestForm');
    expect(component.State.value).toBe('TestState');

    expect(component.filteStateList).toHaveBeenCalledWith('PP');

    expect(component.BusinessLine.disabled).toBeTrue();
    expect(component.FormType.disabled).toBeTrue();
    expect(component.State.disabled).toBeTrue();

    // If LOB is 'PP', validators should be set
    expect(component.SelectedLOB.validator).toBeTruthy();
  });

  it('should update minDate on EffectiveFrom valueChanges', () => {
    //spyOn(aqSession, 'getData').and.returnValue(null);

    component.patchValueForm();

    const testDate = '2024-05-29';
    component.EffectiveFrom.setValue(testDate);

    expect(component.minDate).toEqual(new Date(testDate));
  });
});
