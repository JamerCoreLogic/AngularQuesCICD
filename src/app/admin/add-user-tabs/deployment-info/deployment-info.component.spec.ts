import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { DeploymentInfoComponent } from './deployment-info.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatLegacyDialog, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';

// Mock Services
class MockAuthService {
  getUserData() {
    return of({ userId: 123 });
  }

  getStates(val: number) {
    const mockStates = { data: [{ stateName: 'TestState' }] };
    return of(mockStates);
  }

  GetSurveysByAdjusterId(requestData: any) {
    return of({ data: [
      { title: 'Survey1', createOn: '2021-01-01', submittedOn: '2021-01-02', surveyLinkID: '123'},
      { title: 'Survey2', createOn: '2021-02-01', submittedOn: '2021-02-02', surveyLinkID: null}
    ]});
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('DeploymentInfoComponent', () => {
  let component: DeploymentInfoComponent;
  let fixture: ComponentFixture<DeploymentInfoComponent>;
  let authService: AuthService;
  let dialog: MatLegacyDialog;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DeploymentInfoComponent 
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatLegacyDialogModule, // Required for MatDialog
        SharedMaterialModule, // Required for Material
        NoopAnimationsModule, 
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatLegacyDialog, useClass: MockMatDialog }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentInfoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatLegacyDialog);
    component.userType = 2; // Setting userType for testing.
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.deploymentInfoForm).toBeDefined();
    expect(component.deploymentInfoForm.get('availabilityStatus')?.value).toBe('Available');
    expect(component.deploymentInfoForm.get('availabilityDate')?.value).toBeNull();
    expect(component.deploymentInfoForm.get('claimCapacity')?.value).toBeNull();
  });

  it('should load states when country changes', fakeAsync(() => {
    const spyGetStates = spyOn(authService, 'getStates').and.callThrough();
    component.deploymentInfoForm.get('deploymentCountry')?.setValue('United States');
    tick();
    expect(spyGetStates).toHaveBeenCalledWith(1);
    expect(component.StatesList).toEqual([{ stateName: 'TestState' }]);
  }));

 



  it('isDeploymentInfoFormValid should return false if invalid form', () => {
    component.deploymentInfoForm.get('availabilityStatus')?.setValue('Unavailable');
    // Not providing date to make it invalid
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ value: true, isConfirmed: true, isDenied: false, isDismissed: false }));
    const result = component.isDeploymentInfoFormValid();
    expect(result).toBeFalse();
    expect(swalSpy).toHaveBeenCalled();
  });

  it('isDeploymentInfoFormValid should return form data if valid', () => {
    component.deploymentInfoForm.get('availabilityStatus')?.setValue('Available');
    component.deploymentInfoForm.get('claimCapacity')?.setValue(500);
    expect(component.isDeploymentInfoFormValid()).toEqual({ 
      deploymentInfoForm: component.deploymentInfoForm.getRawValue() 
    });
  });


  it('should fetch user data on getUserData call and load survey list', fakeAsync(() => {
    const spyGetUserData = spyOn(authService, 'getUserData').and.callThrough();
    const spyLoadSurvey = spyOn(authService, 'GetSurveysByAdjusterId').and.callThrough();

    component.getUserData();
    tick();
    fixture.detectChanges();

    expect(spyGetUserData).toHaveBeenCalled();
    expect(spyLoadSurvey).toHaveBeenCalled();
    expect(component.surveyList.data.length).toBe(2);
  }));



  





  it('should set the correct zip and state labels for U.S. and Canada', () => {
    component.deploymentInfoForm.get('deploymentCountry')?.setValue('United States');
    component.getStateZipLabel();
    expect(component.zipLabel).toBe('Zip');
    expect(component.stateLabel).toBe('State');

    component.deploymentInfoForm.get('deploymentCountry')?.setValue('Canada');
    component.getStateZipLabel();
    expect(component.zipLabel).toBe('Postal Code');
    expect(component.stateLabel).toBe('Province');
  });


});
