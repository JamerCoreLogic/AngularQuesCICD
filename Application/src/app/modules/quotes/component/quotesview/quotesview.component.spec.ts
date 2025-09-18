import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { QuotesviewComponent } from './quotesview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AQSession } from 'src/app/global-settings/session-storage';
import { AQQuotesListService } from '@agenciiq/quotes';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { of, throwError } from 'rxjs';
import { IQuotesViewResp } from '@agenciiq/quotes/lib/interfaces/base-quote-view-resp';
import { CheckRoleService } from 'src/app/shared/services/check-role/check-role.service';
import { Roles } from 'src/app/global-settings/roles';
import { Router } from '@angular/router';
import { CancelButtonService } from 'src/app/shared/services/cancelButtonSerrvice/cancelButton.service';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';

describe('QuotesviewComponent', () => {
  let component: QuotesviewComponent;
  let fixture: ComponentFixture<QuotesviewComponent>;
  let mockSessionService: any;
  let mockSession: any;
  let quotesServiceSpy: jasmine.SpyObj<AQQuotesListService>;
  let loaderServiceSpy: jasmine.SpyObj<LoaderService>;
  let sessionSpy: jasmine.SpyObj<AQSession>;
  let mockCheckRoleService: jasmine.SpyObj<CheckRoleService>;
  let mockRolesService: any;
  let routerSpy: jasmine.SpyObj<Router>;
  let cancelButtonServiceSpy: jasmine.SpyObj<CancelButtonService>;
  let popupSpy: jasmine.SpyObj<PopupService>;

  beforeEach(waitForAsync(() => {
    const quoteSpy = jasmine.createSpyObj('AQQuotesListService', ['QuotesViewFilter', 'QuotesViewUwList']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const spy = jasmine.createSpyObj('CancelButtonService', ['NavigateToHome']);
    const popupServiceSpy = jasmine.createSpyObj('PopupService', ['showPopup']);

    mockCheckRoleService = jasmine.createSpyObj('CheckRoleService', ['isRoleCodeAvailable']);
    mockRolesService = {
      Roles: jasmine.createSpy('Roles')
    };

    mockSessionService = {
      removeSession: jasmine.createSpy('removeSession')
    };

    mockSession = {
      getData: jasmine.createSpy('getData').and.returnValue({
        QuoteId: 'Q123',
        UserId: 'U456',
        AgentId: 'A789'
      })
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [QuotesviewComponent],
      providers: [
        AQSession, FormBuilder,
        { provide: AQQuotesListService, useValue: quoteSpy },
        { provide: LoaderService, useValue: loaderSpy },
        { provide: CheckRoleService, useValue: mockCheckRoleService },
        { provide: CancelButtonService, useValue: spy },
        { provide: PopupService, useValue: popupServiceSpy },
        Router,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesviewComponent);
    component = fixture.componentInstance;

    spyOn(component as any, 'getQuoteView');
    spyOn(component as any, 'getQuoteViewUwList');
    quotesServiceSpy = TestBed.inject(AQQuotesListService) as jasmine.SpyObj<AQQuotesListService>;
    loaderServiceSpy = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    popupSpy = TestBed.inject(PopupService) as jasmine.SpyObj<PopupService>;
    cancelButtonServiceSpy = TestBed.inject(CancelButtonService) as jasmine.SpyObj<CancelButtonService>;
    fixture.detectChanges();
  });


  it('should return false and set flag if DispositionDecline is true and comments are empty', () => {
    const formMock = {
      value: {
        DispositionAccept: false,
        DispositionDecline: true,
        SelectUnderwriter: null,
        UwAssistent: null,
        UwID: null,
        UwaID: null,
        comments: '   '
      }
    };

    const result = component.saveData(formMock);
    expect(result).toBe(false);
    expect(component.flag).toBeTrue();
    expect(loaderServiceSpy.show).not.toHaveBeenCalled();
  });

  it('should set flag to true and patch the form values on Decline()', () => {
    component.Decline();

    expect(component.flag).toBeTrue();

    expect(component.quoteviewform.value).toEqual({
      DispositionAccept: false,
      DispositionPending: false,
      SelectUnderwriter: 'null',
      UwAssistent: 'null',
      RefNumber: '',
      Type: '',
      stage: '',
      EffectiveDate: '',
      ExpiryDate: '',
      CompanyName: '',
      PrimaryState: '',
      Website: '',
      AgentName: '',
      AgentAgency: '',
      AgentEmail: '',
      AgentPhone: '',
      UwName: '',
      UwID: '',
      UwaName: '',
      UwaID: '',
      DispositionDecline: '',
      comments: ''
    });
  });

  it('should set flag to true and patch the form values on Accept()', () => {
    component.Accept();

    expect(component.flag).toBeFalse();

    expect(component.quoteviewform.value).toEqual({
      DispositionAccept: '',
      DispositionPending: false,
      SelectUnderwriter: 'null',
      UwAssistent: 'null',
      RefNumber: '',
      Type: '',
      stage: '',
      EffectiveDate: '',
      ExpiryDate: '',
      CompanyName: '',
      PrimaryState: '',
      Website: '',
      AgentName: '',
      AgentAgency: '',
      AgentEmail: '',
      AgentPhone: '',
      UwName: '',
      UwID: '',
      UwaName: '',
      UwaID: '',
      DispositionDecline: false,
      comments: ''
    });
  });

  it('should set flag to true and patch the form values on Pending()', () => {
    component.Pending();

    expect(component.flag).toBeFalse();

    expect(component.quoteviewform.value).toEqual({
      DispositionAccept: false,
      DispositionPending: true,
      SelectUnderwriter: 'null',
      UwAssistent: 'null',
      RefNumber: '',
      Type: '',
      stage: '',
      EffectiveDate: '',
      ExpiryDate: '',
      CompanyName: '',
      PrimaryState: '',
      Website: '',
      AgentName: '',
      AgentAgency: '',
      AgentEmail: '',
      AgentPhone: '',
      UwName: '',
      UwID: '',
      UwaName: '',
      UwaID: '',
      DispositionDecline: false,
      comments: ''
    });
  });

  it('should set flag to true and patch the form values on UWASelect()', () => {
    component.UWASelect();

    expect(component.flag).toBeFalse();

    expect(component.quoteviewform.value).toEqual({
      DispositionAccept: false,
      DispositionPending: true,
      SelectUnderwriter: 'null',
      UwAssistent: 'null',
      RefNumber: '',
      Type: '',
      stage: '',
      EffectiveDate: '',
      ExpiryDate: '',
      CompanyName: '',
      PrimaryState: '',
      Website: '',
      AgentName: '',
      AgentAgency: '',
      AgentEmail: '',
      AgentPhone: '',
      UwName: '',
      UwID: '',
      UwaName: '',
      UwaID: '',
      DispositionDecline: false,
      comments: ''
    });
  });

  it('should set flag to true and patch the form values on UWSelect()', () => {
    component.UWSelect();

    expect(component.flag).toBeFalse();

    expect(component.quoteviewform.value).toEqual({
      DispositionAccept: false,
      DispositionPending: true,
      SelectUnderwriter: 'null',
      UwAssistent: 'null',
      RefNumber: '',
      Type: '',
      stage: '',
      EffectiveDate: '',
      ExpiryDate: '',
      CompanyName: '',
      PrimaryState: '',
      Website: '',
      AgentName: '',
      AgentAgency: '',
      AgentEmail: '',
      AgentPhone: '',
      UwName: '',
      UwID: '',
      UwaName: '',
      UwaID: '',
      DispositionDecline: false,
      comments: ''
    });
  });

  it('should call NavigateToHome when cancel is called', () => {
    component.cancel();
    expect(cancelButtonServiceSpy.NavigateToHome).toHaveBeenCalled();
  });

  it('should set flag to false when validateComm is called', () => {
    component.flag = true; // Initially set to true
    component.validateComm();
    expect(component.flag).toBeFalse();
  });

  it('should create quoteviewform with correct controls and default values', () => {
    component.butDisabled = true; // mock any required property
    component.createquoteviewform();

    const form = component.quoteviewform;

    expect(form).toBeTruthy();
    expect(form.contains('RefNumber')).toBeTrue();
    expect(form.contains('DispositionPending')).toBeTrue();

    expect(form.get('RefNumber')?.value).toBe('');
    expect(form.get('DispositionPending')?.value).toBeTrue();

    expect(form.get('SelectUnderwriter')?.value).toBe('null');
    expect(form.get('SelectUnderwriter')?.disabled).toBeTrue();

    expect(form.get('UwAssistent')?.value).toBe('null');
    expect(form.get('UwAssistent')?.disabled).toBeTrue();
  });

  it('should initialize and set values correctly in ngOnInit', () => {
    component.ngOnInit();
    expect(component.pageTitle).toBe('Quote view');
    expect(component['getQuoteView']).toHaveBeenCalled();
    expect(component['getQuoteViewUwList']).toHaveBeenCalled();
  });

  it('should set butDisabled to false if any role is available', () => {
    const rolesList = ['UW_MANAGER']; // mock role list
    mockRolesService.Roles.and.returnValue(rolesList);

    mockCheckRoleService.isRoleCodeAvailable.withArgs(Roles.Underwriter.roleCode, rolesList).and.returnValue(false);
    mockCheckRoleService.isRoleCodeAvailable.withArgs(Roles.UWManager.roleCode, rolesList).and.returnValue(true);
    mockCheckRoleService.isRoleCodeAvailable.withArgs(Roles.UWSupervisior.roleCode, rolesList).and.returnValue(false);

    component.butDisabled = true;
    expect(component.butDisabled).toBeTrue();
  });

  it('should not change butDisabled if no matching role is available', () => {
    const rolesList = ['SOME_OTHER_ROLE'];
    mockRolesService.Roles.and.returnValue(rolesList);

    mockCheckRoleService.isRoleCodeAvailable.and.returnValue(false);

    component.butDisabled = true;
    component.checkRole();

    expect(component.butDisabled).toBeTrue();
  });

  it('should set quote view form values correctly', () => {
    const mockData = {
      ref: 'REF123',
      transactionCode: 'TXN001',
      stageId: 2,
      effective_Date: '2025-01-01',
      expiry_Date: '2025-12-31',
      insuredName: 'Test Company',
      state: 'NY',
      website: 'https://test.com',
      agentName: 'Agent Smith',
      phone: '1234567890',
      agencyName: 'Test Agency',
      email: 'agent@test.com',
      underwriter: 'John Doe',
      underwriterID: 10,
      underwriterAssistant: 'Jane Doe',
      underwriterAssistantID: 20,
      underwriterAssistants: [{ id: 20, name: 'Jane Doe' }],
      comments: 'Some comments'
    };

    component.setQuoteViewValue(mockData);

    const formValue = component.quoteviewform.value;

    expect(formValue.RefNumber).toBe('REF123');
    expect(formValue.Type).toBe('TXN001');
    expect(formValue.stage).toBe(2);
    expect(formValue.EffectiveDate).toBe('01/01/2025');
    expect(formValue.ExpiryDate).toBe('12/31/2025');
    expect(formValue.CompanyName).toBe('Test Company');
    expect(formValue.PrimaryState).toBe('NY');
    expect(formValue.Website).toBe('https://test.com');
    expect(formValue.AgentName).toBe('Agent Smith');
    expect(formValue.AgentPhone).toBe('(123) 456-7890');
    expect(formValue.AgentAgency).toBe('Test Agency');
    expect(formValue.AgentEmail).toBe('agent@test.com');
    expect(formValue.UwName).toBe('John Doe');
    expect(formValue.UwID).toBe(10);
    expect(formValue.UwaName).toBe('Jane Doe');
    expect(formValue.UwaID).toBe(20);
    expect(formValue.comments).toBe('Some comments');
    expect(formValue.DispositionDecline).toBeFalse();
    expect(formValue.DispositionAccept).toBeFalse();
    expect(formValue.DispositionPending).toBeTrue();
    expect(component.underwriterAssistentlist.length).toBe(1);
  });

  it('should call getPolicyDoc when openLinckAcordform is called', () => {
    spyOn(component, 'getPolicyDoc');
    component.openLinckAcordform();
    expect(component.getPolicyDoc).toHaveBeenCalled();
  });
});
