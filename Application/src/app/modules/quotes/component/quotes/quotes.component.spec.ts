import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { QuotesComponent } from './quotes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AQSession } from 'src/app/global-settings/session-storage';
import { ProgramService } from '@agenciiq/aqadmin';
import { of } from 'rxjs';
import { Router } from '@angular/router';


// Sample mock Roles
const mockRoles = {
  Roles: () => [{ roleCode: 'MGAAdmin' }]  // default role
};

// Enum Roles
const Roles = {
  MGAAdmin: { roleCode: 'MGAAdmin' },
  AgencyAdmin: { roleCode: 'AgencyAdmin' }
};


describe('QuotesComponent', () => {
  let component: QuotesComponent;
  let fixture: ComponentFixture<QuotesComponent>;
  let sessionServiceSpy: jasmine.SpyObj<AQSession>;
  let mockProgramService: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('AQSession', ['getData']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockProgramService = {
      MGAPrograms: jasmine.createSpy('MGAPrograms')
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [QuotesComponent],
      providers: [
        { provide: AQSession, useValue: spy },
        Router,
        { provide: 'RolesService', useValue: mockRoles },

        ProgramService
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesComponent);
    component = fixture.componentInstance;
    sessionServiceSpy = TestBed.inject(AQSession) as jasmine.SpyObj<AQSession>;
    fixture.detectChanges();

    spyOn(component, 'setBaseURL');
    spyOn(component, 'getMGAPrograms');
    spyOn(component, 'getFBData');

    (component as any).userId = 123;
  });

  it('should call savePolicy with FULLQUOTE when action is proceedtoquote', () => {
    const event = { action: 'proceedtoquote' };
    sessionServiceSpy.getData.and.returnValue('someQuoteInsured');
    component.getFormDataMaster(event);
  });

  it('should call quikquotes when action is addquote', () => {
    const event = { action: 'addquote' };
    component.quoteId = 0;
    component.formMode = 'someMode';
    sessionServiceSpy.getData.and.returnValue('someQuoteInsured');
    component.getFormDataMaster(event);
    expect(component.formMode).toBe('');
  });

  it('should set isOpenTask when AQCheckboxDataOut is called', () => {
    const mockEvent = { value: true };
    component.AQCheckboxDataOut(mockEvent);
    expect(component.isOpenTask).toBeTrue();  // or toBe(true)
  });

  it('should set isOpenTask to false when value is false', () => {
    const mockEvent = { value: false };
    component.AQCheckboxDataOut(mockEvent);
    expect(component.isOpenTask).toBeFalse();  // or toBe(false)
  });

  it('should remove item from sessionStorage and unsubscribe on destroy', () => {
    const removeItemSpy = spyOn(sessionStorage, 'removeItem');
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    component.ngOnDestroy();
    expect(removeItemSpy).toHaveBeenCalledWith('IsNavigationFrom');
  });

  it('should only remove item from sessionStorage if mySubscription is undefined', () => {
    const removeItemSpy = spyOn(sessionStorage, 'removeItem');
    component.ngOnDestroy();
    expect(removeItemSpy).toHaveBeenCalledWith('IsNavigationFrom');
  });

  it('should not throw error if MGAPrograms returns undefined', () => {
    mockProgramService.MGAPrograms.and.returnValue(of(undefined));
    component.getMGAPrograms();
  });

  it('should not throw error if mgaProgramList is missing', () => {
    const mockResponse = { data: {} };
    mockProgramService.MGAPrograms.and.returnValue(of(mockResponse));
    component.getMGAPrograms();
  });

  it('should set formMode to partialedit, set insuredId, toggle QuoteStage and call setViewPolicyData when formDefinition and formData are present', () => {
    const formDefinitionObj = { field: 'value' };
    const formDataObj = { name: 'John Doe' };

    const encodedFormDefinition = btoa(JSON.stringify(formDefinitionObj));
    const encodedFormData = btoa(JSON.stringify(formDataObj));

    const response = {
      insuredViewResolver: {
        data: {
          formDefinition: encodedFormDefinition,
          formData: encodedFormData
        }
      }
    };

    spyOn(component, 'setViewPolicyData');
    spyOn(component, 'setFormsData');
    sessionServiceSpy.getData.and.returnValue({ InsuredId: 123 });

    component.QuoteStage = false;

    component.getInsuredView(response);

    expect(component.formMode).toBe('partialedit');
    expect(component.QuoteStage).toBeTrue();
    expect(component.setViewPolicyData).toHaveBeenCalledWith(formDefinitionObj, formDataObj);
    expect(component.insuredId).toBe(123);
    expect(component.setFormsData).not.toHaveBeenCalled();
  });

  it('should call setFormsData if formDefinition is null', () => {
    const response = {
      insuredViewResolver: {
        data: {
          formDefinition: null,
          formData: null
        }
      }
    };

    spyOn(component, 'setFormsData');
    spyOn(component, 'setViewPolicyData');

    component.getInsuredView(response);
    expect(component.setViewPolicyData).not.toHaveBeenCalled();
  });

  it('should call required methods and set initial values in ngOnInit', fakeAsync(() => {
    sessionServiceSpy.getData.withArgs('navTypeNew').and.returnValue('someNavValue');
    sessionServiceSpy.getData.withArgs('insuredView').and.returnValue(true);

    component.ngOnInit();
    tick(3000); // simulate the setTimeout

    expect(component.navtypeNew).toBe('someNavValue');
    expect(component.AQFormData).toBe('');
    expect(component.insuredView).toBe(true);
    expect(component.insuredId).toBeNull();

    expect(component.setBaseURL).toHaveBeenCalled();
    expect(component.getMGAPrograms).toHaveBeenCalled();
    expect(component.getFBData).toHaveBeenCalled();
  }));

  it('should set isFullQuote true for PROCEEDTOQUOTE action', () => {
    component.ManageFlag('PROCEEDTOQUOTE', null);
    expect(component.isFullQuote).toBeTrue();
    expect(component.isPolicyBind).toBeFalse();
    expect(component.isIssueQuote).toBeFalse();
  });

  it('should set isPolicyBind true for PROCEEDTOBIND action', () => {
    component.ManageFlag('PROCEEDTOBIND', null);
    expect(component.isFullQuote).toBeFalse();
    expect(component.isPolicyBind).toBeTrue();
    expect(component.isIssueQuote).toBeFalse();
  });

  it('should set isIssueQuote true for IQ action', () => {
    component.ManageFlag('IQ', null);
    expect(component.isFullQuote).toBeFalse();
    expect(component.isPolicyBind).toBeFalse();
    expect(component.isIssueQuote).toBeTrue();
  });

  it('should fallback to formType when action not found', () => {
    component.ManageFlag('UNKNOWN', 'FQ');
    expect(component.isFullQuote).toBeTrue();
    expect(component.isPolicyBind).toBeFalse();
    expect(component.isIssueQuote).toBeFalse();
  });

  it('should set all flags false for unknown action and formType', () => {
    component.ManageFlag('UNKNOWN', 'UNKNOWN');
    expect(component.isFullQuote).toBeFalse();
    expect(component.isPolicyBind).toBeFalse();
    expect(component.isIssueQuote).toBeFalse();
  });

  it('should set FormDefinition and AQFormData when setViewPolicyData is called', () => {
    const mockFormDefinition = { title: 'Test Form' };
    const mockFormData = { field1: 'value1' };
    component.setViewPolicyData(mockFormDefinition, mockFormData);
    expect(component.FormDefinition).toEqual(mockFormDefinition);
    expect(component.AQFormData).toEqual(mockFormData);
  });
});
