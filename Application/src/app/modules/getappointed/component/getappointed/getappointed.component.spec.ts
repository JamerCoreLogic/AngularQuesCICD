
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { GetappointedComponent } from './getappointed.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetappointService } from '../../getappoint.service';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { TrimValueService } from 'src/app/shared/services/trim-value/trim-value.service';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';


describe('GetappointedComponent', () => {
  let component: GetappointedComponent;
  let fixture: ComponentFixture<GetappointedComponent>;
  let httpClient: HttpClient;
  let getAppointService: GetappointService;
  let _loaderService: LoaderService;
  let _popupService: PopupService;
  let _router: Router;
  let _trimService: TrimValueService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [GetappointedComponent],
      providers: [HttpClient],
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(GetappointedComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    getAppointService = TestBed.inject(GetappointService);
    _loaderService = TestBed.inject(LoaderService);
    _router = TestBed.inject(Router);
    _trimService = TestBed.inject(TrimValueService);
    _popupService = TestBed.inject(PopupService);

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //ngOnInit
  it('should call createform on ngOnInit', () => {
    spyOn(component, 'createform');

    component.ngOnInit();

    expect(component.createform).toHaveBeenCalled();
  });

  //next
  it('should toggle nextClicked when form is valid and pageTitle is "Get Appointed"', () => {
    component.pageTitle = 'Get Appointed';
    component.addagent = new FormGroup({
      FirstName: new FormControl('John', Validators.required),
      LastName: new FormControl('Doe', Validators.required),
      Email: new FormControl('john@example.com', Validators.required),
      PhoneCell: new FormControl('1234567890', Validators.required),
      AgencyName: new FormControl('Agency', Validators.required),
      Website: new FormControl('')  // Website validator should be cleared
    });

    component.nextClicked = false;
    component.next();

    expect(component.hitNext).toBeFalsy();
    expect(component.nextClicked).toBeTrue();
  });
  it('should set hitNext to true if form is invalid and pageTitle is "Get Appointed"', () => {
    component.pageTitle = 'Get Appointed';
    component.addagent = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      PhoneCell: new FormControl('', Validators.required),
      AgencyName: new FormControl('', Validators.required),
      Website: new FormControl('')
    });

    component.hitNext = false;
    component.next();

    expect(component.hitNext).toBeTrue();
    expect(component.nextClicked).toBeFalsy();
  });
  it('should toggle nextClicked when form is valid and pageTitle is not "Get Appointed"', () => {
    component.pageTitle = 'Something Else';
    component.addagent = new FormGroup({
      FirstName: new FormControl('John', Validators.required),
      LastName: new FormControl('Doe', Validators.required),
      Email: new FormControl('john@example.com', Validators.required),
      PhoneCell: new FormControl('1234567890', Validators.required),
      AgencyName: new FormControl('Agency', Validators.required),
      Website: new FormControl('https://test.com', Validators.required)
    });

    component.nextClicked = false;
    component.next();

    expect(component.hitNext).toBeFalse();
    expect(component.nextClicked).toBeTrue();
  });
  it('should set hitNext to true if form is invalid and pageTitle is not "Get Appointed"', () => {
    component.pageTitle = 'Something Else';
    component.addagent = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      PhoneCell: new FormControl('', Validators.required),
      AgencyName: new FormControl('', Validators.required),
      Website: new FormControl('', Validators.required)
    });

    component.nextClicked = false;
    component.next();

    expect(component.hitNext).toBeTrue();
    expect(component.nextClicked).toBeFalse();
  });

  //ngOnDestroy
  // it('should unsubscribe all subscriptions on ngOnDestroy', () => {
  //   // Mock each subscription with a jasmine spy object that has unsubscribe method
  //   component.validateAddressSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.zipDetailsSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.createAgentSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.popupSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.agencyListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.agentListSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.agentRoleSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.address1Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.address2Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  //   component.zipSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);

  //   component.ngOnDestroy();

  //   expect(component.validateAddressSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.zipDetailsSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.createAgentSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.popupSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.agencyListSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.agentListSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.agentRoleSubscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.address1Subscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.address2Subscription.unsubscribe).toHaveBeenCalled();
  //   expect(component.zipSubscription.unsubscribe).toHaveBeenCalled();
  // });

  //downloadPdfTemplate
  it('should download PDF file when downloadPdfTemplate is called', () => {
    const fileName = 'test-file.pdf';
    const dummyPdfData = new Blob(['dummy content'], { type: 'application/pdf' });

    // Spy on the service method and return an observable of the dummy PDF blob
    spyOn(getAppointService, 'downloadPdf').and.returnValue(of(dummyPdfData));

    // Spy on document methods
    const createElementSpy = spyOn(document, 'createElement').and.callThrough();
    const appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
    const removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();

    component.downloadPdfTemplate(fileName);

    expect(getAppointService.downloadPdf).toHaveBeenCalledWith(fileName);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  //convertToBase64
  it('should convert file to base64 string', async () => {
    // Create a fake file
    const fileContent = 'Hello world';
    const file = new File([fileContent], 'hello.txt', { type: 'text/plain' });

    // Mock FileReader
    const mockBase64 = btoa(fileContent); // simulate expected base64
    const mockReader = {
      readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function () {
        this.result = `data:text/plain;base64,${mockBase64}`;
        this.onloadend(); // manually trigger the event
      }),
      onloadend: null,
      result: null
    };

    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    const base64 = await component['convertToBase64'](file);
    expect(base64).toEqual(mockBase64);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('should reject if base64 string is invalid or missing', async () => {
    const file = new File(['bad content'], 'bad.txt');

    const mockReader = {
      readAsDataURL: jasmine.createSpy('readAsDataURL').and.callFake(function () {
        this.result = null; // simulate failure
        this.onloadend();   // trigger
      }),
      onloadend: null,
      result: null
    };

    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    await expectAsync(component['convertToBase64'](file)).toBeRejectedWith('Invalid file format');
  });

  //getFileName
  it('should return the file name for the given control name', () => {
    (component as any).fileInformation = {
      'document1': 'file1.pdf',
      'document2': 'file2.pdf'
    };

    const result = component.getFileName('document1');
    expect(result).toBe('file1.pdf');
  });
  it('should return an empty string if control name is not present', () => {
    (component as any).fileInformation = {
      'document1': 'file1.pdf'
    };

    const result = component.getFileName('unknownDocument');
    expect(result).toBe('');
  });

  //onFileChange
  it('should set file name and patch base64 to form control on file change', fakeAsync(() => {
    const mockFile = new File(['dummy content'], 'testFile.txt', { type: 'text/plain' });

    const event = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    // Spy on convertToBase64 to return mock base64 string
    const base64String = btoa('dummy content');
    spyOn((component as any), 'convertToBase64').and.returnValue(Promise.resolve(base64String));

    // Mock form group
    component.addagent = new FormGroup({
      testControl: new FormControl('')
    });

    (component as any).fileInformation = {};

    component.onFileChange(event, 'testControl');
    tick(); // Wait for the promise to resolve

    expect((component as any).fileInformation['testControl']).toBe('testFile.txt');
    expect(component.addagent.get('testControl')?.value).toBe(base64String);
  }));

  //addAgent
  it('should call appointAgent with correct data when form is valid and pageTitle is "Get Appointed"', () => {
    component.pageTitle = 'Get Appointed';
    component.addagent = new FormGroup({
      FirstName: new FormControl('John', Validators.required),
      Middlename: new FormControl('M', Validators.required),
      LastName: new FormControl('Doe', Validators.required),
      Email: new FormControl('john@example.com', Validators.required),
      PhoneCell: new FormControl('1234567890', Validators.required),
      AgencyName: new FormControl('Agency', Validators.required),
      Website: new FormControl('https://test.com', Validators.required),
      CopyOfYourAgency: new FormControl('Copy1', Validators.required),
      CopyOfResident: new FormControl('Copy2', Validators.required),
      CopyOfSurplus: new FormControl('Copy3'),
      CopyOfYourEandO: new FormControl('Copy4', Validators.required),
      CompletedProducerApplication: new FormControl('Completed', Validators.required),
      CompletedAgencyW9: new FormControl('Completed', Validators.required),
      ConveloProducerAgreement: new FormControl('Agreement', Validators.required),
      DirectDepositInformation: new FormControl('Deposit', Validators.required),
      TargetPremiums: new FormControl(null),
      AcordApplication: new FormControl(null),
      SupplementalApplication: new FormControl(null),
      ThreeToFiveYearsLoss: new FormControl(null),
      CurrentExperienceMod: new FormControl(null),
    });

    const mockResponse = { success: true };
    spyOn(_loaderService, 'show');
    spyOn(_loaderService, 'hide');
    spyOn(_popupService, 'show');
    spyOn(_router, 'navigateByUrl');
    spyOn(_trimService, 'TrimObjectValue').and.callThrough();
    spyOn(getAppointService, 'appointAgent').and.returnValue(of(mockResponse));

    component.addAgent();

    expect(_loaderService.show).toHaveBeenCalled();
    expect(_trimService.TrimObjectValue).toHaveBeenCalled();
    expect(getAppointService.appointAgent).toHaveBeenCalledWith(jasmine.objectContaining({
      BusinessType: 1,
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      PhoneNumber: '1234567890',
      AgencyName: 'Agency',
      Website: 'https://test.com',
    }));
    expect(_popupService.show).toHaveBeenCalledWith('Guest User', 'Agency registration request submitted successfully.');
    expect(_router.navigateByUrl).toHaveBeenCalledWith('');
    expect(_loaderService.hide).toHaveBeenCalled();
  });
  it('should call appointAgent with correct data when form is valid and pageTitle is not "Get Appointed"', () => {
    component.pageTitle = 'Submit Business';
    component.addagent = new FormGroup({
      FirstName: new FormControl('John', Validators.required),
      Middlename: new FormControl('M', Validators.required),
      LastName: new FormControl('Doe', Validators.required),
      Email: new FormControl('john@example.com', Validators.required),
      PhoneCell: new FormControl('1234567890', Validators.required),
      AgencyName: new FormControl('Agency', Validators.required),
      Website: new FormControl('https://test.com', Validators.required),
      CopyOfYourAgency: new FormControl(null),
      CopyOfResident: new FormControl(null),
      CopyOfSurplus: new FormControl(null),
      CopyOfYourEandO: new FormControl(null),
      CompletedProducerApplication: new FormControl(null),
      CompletedAgencyW9: new FormControl(null),
      ConveloProducerAgreement: new FormControl(null),
      DirectDepositInformation: new FormControl(null),
      TargetPremiums: new FormControl('10000', Validators.required),
      AcordApplication: new FormControl('Acord', Validators.required),
      SupplementalApplication: new FormControl('Supplemental'),
      ThreeToFiveYearsLoss: new FormControl('Loss'),
      CurrentExperienceMod: new FormControl('Mod'),
    });

    const mockResponse = { success: true };
    spyOn(_loaderService, 'show');
    spyOn(_loaderService, 'hide');
    spyOn(_popupService, 'show');
    spyOn(_router, 'navigateByUrl');
    spyOn(_trimService, 'TrimObjectValue').and.callThrough();
    spyOn(getAppointService, 'appointAgent').and.returnValue(of(mockResponse));

    component.addAgent();

    expect(_loaderService.show).toHaveBeenCalled();
    expect(_trimService.TrimObjectValue).toHaveBeenCalled();
    expect(getAppointService.appointAgent).toHaveBeenCalledWith(jasmine.objectContaining({
      BusinessType: 2,
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      PhoneNumber: '1234567890',
      AgencyName: 'Agency',
      Website: 'https://test.com',
      TargetPremiums: '10000',
      AcordApplication: 'Acord',
    }));
    expect(_router.navigateByUrl).toHaveBeenCalledWith('');
    expect(_loaderService.hide).toHaveBeenCalled();
  });

  //cancel
  it('should navigate to root when cancel is called', () => {
    // Arrange
    const routerSpy = spyOn(component['_router'], 'navigateByUrl');

    // Act
    component.cancel();

    // Assert
    expect(routerSpy).toHaveBeenCalledWith('');
  });

  //deleteList
  it('should clear AssistantList and push all elements to UWAssistantList when assistant is an array', () => {
    const assistantArray = [
      { UWAssistantId: 1, UWAssistantName: 'John' },
      { UWAssistantId: 2, UWAssistantName: 'Jane' }
    ];

    component.AssistantList = [{ UWAssistantId: 3, UWAssistantName: 'Old' }];
    component.UWAssistantList = [];

    spyOn(component['_sortingService'], 'SortObjectArray').and.callFake((key: string, order: string, list: any[]) => {
      return list; // just return the list as-is for simplicity
    });

    component.deleteList(assistantArray);

    expect(component.AssistantList).toEqual([]);
    expect(component.UWAssistantList).toEqual(assistantArray);
    expect(component['_sortingService'].SortObjectArray).toHaveBeenCalledWith('UWAssistantName', 'ASC', assistantArray);
  });

  //selectValue
  it('should patch the State value to the form and hide the dropdown', () => {
    const mockForm = new FormGroup({
      State: new FormControl('')
    });

    component.addagent = mockForm;
    component.showDropDown = true;

    const value = 'CA'; // Example value

    component.selectValue(value);

    expect(component.addagent.value.State).toBe('CA');
    expect(component.showDropDown).toBeFalse();
  });

  //closeDropDown
  it('should toggle the value of showDropDown', () => {
    component.showDropDown = true;

    component.closeDropDown();

    expect(component.showDropDown).toBeFalse();

    component.closeDropDown();

    expect(component.showDropDown).toBeTrue();
  });

  //openFIle
  it('should dispatch click event on file input element', () => {
    const elementId = 'fileInput';
    const mockElement = document.createElement('input');
    spyOn(mockElement, 'dispatchEvent');

    spyOn(document, 'getElementById').and.returnValue(mockElement);

    component.openFIle(elementId);

    expect(document.getElementById).toHaveBeenCalledWith(elementId);
    expect(mockElement.dispatchEvent).toHaveBeenCalledWith(jasmine.any(MouseEvent));
  });

  //RemoveFile
  it('should remove file from form control and fileInformation object', () => {
    const controlName = 'DocumentUpload';
    const mockForm = new FormGroup({
      DocumentUpload: new FormControl('base64EncodedData')
    });

    component.addagent = mockForm;
    (component as any).fileInformation = {
      DocumentUpload: 'filename.pdf'
    };

    component.RemoveFile(controlName);

    expect(component.addagent.get(controlName)?.value).toBeNull();
    expect((component as any).fileInformation[controlName]).toBeUndefined();
  });

  //


});

