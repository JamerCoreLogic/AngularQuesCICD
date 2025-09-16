import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { of, throwError } from 'rxjs';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { FiltersComponent } from './filters/filters.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedMaterialModule } from '../shared-material/shared-material.module';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PhoneMaskPipe } from '../Pipes/phone-mask.pipe';

/* --------------------------------------------------------------------------
 * Mock Services
 * -------------------------------------------------------------------------- */
class MockAuthService {
  GetUserResources() {
    return of({
      success: true,
      message: null,
      errorCode: null,
      data: {
        totalResources: 529,
        fpdUsers: 27,
        percentage: 94.9,
        nonFpdUserPercentage: 94.9,
        fpdUserPercentage: 5.1,
      },
    });
  }

  getUserRoles() {
    return of({
      data: [
        { roleId: 4, role: 'Adjuster' },
        { roleId: 2, role: 'Admin' },
        { roleId: 3, role: 'Employee' },
        { roleId: 1, role: 'Super Admin' },
      ],
      success: true,
      message: null,
      errorCode: null,
    });
  }

  getUserType() {
    return of({
      data: [
        { typeId: 2, type: 'External User' },
        { typeId: 1, type: 'Internal User' },
      ],
      success: true,
      message: null,
      errorCode: null,
    });
  }

  // This method is called for table data (pagination)
  GetUserListForAdminDashboard(data: any) {
    return of({
      data: {
        getUserListForDashboardWithPagination: [
          {
            name: 'John Doe',
            emailAddress: 'john.doe@example.com',
            roleCsv: 'Adjuster',
            userId: '1062',
            mobile: '1245865645',
            state: 'Georgia',
            status: 'Active',
            lastLogin: '2024-12-24T00:00:00',
            isActive: true,
            isLocked: false,
            failedLoginStatus: 'Unlocked',
            modifiedOn: '2024-12-24T00:00:00',
            userType: 'Internal user',
            fileTracId: 0,
          },
        ],
        resourceCount: 529,
      },
      success: true,
      message: null,
      errorCode: null,
    });
  }

  deleteUser(userId: number) {
    return of(true);
  }

  lockProfile(userId: number) {
    return of(true);
  }

  unLockprofile(userId: number) {
    return of(true);
  }

  updateResetPassword(obj: any) {
    return of({ success: true });
  }

  isUserAllowed(){
    return { isAllow: true, allowedPath: '/login' };
  }

  getClients() {
    return of({
      data: [
        { clientId: 1, clientName: 'Client 1' },
        { clientId: 2, clientName: 'Client 2' }
      ],
      success: true,
      message: null,
      errorCode: null
    });
  }
}

class MockSpinnerService {
  show() {}
  hide() {}
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(true),
    };
  }
}

/* --------------------------------------------------------------------------
 * Test Suite
 * -------------------------------------------------------------------------- */
describe('AdminComponent (Jasmine)', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let authService: MockAuthService;
  let spinner: NgxSpinnerService;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    // Prepare SweetAlert2 spy for all tests
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));

    await TestBed.configureTestingModule({
      declarations: [AdminComponent, FiltersComponent,PhoneMaskPipe],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatLegacyDialogModule,
        SharedMaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MockAuthService, useClass: MockAuthService },
        { provide: NgxSpinnerService, useClass: MockSpinnerService },
        { provide: Router, useClass: MockRouter },
        { provide: MatDialog, useClass: MockMatDialog },

      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(MockAuthService);
    spinner = TestBed.inject(NgxSpinnerService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);

    // Mock sessionStorage for required data
    window.sessionStorage.setItem('LoggeduserId', '123');
    window.sessionStorage.setItem('LoggedUserType', '1'); // 1= Internal user
    window.sessionStorage.setItem('LoggedUserRole', '3'); // 3= Employee
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('should create the AdminComponent', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  
  





  it('should show the spinner and call getTableData$ on ngAfterViewInit when paginator emits', fakeAsync(() => {
    const spyGetTableData$ =spyOn(component, 'getTableData$').and.returnValue(
      of({
        data: {
          getUserListForDashboardWithPagination: [],
          resourceCount: 0
        }
      })
    );
    const spySpinnerShow = spyOn(spinner, 'show').and.callThrough();
    const spySpinnerHide = spyOn(spinner, 'hide').and.callThrough();

    fixture.detectChanges(); // ngOnInit
    component.ngAfterViewInit(); // Manually trigger ngAfterViewInit

    tick(); // let the observable stream proceed
    expect(spySpinnerShow).toHaveBeenCalled();
    expect(spyGetTableData$).toHaveBeenCalled();
    expect(spySpinnerHide).toHaveBeenCalled();

    flush();
  }));



  it('should handle sorting changes via sortData', () => {
    fixture.detectChanges();
    const spyApplyFilter = spyOn(component, 'applyFilter').and.callFake(() => {});

    component.sortData({ active: 'modifiedOn', direction: 'asc' });
    expect(component.sortField).toBe('modifiedOn');
    expect(component.sortOrder).toBe('asc');
    expect(spyApplyFilter).toHaveBeenCalled();
  });



 

  it('should disable editing if user has forbidden roles (Admin, Super Admin, Employee)', () => {
    // Adjuster => isEditable = true
    let result = component.isEditable('Adjuster');
    expect(result).toBeTrue();

    // Admin => isEditable = false
    result = component.isEditable('Admin');
    expect(result).toBeFalse();

    // Super Admin => isEditable = false
    result = component.isEditable('Super Admin');
    expect(result).toBeFalse();

    // Employee => isEditable = false
    result = component.isEditable('Employee');
    expect(result).toBeFalse();
  });

  it('should open ChangeAndResetPasswordComponent in a dialog on openDialogeChangeResetPass method call', () => {
    const user = { userId: 999 };
    const spyDialog = spyOn(dialog, 'open').and.callThrough();

    component.openDialogeChangeResetPass(user);
    expect(spyDialog).toHaveBeenCalled();
  });

 

 

  describe('downloadExcel', () => {
    it('should call spinner.show and getTableData$ to fetch all data for download', fakeAsync(() => {
      const spySpinnerShow = spyOn(spinner, 'show').and.callThrough();
      const spySpinnerHide = spyOn(spinner, 'hide').and.callThrough();
      const spyGetTableData$ = spyOn(component, 'getTableData$').and.returnValue(
  of({
    data: {
      getUserListForDashboardWithPagination: [],
      resourceCount: 0
    }
  })
);

      fixture.detectChanges();
      component.downloadExcel();
      tick();

      expect(spySpinnerShow).toHaveBeenCalled();
      expect(spyGetTableData$).toHaveBeenCalled();
      expect(spySpinnerHide).toHaveBeenCalled();

      flush();
    }));

   
  });

 

  describe('shouldShowDownloadButton', () => {
   

    it('should return false if user is adjuster or loggedUserTypeCheck != 1', () => {
      const currentUser = {
        data: {
          role: [
            {
              roleName: 'Adjuster',
              userPageList: [] as any[],
            },
          ],
        },
      };
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      component.loggedUserRes = currentUser;
      component.loggedUserTypeCheck = 2; // not 1
      fixture.detectChanges();

      const result = component.shouldShowDownloadButton();
      expect(result).toBeFalse();
    });
  });


});
