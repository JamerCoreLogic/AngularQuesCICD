import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddAqProgramComponent } from './add-aq-program.component';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQUserInfo } from '@agenciiq/login';
import { MAnageProgramService } from '@agenciiq/aq-programs';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AddAqProgramComponent', () => {
  let component: AddAqProgramComponent;
  let fixture: ComponentFixture<AddAqProgramComponent>;

  let mockLoaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
  let mockUserInfo = jasmine.createSpyObj('AQUserInfo', ['UserId']);
  let mockProgramService = jasmine.createSpyObj('MAnageProgramService', ['AQProgram', 'SaveAQProgram', 'GetProgramByIDApi']);
  let mockPopupService = jasmine.createSpyObj('PopupService', ['showPopup']);
  let mockSession = jasmine.createSpyObj('AQSession', ['getData']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAqProgramComponent],
      providers: [
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: MAnageProgramService, useValue: mockProgramService },
        { provide: PopupService, useValue: mockPopupService },
        { provide: AQSession, useValue: mockSession },
        { provide: Router, useValue: mockRouter },
      ]
    });

    fixture = TestBed.createComponent(AddAqProgramComponent);
    component = fixture.componentInstance;

    mockUserInfo.UserId.and.returnValue(1001);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set baseURL for production and multiClient', () => {
    component.env = { multiClient: true, production: true } as any;
    component.setBaseURL();
    expect(component.baseURL).toContain(window.location.origin);
  });

  it('should set baseURL for dev mode', () => {
    component.env = { multiClient: false, production: false } as any;
    component.setBaseURL();
    expect(component.baseURL).toBe('http://125.63.66.115:9096/');
  });

  it('should load existing program in ngOnInit', () => {
    const mockData = {
      programId: 1,
      programName: 'Test Program',
      formID: 101
    };
    mockSession.getData.and.returnValue(JSON.stringify(mockData));
    spyOn(component, 'getFormById');
    component.ngOnInit();
    expect(component.getFormById).toHaveBeenCalledWith(1, 101);
  });

  it('should call addAqProgramForm if no AQProgramData in session', () => {
    mockSession.getData.and.returnValue(null);
    spyOn(component, 'addAqProgramForm');
    component.ngOnInit();
    expect(component.addAqProgramForm).toHaveBeenCalled();
  });

  it('should navigate to programs list on AQCancelDataOut', () => {
    component.AQCancelDataOut({});
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/agenciiq/programs/list');
  });

  it('should load and parse program definition in addAqProgramForm', fakeAsync(() => {
    const encodedDefinition = btoa(JSON.stringify({ field: 'value' }));
    mockProgramService.AQProgram.and.returnValue(of({
      success: true,
      data: {
        aQProgramsForms: [{ programDefinition: encodedDefinition, formId: 999 }]
      }
    }));

    component.addAqProgramForm();
    tick();

    expect(component.programFormDefinition).toEqual({ field: 'value' });
    expect(component.formID).toBe(999);
  }));

  it('should handle error response in addAqProgramForm', fakeAsync(() => {
    const popupRef = { afterClosed: of('ok') };
    mockProgramService.AQProgram.and.returnValue(of({ success: false, message: 'Error!' }));
    mockPopupService.showPopup.and.returnValue(popupRef);

    component.addAqProgramForm();
    tick();

    expect(mockPopupService.showPopup).toHaveBeenCalledWith('Program', 'Error!');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/agenciiq/programs/list');
  }));

  it('should handle API error in addAqProgramForm', fakeAsync(() => {
    mockProgramService.AQProgram.and.returnValue(throwError(() => new Error('Network error')));
    component.addAqProgramForm();
    tick();
    expect(mockLoaderService.hide).toHaveBeenCalled();
  }));

  it('should call SaveAQProgram and navigate if success', fakeAsync(() => {
    const formDataMock = { aqDataModel: { field: 'value' } };
    mockProgramService.SaveAQProgram.and.returnValue(of({ success: true }));

    component.programId = 101;
    component.programName = 'Demo';
    component.formID = 20;

    component.getFormDataMaster(formDataMock);
    tick();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('agenciiq/programs/list');
  }));

  it('should show popup on SaveAQProgram failure', fakeAsync(() => {
    mockProgramService.SaveAQProgram.and.returnValue(of({ success: false, message: 'Save failed' }));

    component.getFormDataMaster({ aqDataModel: {} });
    tick();

    expect(mockPopupService.showPopup).toHaveBeenCalledWith('Program', 'Save failed');
  }));

  it('should fetch and decode form definition in getFormById', fakeAsync(() => {
    const encodedDefinition = btoa(JSON.stringify({ form: 'abc' }));
    const encodedFormData = btoa(JSON.stringify({ val: 123 }));

    mockProgramService.GetProgramByIDApi.and.returnValue(of({
      success: true,
      data: {
        programsDefinition: { programDefinition: encodedDefinition },
        program: { formData: encodedFormData }
      }
    }));

    component.getFormById(1, 2);
    tick();

    expect(component.programFormDefinition).toEqual({ form: 'abc' });
    expect(component.AQFormData).toEqual({ val: 123 });
  }));
});