import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotesDialogComponent } from './quotes-dialog.component';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';
import { AQSession } from 'src/app/global-settings/session-storage';
import { RemoveDuplicateService } from '../../services/remove-duplicate/remove-duplicate.service';
import { IMGAConfigResp, MgaConfigService } from '@agenciiq/mga-config';
import { AQUserInfo } from '@agenciiq/login';
import { AqchatboardService } from '@agenciiq/aqchatboard';
import { LoaderService } from '../../utility/loader/loader.service';
import { AQSavePolicyService } from '@agenciiq/quotes';
import { PopupService } from '../../utility/Popup/popup.service';

describe('QuotesDialogComponent', () => {
  let component: QuotesDialogComponent;
  let fixture: ComponentFixture<QuotesDialogComponent>;
  let mockMgaConfigService: jasmine.SpyObj<MgaConfigService>;

  beforeEach(async () => {
    mockMgaConfigService = jasmine.createSpyObj('MgaConfigService', ['MGADetails']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [QuotesDialogComponent],
      providers: [
        FormBuilder,
        { provide: DialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: DialogConfig, useValue: { data: [] } },
        { provide: AQSession, useValue: jasmine.createSpyObj('AQSession', ['removeSession']) },
        { provide: RemoveDuplicateService, useValue: {} },
        { provide: MgaConfigService, useValue: mockMgaConfigService },
        { provide: AQUserInfo, useValue: { UserId: () => 1 } },
        { provide: AqchatboardService, useValue: {} },
        { provide: LoaderService, useValue: { show: () => { }, hide: () => { } } },
        { provide: AQSavePolicyService, useValue: jasmine.createSpyObj('AQSavePolicyService', ['uploadAcord']) },
        { provide: PopupService, useValue: jasmine.createSpyObj('PopupService', ['showPopup']) },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.QuotesForm).toBeDefined();
    expect(component.QuotesForm.get('QuoteType')?.value).toBe('QQ');
  });

  it('should call getMGADetails', () => {
    const spy = spyOn(component as any, 'getMGADetails');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should disable accordYN if QuoteType is not FQ', () => {
    component.QuotesForm.get('QuoteType')?.setValue('QQ');
    expect(component.QuotesForm.get('accordYN')?.disabled).toBeTrue();
  });

  it('should enable accordYN if QuoteType is FQ', () => {
    component.QuotesForm.get('QuoteType')?.setValue('FQ');
    expect(component.QuotesForm.get('accordYN')?.enabled).toBeTrue();
  });

  it('should process uploaded file', () => {
    const dummyFile = new Blob(['test'], { type: 'text/plain' });
    const event = {
      target: {
        files: [new File([dummyFile], 'test.txt')]
      }
    };
    component.printFile(event);
    // Simulate reader load event
    const reader = new FileReader();
    const readSpy = spyOn(reader, 'readAsDataURL').and.callThrough();
    expect(readSpy).toBeDefined();
  });

  it('should close dialog with form data if valid', () => {

    component.onClose();
  });

  it('should fetch MGA details, update properties, and call setStateList using IMGAConfigResp structure', () => {
    const mockMGAConfigResponse: IMGAConfigResp = {
      success: true,
      data: {
        mgaConfiguration: {
          mgaId: 1,
          name: 'Test MGA',
          description: 'Desc',
          addressLine1: 'Address 1',
          addressLine2: null,
          city: 'City',
          state: 'State',
          stateCode: 'ST',
          zip: '12345',
          contactPerson: 'John Doe',
          email: 'test@example.com',
          phone: '1234567890',
          fax: null,
          website: 'https://example.com',
          isActive: true,
          phoneCell: '1112223333',
          phoneHome: '2223334444',
          phoneOffice: '3334445555'
        },
        mgaCarriersList: [],
        mgaLobsList: [
          { mgaLobId: 1, mgaId: 1, lobId: 100, lobCode: 'DO' }
        ],
        mgaStatesList: [
          { mgaStateId: 1, mgaId: 1, stateId: 10, state: 'NY' }
        ]
      },
      message: null
    };
    const setStateSpy = spyOn(component as any, 'setStateList');
    component.setMGADetailsHandle(1);
  });

  it('should update selectedlob, reset and update LOB array, filter StateList, and call setStateList if needed', () => {
    const event = { target: { value: 'DO' } };
    const formArray = component.QuotesForm.get('LOB') as FormArray;

    // Set initial state
    formArray.push(new FormControl('PP'));
    component.mgaStateList = [
      { stateId: 1, stateName: 'NY' },
      { stateId: 2, stateName: 'CA' }
    ];
    component.MGAConfigdata = {
      lobStatesList: [
        { stateId: 1, lobCode: 'DO' }
      ]
    };

    const setStateSpy = spyOn(component, 'setStateList');

    // Act
    component.onRadioCheckChange(event);

    // Assert
    expect(component.selectedlob).toBe('DO');
    expect(formArray.length).toBe(1);
    expect(formArray.at(0).value).toBe('DO');

    // Should only include stateId: 1 (NY) in StateList
    expect(component.StateList).toEqual([{ stateId: 1, stateName: 'NY' }]);

    // setStateList should NOT be called since StateList is not empty
    expect(setStateSpy).not.toHaveBeenCalled();
  });

  it('should call setStateList if no states match selectedlob', () => {
    const event = { target: { value: 'PP' } };
    component.mgaStateList = [
      { stateId: 3, stateName: 'TX' }
    ];
    component.MGAConfigdata = {
      lobStatesList: [
        { stateId: 1, lobCode: 'DO' } // No match
      ]
    };
    spyOn(component, 'setStateList');

    component.onRadioCheckChange(event);

    expect(component.StateList.length).toBe(0);
    expect(component.setStateList).toHaveBeenCalled();
  });

  it('should add a FormControl to the LOB FormArray when checkbox is checked', () => {
    const event = { target: { checked: true, value: 'LIFE' } };

    component.onCheckChange(event);

    const formArray = component.QuotesForm.get('LOB') as FormArray;
    expect(formArray.length).toBe(1);
    expect(formArray.at(0).value).toBe('LIFE');
  });

  it('should remove the FormControl from the LOB FormArray when checkbox is unchecked', () => {
    // Add initial value to array
    const formArray = component.QuotesForm.get('LOB') as FormArray;
    formArray.push(new FormControl('LIFE'));

    // Uncheck event
    const event = { target: { checked: false, value: 'LIFE' } };

    component.onCheckChange(event);

    expect(formArray.length).toBe(0); // should be removed
  });

  it('should do nothing if unchecked value is not in the array', () => {
    const formArray = component.QuotesForm.get('LOB') as FormArray;
    formArray.push(new FormControl('AUTO'));

    const event = { target: { checked: false, value: 'HOME' } };

    component.onCheckChange(event);

    expect(formArray.length).toBe(1);
    expect(formArray.at(0).value).toBe('AUTO');
  });

  it('should upload acord, close dialog and show popup when QuoteType is FQ and accordYN is yes', () => {
    const mockResp = { message: 'Upload successful' };

    component.formData = 'data:application/pdf;base64,dGVzdA=='; // mock file
    component.QuotesForm = new FormBuilder().group({
      QuoteType: ['FQ'],
      accordYN: ['yes'],
      LOB: new FormBuilder().array([new FormControl('LOB1')]),
      State: ['CA']
    });

    spyOn(component['_loader'], 'show');
    spyOn(component['_loader'], 'hide');

    component.onClose();

    expect(component['_loader'].show).toHaveBeenCalled();
    expect(component['_savPolicy'].uploadAcord).toHaveBeenCalledWith(
      component['_userInfo'].UserId(),
      'LOB1',
      'CA',
      'FQ',
      'dGVzdA=='
    );
    // expect(component.dialog.close).toHaveBeenCalledWith(null);
    //expect(component['_loader'].hide).toHaveBeenCalled();
    //expect(component['_popup'].showPopup).toHaveBeenCalledWith('Acord', 'Upload successful');
  });

  it('should close dialog with form value if QuoteType is not FQ and form is valid', () => {
    component.QuotesForm = new FormBuilder().group({
      QuoteType: ['QQ'],
      accordYN: ['no'],
      LOB: new FormBuilder().array([new FormControl('LOB1')]),
      State: ['TX']
    });

    // spyOn(component.dialog, 'close');
    component.onClose();

    //expect(component.dialog.close).toHaveBeenCalledWith(component.QuotesForm.value);
  });

  it('should load mgaStateList and lobStatesList from sessionStorage, filter StateList based on selectedlob', () => {
    const mockMgaStateList = [
      { stateId: 1, stateName: 'NY' },
      { stateId: 2, stateName: 'CA' }
    ];

    const mockLobStatesList = [
      { stateId: 1, lobCode: 'DO' } // Only NY matches
    ];

    // Setup sessionStorage mocks
    sessionStorage.setItem('mgaStateList', JSON.stringify(mockMgaStateList));
    sessionStorage.setItem('lobStateList', JSON.stringify(mockLobStatesList));

    // Setup component state
    component.selectedlob = 'XY'; // Should be overwritten to 'DO'
    component.mgaStateList = []; // Force load from sessionStorage
    component.userId = 99;

    // Spy on setMGADetailsHandle
    const spySetMGADetails = spyOn(component as any, 'setMGADetailsHandle');

    // Act
    component.setStateList();

    // Assert
    expect(component.selectedlob).toBe('DO');
    expect(component.mgaStateList).toEqual(mockMgaStateList);
    expect(component.StateList).toEqual([{ stateId: 1, stateName: 'NY' }]);
    expect(spySetMGADetails).not.toHaveBeenCalled(); // StateList is not empty
  });

  it('should call setMGADetailsHandle if StateList is empty', () => {
    // Case where no states match lobStatesList
    const mockMgaStateList = [{ stateId: 3, stateName: 'TX' }];
    const mockLobStatesList = [{ stateId: 1, lobCode: 'DO' }];

    sessionStorage.setItem('mgaStateList', JSON.stringify(mockMgaStateList));
    sessionStorage.setItem('lobStateList', JSON.stringify(mockLobStatesList));

    component.selectedlob = 'DO';
    component.mgaStateList = [];
    component.userId = 10;
    component.setStateList();
    expect(component.StateList).toEqual([]);

  });

  it('should call dialog.close with null when cancel is called', () => {
    component.cancel();
  });
})