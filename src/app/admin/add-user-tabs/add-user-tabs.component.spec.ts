import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddUserTabsComponent } from './add-user-tabs.component';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef } from '@angular/core';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// ---- Child Component Stubs ----
@Component({
  selector: 'app-basic-info',
  template: ''
})
class BasicInfoStubComponent {
  @Input() someInput: any;
  reset() {}
  isBasicInfoFormValid() { return { basicInfoForm: { userId: 123, isActive: true, isLocked: false, firstName: 'John', lastName: 'Doe' } }; }
  isBasicInfoFormDirty() { return false; }
  PostUserData(data: any) {}
  isAdjusterLead() { return false; }
  clearValidationForInternal() { return true; }
}

@Component({
  selector: 'app-additional-info',
  template: ''
})
class AdditionalInfoStubComponent {
  reset() {}
  isAdditionalInfoFormValid() { return { additionalInfoForm: { approximate_Date_I_Began_Adjusting: '', i_Am_Interested_In_The_Following_Assignments: '' } }; }
  isAdditionalInfoFormDirty() { return false; }
  PostUserData(data: any) {}
  clearValidationForInternal() { return true; }
}

@Component({
  selector: 'app-liences-and-certification',
  template: ''
})
class LiencesAndCertificationStubComponent {
  reset() {}
  isCertificateFormValid() { return { licenceAndCertificateForm: {} }; }
  isCertificateFormDirty() { return false; }
  PostUserData(data: any) {}
  clearValidationForInternal() { return true; }
}

@Component({
  selector: 'app-deployment-info',
  template: ''
})
class DeploymentInfoStubComponent {
  reset() {}
  isDeploymentInfoFormValid() { return { deploymentInfoForm: {} }; }
  PostUserData(data: any) {}
}

@Component({
  selector: 'app-internal-info',
  template: ''
})
class InternalInfoStubComponent {
  reset() {}
  isInternalInfoFormValid() { return { internalInfoForm: {} }; }
  PostUserData(data: any) {}
}

@Component({
  selector: 'app-core-values',
  template: ''
})
class CoreValuesStubComponent {
  reset() {}
  isCoreValuesFormValid() { return { coreValuesForm: {} }; }
  PostUserData(data: any) {}
}

// ---- Mock Services ----
class MockAuthService {
  isUserAllowed(location: Location) { return { isAllow: true, allowedPath: '/login' }; }
  checkUserForSubmit(userId: string) {
    return of(true);
  }
  getUserDataById(userId: any) {
    return of({ success: true, data: [ { userId: 123, firstName: 'John', lastName: 'Doe', licencesPlusCertification: [{}], adjusterInformationInternal: [{}], deploymentData: {}, coreValueQuestions: [] } ] });
  }
  addUser(objData: any) {
    return of({ success: true });
  }
  setUserData(data: any) {}
}

class MockNgxSpinnerService {
  show() {}
  hide() {}
}

describe('AddUserTabsComponent', () => {
  let component: AddUserTabsComponent;
  let fixture: ComponentFixture<AddUserTabsComponent>;
  let authService: MockAuthService;
  let spinner: MockNgxSpinnerService;
  let router: Router;
  let routerEventsSubject: Subject<any>;
  let locationStub: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();

    locationStub = jasmine.createSpyObj('Location', ['back']);
    authService = new MockAuthService();
    spinner = new MockNgxSpinnerService();

    await TestBed.configureTestingModule({
      declarations: [
        AddUserTabsComponent,
        BasicInfoStubComponent,
        AdditionalInfoStubComponent,
        LiencesAndCertificationStubComponent,
        DeploymentInfoStubComponent,
        InternalInfoStubComponent,
        CoreValuesStubComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedMaterialModule,
        NoopAnimationsModule,
        HttpClientTestingModule,

      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: Location, useValue: locationStub },
        ChangeDetectorRef
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserTabsComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOnProperty(router, 'events').and.returnValue(routerEventsSubject.asObservable());

    // Mock sessionStorage items
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'LoggedUserType') return '2';
      if (key === 'LoggedUserRole') return '2';
      return null;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isFirstTab).toBeTrue();
    expect(component.isLastTab).toBeFalse();
    expect(component.activeTabIndex).toBe(0);
  });

  it('should navigate back using previousUrl if available', () => {
    (component as any).previousUrl = '/main/admin';
    spyOn(router, 'navigateByUrl');
    component.navigateBack();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/main/admin');
  });

  it('should call location.back if previousUrl is not available', () => {
    (component as any).previousUrl = '';
    component.navigateBack();
    expect(locationStub.back).toHaveBeenCalled();
  });

  it('should handle tab change and remain on same tab if current tab is invalid', () => {
    // Make the basic info form invalid for this test
    const basicInfoComp = fixture.debugElement.query(By.directive(BasicInfoStubComponent)).componentInstance;
    spyOn(basicInfoComp, 'isBasicInfoFormValid').and.returnValue(false);

    const tabGroup = fixture.debugElement.query(By.directive(MatTabGroup)).componentInstance as MatTabGroup;
    tabGroup.selectedIndex = 1;
    fixture.detectChanges();

    // The component listens to tab change event
    // simulate the event
    component.tabChanged({ index: 1, tab: null } as any);

    // Should remain on tab 0 since validation failed
    expect(component.activeTabIndex).toBe(0);
  });

  it('should proceed to next tab if form is valid', () => {
    const basicInfoComp = fixture.debugElement.query(By.directive(BasicInfoStubComponent)).componentInstance;
    spyOn(basicInfoComp, 'isBasicInfoFormValid').and.returnValue({ basicInfoForm: { userId: 123 } });

    const tabGroup = fixture.debugElement.query(By.directive(MatTabGroup)).componentInstance as MatTabGroup;
    tabGroup.selectedIndex = 1;
    fixture.detectChanges();

    component.tabChanged({ index: 1, tab: null } as any);
    expect(component.activeTabIndex).toBe(1);
  });



  it('should save and submit user data successfully', fakeAsync(() => {
    spyOn(component, 'convertToString').and.callThrough();
    spyOn(authService, 'addUser').and.returnValue(of({ success: true }));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    // Set tabCount and forms to be valid
    component.tabCount = 1; 
    component.saveAndSubmit('submit');
    tick();

    expect(authService.addUser).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  }));

  it('should handle canDeactivate when form is not dirty', () => {
    spyOn(component, 'isCurrentTabFormdirty').and.returnValue(false);
    const result = component.canDeactivate();
    expect(result).toBeTrue();
  });

});
