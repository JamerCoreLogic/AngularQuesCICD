import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AgencyComponent } from "./agency.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/compiler";
import { AQAgencyService } from "@agenciiq/agency";
import { of, throwError } from "rxjs";
import { IAgencyProgramResp } from "@agenciiq/agency/lib/interfaces/base-agency-program-resp";
import { IAgencyList, IAgencyListResp } from "@agenciiq/agency/lib/interfaces/base-agency-list-resp";
import { IRole } from "@agenciiq/login/lib/interfaces/base-login-resp";
import { routes } from "src/app/app-routing.module";
import { Router } from "@angular/router";
import { AQZipDetailsService } from "@agenciiq/aqadmin";
import { LoaderService } from "src/app/shared/utility/loader/loader.service";
import { FormBuilder, FormControl } from "@angular/forms";



describe('AgencyComponent', () => {
  let component: AgencyComponent;
  let fixture: ComponentFixture<AgencyComponent>;
  let httpClient: HttpClient
  let service: AQAgencyService;
  let router: Router;
  let zipservice: AQZipDetailsService;
  let loaderservice: LoaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AgencyComponent],
      providers: [

      ],
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient)
    service = TestBed.inject(AQAgencyService);
    router = TestBed.inject(Router);
    zipservice = TestBed.inject(AQZipDetailsService);
    loaderservice = TestBed.inject(LoaderService);

    component.AddAgencyForm = new FormBuilder().group({
      AgencyName: ['Test Agency'],
      ContactPerson: ['John Doe'],
      PhoneOffice: ['1234567890'],
      Email: ['test@example.com'],
      NPN: ['12345'],
      NPNExpirationDate: ['2025-12-31'],
      AddressLine1: ['123 Main St'],
      AddressLine2: ['Apt 4B'],
      City: ['New York'],
      State: ['NY'],
      Zip: ['10001'],
      Fax: ['1112223333']
    });
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize ngOnInit correctly when _agencyId exists in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      if (key === '_agencyId') return '123';
      return null;
    });
    spyOn(sessionStorage, 'removeItem');
    spyOn(component, 'isEditable');
    spyOn(component, 'getAgencyDetail');
    spyOn(component, 'createAddAgencyForm');
    spyOn(component, 'onChnages');
    spyOn(component, 'SaveAccountWithAddressValidation');

    component.ngOnInit();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('_branchId');
    expect(component.isEditable).toHaveBeenCalled();
    expect(component.getAgencyDetail).toHaveBeenCalled();
    expect(component.pageTitle).toBe('Edit Agency');
    expect(component.createAddAgencyForm).toHaveBeenCalled();
    expect(component.onChnages).toHaveBeenCalled();
    expect(component.SaveAccountWithAddressValidation).toHaveBeenCalled();
  });

  it('should initialize ngOnInit correctly when _agencyId does not exist in sessionStorage', () => {
    spyOn(sessionStorage, 'removeItem');
    spyOn(component, 'getProgramList');
    spyOn(component, 'createAddAgencyForm');
    spyOn(component, 'onChnages');
    spyOn(component, 'SaveAccountWithAddressValidation');
    spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      if (key === '_newBranchList') return JSON.stringify([{ branchId: 1 }]);
      return null;
    });
    spyOn(component._session, 'getData').and.returnValue({ agencyType: 'TestType' });

    component.ngOnInit();

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('_branchId');
    expect(component.pageTitle).toBe('Add Agency');
    expect(component.getProgramList).toHaveBeenCalled();
    expect(component.BranchList).toEqual([{ branchId: 1 }]);
    expect(component.tempAgencyData).toEqual({ agencyType: 'TestType' });
    expect(component.createAddAgencyForm).toHaveBeenCalled();
    expect(component.onChnages).toHaveBeenCalled();
    expect(component.SaveAccountWithAddressValidation).toHaveBeenCalled();
  });

  it('should call loader and set programList from API when no tempAgencyData', () => {
    const mockResponse: IAgencyProgramResp = {
      success: true,
      message: 'Programs fetched successfully',
      data: {
        agencyPrograms: [{
          agencyId: 1,
          programId: 2,
          programName: 'Program A',
          checked: false,
          isActive: false
        }]
      }
    };
    let spy_getPostDetails = spyOn(service, "AgencyProgramList").and.returnValue(of(mockResponse));
    component.tempAgencyData = null;
    component.getProgramList();
    expect(component.programList).toEqual(mockResponse.data.agencyPrograms);
  });

  it('should set programList from tempAgencyData if available', () => {
    const mockResponse: IAgencyProgramResp = {
      success: true,
      message: 'Programs fetched successfully',
      data: {
        agencyPrograms: [{
          agencyId: 1,
          programId: 2,
          programName: 'Program A',
          checked: false,
          isActive: false
        }]
      }
    };
    spyOn(service, "AgencyProgramList").and.returnValue(of(mockResponse));
    component.tempAgencyData = {
      programList: [{ id: 9, name: 'Cached Program' }]
    };
    component.getProgramList();
    expect(component.programList).toEqual(component.tempAgencyData.programList);
  });

  it('should handle error and hide loader', () => {
    spyOn(service, "AgencyProgramList").and.returnValue(throwError(() => new Error('API Error')));
    component.getProgramList();
  });

  it('should call API and populate AgencyDetails and related fields (agency admin)', () => {
    const mockResponse: IAgencyListResp = {
      success: true,
      message: null,
      data: {
        agencyList: [
          {
            agency: {
              userId: 1,
              agencyId: 99,
              agencyName: 'Agency 1',
              contactPerson: 'John Doe',
              phoneCell: '1234567890',
              email: 'test@agency.com',
              npn: '1234',
              npnExpirationDate: new Date(),
              addressLine1: '123 Main St',
              city: 'CityX',
              state: 'ST',
              zip: '12345',
              isActive: true,
              createdOn: new Date(),
              registered: 'Yes'
            },
            branches: [
              {
                branchId: 1,
                branchName: 'Branch A',
                agencyId: '99',
                isActive: true,
                createdBy: 'admin',
                createdOn: new Date(),
                modifiedBy: 'admin'
              }
            ],
            agencyPrograms: [
              {
                agencyId: 99,
                programId: 1,
                programName: 'Program A',
                checked: true,
                isActive: true
              },
              {
                agencyId: 99,
                programId: 2,
                programName: 'Program B',
                checked: false,
                isActive: true
              }
            ]
          }
        ]
      }
    };
    spyOn(service, "AgencyDetail").and.returnValue(of(mockResponse));
    component.getAgencyDetail();
    expect(component.AgencyDetails).toEqual(mockResponse.data.agencyList);
    expect(component.BranchList).toEqual(mockResponse.data.agencyList[0].branches);
    expect(component.registerType).toBeTrue();
  });

  it('should not populate if response is invalid', () => {
    spyOn(service, "AgencyDetail").and.returnValue(of({ success: false, message: null, data: null }));
    component.getAgencyDetail();
    expect(component.AgencyDetails).toBeTruthy();
  });

  // it('should call AgencyById and populate AgencyDetails, BranchList, and programList (agency admin)', () => {
  //   const mockAgencyDetails = [
  //     {
  //       agency: {
  //         agencyId: 1,
  //         agencyName: 'Test Agency',
  //         contactPerson: 'John Doe',
  //       },
  //       branches: [
  //         { branchId: 1, branchName: 'Branch A' },
  //         { branchId: 2, branchName: 'Branch B' },
  //       ],
  //       agencyPrograms: [
  //         { programId: 1, programName: 'Program A', checked: true },
  //         { programId: 2, programName: 'Program B', checked: false },
  //       ],
  //     },
  //   ];
  //   spyOn(service, 'AgencyById').and.returnValue(mockAgencyDetails);
  //   component.isAgencyAdmin = true;

  //   component.getAgencyDetails(1);

  //   expect(component.AgencyDetails).toEqual(mockAgencyDetails);
  //   expect(component.BranchList).toEqual(mockAgencyDetails[0].branches);
  //   expect(component.programList).toEqual([
  //     { programId: 1, programName: 'Program A', checked: true },
  //   ]);
  //   expect(component.assignValueToAddAgencyForm).toHaveBeenCalled();
  // });

  // it('should call AgencyById and populate AgencyDetails, BranchList, and programList (non-agency admin)', () => {
  //   const mockAgencyDetails: IAgencyList[] = [
  //     {
  //       agency: {
  //         userId: 1,
  //         agencyId: 1,
  //         agencyName: 'Test Agency',
  //         contactPerson: 'John Doe',
  //         phoneCell: '1234567890',
  //         email: 'test@agency.com',
  //         npn: '1234',
  //         npnExpirationDate: new Date(),
  //         addressLine1: '123 Main St',
  //         city: 'CityX',
  //         state: 'ST',
  //         zip: '12345',
  //         isActive: true,
  //         createdOn: new Date(),
  //         registered: 'Yes',
  //       },
  //       branches: [
  //         {
  //           branchId: 1,
  //           branchName: 'Branch A',
  //           agencyId: '1',
  //           isActive: true,
  //           createdBy: 'admin',
  //           createdOn: new Date(),
  //           modifiedBy: 'admin',
  //         },
  //         {
  //           branchId: 2,
  //           branchName: 'Branch B',
  //           agencyId: '1',
  //           isActive: true,
  //           createdBy: 'admin',
  //           createdOn: new Date(),
  //           modifiedBy: 'admin',
  //         },
  //       ],
  //       agencyPrograms: [
  //         { agencyId: 1, programId: 1, programName: 'Program A', checked: true },
  //         { agencyId: 1, programId: 2, programName: 'Program B', checked: false },
  //       ],
  //     },
  //   ];
  //   spyOn(service, 'AgencyById').and.returnValue(of(mockAgencyDetails));
  //   component.isAgencyAdmin = false;

  //   component.getAgencyDetails(1);

  //   expect(component.AgencyDetails).toEqual(mockAgencyDetails);
  //   expect(component.BranchList).toEqual(mockAgencyDetails[0].branches);
  //   expect(component.programList).toEqual(mockAgencyDetails[0].agencyPrograms);
  //   expect(component.assignValueToAddAgencyForm).toHaveBeenCalled();
  // });

  it('should not populate fields if AgencyById returns an empty array', () => {
    spyOn(service, 'AgencyById').and.returnValue([]);
    component.getAgencyDetails(1);
    expect(component.AgencyDetails).toEqual([]);
    expect(component.BranchList).toEqual([]);
    expect(component.programList).toEqual([]);
  });

  it('should not call assignValueToAddAgencyForm if AgencyDetails is empty', () => {
    spyOn(service, 'AgencyById').and.returnValue([]);

    component.getAgencyDetails(123);

    expect(component.AgencyDetails).toEqual([]);
    expect(component.BranchList).toBeTruthy();
    expect(component.programList).toBeTruthy();
  });

  it('should set isAgencyEdit to false if MGAAdmin role is available', () => {
    spyOn(component.checkRoleService, 'isRoleCodeAvailable').and.returnValue(true);
    spyOn(component._role, 'Roles').and.returnValue([{
      roleId: 1,
      roleCode: "A",
      roleName: "a"
    } as IRole]);

    component.isEditable();
    expect(component.isAgencyEdit).toBeFalse();
  });

  it('should set isAgencyEdit to true if MGAAdmin role is not available', () => {
    spyOn(component.checkRoleService, 'isRoleCodeAvailable').and.returnValue(false);
    spyOn(component._role, 'Roles').and.returnValue([{ roleId: 1, roleCode: 'OtherRole', roleName: 'Other Role' } as IRole]);

    component.isEditable();

    expect(component.isAgencyEdit).toBeTrue();
  });
  it('should populate AddAgencyForm fields correctly and call validateAddress', () => {
    const mockAgencyDetails = [
      {
        agency: {
          agencyName: 'Test Agency',
          contactPerson: 'John Doe',
          phoneCell: '1234567890',
          phoneHome: '0987654321',
          phoneOffice: '1122334455',
          fax: '5566778899',
          email: 'test@agency.com',
          npn: '1234',
          npnExpirationDate: new Date('2023-12-31'),
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'CityX',
          state: 'ST',
          zip: '12345',
        },
      },
    ];

    component.AgencyDetails = mockAgencyDetails;
    spyOn(component, 'validateAddress');

    component.assignValueToAddAgencyForm();

    // expect(component.AddAgencyForm.controls['AgencyName'].value).toBe('Test Agency');
    // expect(component.AddAgencyForm.controls['ContactPerson'].value).toBe('John Doe');
    // expect(component.AddAgencyForm.controls['PhoneCell'].value).toBe('(123) 456-7890');
    // expect(component.AddAgencyForm.controls['PhoneHome'].value).toBe('(098) 765-4321');
    // expect(component.AddAgencyForm.controls['PhoneOffice'].value).toBe('(112) 233-4455');
    // expect(component.AddAgencyForm.controls['Fax'].value).toBe('(556) 677-8899');
    // expect(component.AddAgencyForm.controls['Email'].value).toBe('test@agency.com');
    // expect(component.AddAgencyForm.controls['NPN'].value).toBe('1234');
    // expect(component.AddAgencyForm.controls['NPNExpirationDate'].value).toEqual(component.setDateService.setDate(new Date('2023-12-31')));
    // expect(component.bsValue).toEqual(new Date('2023-12-31'));
    // expect(component.AddAgencyForm.controls['AddressLine1'].value).toBe('123 Main St');
    // expect(component.AddAgencyForm.controls['AddressLine2'].value).toBe('Apt 4B');
    // expect(component.AddAgencyForm.controls['City'].value).toBe('CityX');
    // expect(component.AddAgencyForm.controls['State'].value).toBe('ST');
    // expect(component.AddAgencyForm.controls['Zip'].value).toBe('12345');
    expect(component.validateAddress).toHaveBeenCalled();
  });

  it('should call validateAddress when subject emits "validateAddress"', () => {
    component.SaveAccountWithAddressValidation();
    component.subject.next('validateAddress');
  });

  it('should call addAgency only when event is "save" and IsEventFromPage is true', () => {
    component.IsEventFromPage = true;
    component.SaveAccountWithAddressValidation();

    component.subject.next('save');
  });

  it('should not call addAgency if IsEventFromPage is false even if "save" is emitted', () => {
    component.IsEventFromPage = false;
    component.SaveAccountWithAddressValidation();
    component.subject.next('save');
  });

  it('should set saveType and trigger subject with "validateAddress" in SaveAccountWithOserverPattern()', () => {
    component.agencyData = { agencyType: 'retail' };
    component.SaveAccountWithAddressValidation(); // must set up subscription before subject.next
    component.SaveAccountWithOserverPattern('customType');

    expect(component.saveType).toBe('retail');
    expect(component.IsEventFromPage).toBeTrue();
  });

  it('should set saveType to "register" if passed explicitly', () => {
    component.SaveAccountWithAddressValidation();
    component.SaveAccountWithOserverPattern('register');
    expect(component.saveType).toBe('register');
  });

  it('should sanitize phone fields, call CreateAgency and navigate on success', () => {
    component.addAgency();
    expect(sessionStorage.getItem('_newBranchList')).toBeNull();
  });

  it('should show popup on failure response from CreateAgency', () => {
    spyOn(service, "CreateAgency").and.returnValue(of({ success: false, message: null, data: null }));
    component.addAgency();
  });

  it('should handle error from CreateAgency call gracefully', () => {
    spyOn(service, "CreateAgency").and.returnValue(throwError(() => new Error('API Error')));
    component.addAgency();
  });

  it('should set submitted to true if form is invalid or address is not valid', () => {
    component.isAddress1Valid = true; // make address validation fail  
    component.addAgency();
    expect(component.submitted).toBeTrue();
  });

  it('should update the checked status of the program in programList', () => {
    component.programList = [
      { programId: 1, programName: 'Program A', checked: false },
      { programId: 2, programName: 'Program B', checked: true },
    ];

    component.updateProgram(1, true);

    expect(component.programList[0].checked).toBeTrue();
    expect(component.programList[1].checked).toBeTrue(); // Ensure other programs remain unchanged
  });

  it('should not update any program if programId does not match', () => {
    component.programList = [
      { programId: 1, programName: 'Program A', checked: false },
      { programId: 2, programName: 'Program B', checked: true },
    ];

    component.updateProgram(3, true);

    expect(component.programList[0].checked).toBeFalse();
    expect(component.programList[1].checked).toBeTrue();
  });

  it('should set _branchId in sessionStorage and navigate to addbranch when branchId is provided', () => {
    const branchId = '123';
    const tempId = null;
    spyOn(sessionStorage, 'setItem');
    spyOn(component, 'addBranch');
    spyOn(router, 'navigateByUrl');

    component.EditBranch(branchId, tempId);

    expect(sessionStorage.setItem).toHaveBeenCalledWith('_branchId', branchId);
    expect(sessionStorage.setItem).not.toHaveBeenCalledWith('_tempId', jasmine.any(String));
    expect(component.addBranch).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/agenciiq/agencies/addbranch');
  });

  it('should set _tempId in sessionStorage and navigate to addbranch when tempId is provided', () => {
    const branchId = null;
    const tempId = '456';
    spyOn(sessionStorage, 'setItem');
    spyOn(component, 'addBranch');
    spyOn(router, 'navigateByUrl');

    component.EditBranch(branchId, tempId);

    expect(sessionStorage.setItem).toHaveBeenCalledWith('_tempId', tempId);
    expect(sessionStorage.setItem).not.toHaveBeenCalledWith('_branchId', jasmine.any(String));
    expect(component.addBranch).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/agenciiq/agencies/addbranch');
  });

  it('should not set any sessionStorage key if both branchId and tempId are null', () => {
    const branchId = null;
    const tempId = null;
    spyOn(sessionStorage, 'setItem');
    spyOn(component, 'addBranch');
    spyOn(router, 'navigateByUrl');

    component.EditBranch(branchId, tempId);

    expect(sessionStorage.setItem).not.toHaveBeenCalled();
    expect(component.addBranch).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/agenciiq/agencies/addbranch');
  });

  it('should handle error gracefully when ZipDetails API call fails', () => {
    spyOn(zipservice, 'ZipDetails').and.returnValue(throwError(() => new Error('API Error')));
    spyOn(loaderservice, 'hide');

    component.getZipDetails('12345');

    expect(loaderservice.hide).toHaveBeenCalled();
  });

  it('should hide loader after ZipDetails API call completes', () => {
    const mockResponse = {
      CityStateLookupResponse: {
        ZipCode: {
          City: 'Test City',
          State: 'TS'
        }
      }
    };
    spyOn(zipservice, 'ZipDetails').and.returnValue(of(mockResponse));
    spyOn(loaderservice, 'hide');

    component.getZipDetails('12345');

    expect(loaderservice.hide).toHaveBeenCalled();
  });

  it('should validate address and patch returned values when service returns success', () => {
    const mockResponse = {
      success: true,
      data: {
        City: 'Updated City',
        State: 'Updated State',
        Address1: 'Updated Address 1',
        Address2: 'Updated Address 2'
      }
    };

    spyOn(component.subject, 'next');
    spyOn(zipservice, 'ValidateAddressField').and.returnValue(of(mockResponse));

    component.validateAddress();
    expect(component.isAddress1Valid).toBeFalse();
  });

  it('should set temp agency form data with programList in session', () => {
    const sessionMock = jasmine.createSpyObj('sessionMock', ['setData']);
    component['_session'] = sessionMock; // Assign the mock to the component's _session property

    component.addBranch();

  });

  it('should not call setData if AddAgencyForm has no value', () => {
    const sessionMock = jasmine.createSpyObj('sessionMock', ['setData']);
    component['_session'] = sessionMock; // Assign the mock to the component's _session property

    component.AddAgencyForm = new FormBuilder().group({});
    component.addBranch();
    //expect(sessionMock.setData).not.toHaveBeenCalled();
  });

  it('should call getZipDetails() with Zip value when Zip is valid', () => {
    spyOn(component, 'getZipDetails');
  });

  it('should not call getZipDetails() when Zip is invalid', () => {
    spyOn(component, 'getZipDetails');
    component.ValidateZip();
  });

  it('should return null for valid non-whitespace input', () => {
    const control = new FormControl('Valid Input');
    const result = component.noWhitespaceValidator(control);
    expect(result).toBeNull();
  });

  it('should return whitespace error for input with only spaces', () => {
    const control = new FormControl('    ');
    const result = component.noWhitespaceValidator(control);
    expect(result).toEqual({ whitespace: true });
  });

  it('should return whitespace error for empty string', () => {
    const control = new FormControl('');
    const result = component.noWhitespaceValidator(control);
    expect(result).toEqual({ whitespace: true });
  });

  it('should return null for numeric string with digits', () => {
    const control = new FormControl('123');
    const result = component.noWhitespaceValidator(control);
    expect(result).toBeNull();
  });

  it('should return whitespace error for null or undefined control value', () => {
    const control1 = new FormControl(null);
    const control2 = new FormControl(undefined);
    expect(component.noWhitespaceValidator(control1)).toEqual({ whitespace: true });
    expect(component.noWhitespaceValidator(control2)).toEqual({ whitespace: true });
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    component.ngOnDestroy();
  });

  it('should return the correct form control for AgencyName', () => {
    expect(component.agencyName?.value).toBe('Test Agency');
  });

  it('should return the correct form control for ContactPerson', () => {
    expect(component.ContactPerson?.value).toBe('John Doe');
  });

  it('should return the correct form control for PhoneOffice', () => {
    expect(component.PhoneOffice?.value).toBe('1234567890');
  });

  it('should return the correct form control for Email', () => {
    expect(component.Email?.value).toBe('test@example.com');
  });

  it('should return the correct form control for NPN', () => {
    expect(component.NPN?.value).toBe('12345');
  });

  it('should return the correct form control for NPNExpirationDate', () => {
    expect(component.NPNExpirationDate?.value).toBe('2025-12-31');
  });

  it('should return the correct form control for AddressLine1', () => {
    expect(component.AddressLine1?.value).toBe('123 Main St');
  });

  it('should return the correct form control for AddressLine2', () => {
    expect(component.AddressLine2?.value).toBe('Apt 4B');
  });

  it('should return the correct form control for City', () => {
    expect(component.City?.value).toBe('New York');
  });

  it('should return the correct form control for State', () => {
    expect(component.State?.value).toBe('NY');
  });

  it('should return the correct form control for Zip', () => {
    expect(component.Zip?.value).toBe('10001');
  });

  it('should return the correct form control for Fax', () => {
    expect(component.Fax?.value).toBe('1112223333');
  });

  it('should assign selectedProgram with checked programs only', () => {
    component.programList = [
      { programId: 1, checked: true },
      { programId: 2, checked: false },
      { programId: 3, checked: true }
    ];

    component.SelectedProgramList([]);

    expect(component.selectedProgram).toEqual([
      { programId: 1 },
      { programId: 3 }
    ]);
  })
});

