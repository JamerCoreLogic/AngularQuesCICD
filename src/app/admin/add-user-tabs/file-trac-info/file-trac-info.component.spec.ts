import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FileTracInfoComponent } from './file-trac-info.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { ChartsModule } from '@progress/kendo-angular-charts';

class MockAuthService {
  GetFileTracId(payload: any) {
    return of({ data: 12345 });
  }

  GetFileTracDataGroupByYear(fileTracId: number) {
    return of({
      data: [
        { year: '2023', totalClaims: 100 },
        { year: '2022', totalClaims: 80 }
      ]
    });
  }

  GetFileTracDataGroupByCompanyName(fileTracId: number) {
    return of({
      data: [
        { companyName: 'Company A', totalClaims: 50 },
        { companyName: 'Company B', totalClaims: 30 }
      ]
    });
  }

  GetTotalNumberOfClaims(fileTracId: number) {
    return of({ data: 130 });
  }

  UpdateFileTracId(payload: any) {
    return of({ success: true, message: 'Updated successfully' });
  }
}

class MockNgxSpinnerService {
  show() {}
  hide() {}
}

describe('FileTracInfoComponent', () => {
  let component: FileTracInfoComponent;
  let fixture: ComponentFixture<FileTracInfoComponent>;
  let authService: AuthService;
  let spinnerService: NgxSpinnerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTracInfoComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        SharedMaterialModule,
        NoopAnimationsModule,
        ChartsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileTracInfoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    spinnerService = TestBed.inject(NgxSpinnerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on component creation', () => {
    expect(component.fileTracForm).toBeDefined();
    expect(component.fileTracForm.get('userId')).toBeDefined();
    expect(component.fileTracForm.get('total_Number_Of_Claim')).toBeDefined();
  });

  it('should get user role from localStorage', () => {
    localStorage.setItem('LoggedUserRole', '1');
    component.getRoleData();
    expect(component.role).toBe(1);
  });

  it('should get user data from localStorage', () => {
    const mockUser = { userId: 123, Email: 'test@test.com' };
    localStorage.setItem('editUser', JSON.stringify(mockUser));
    component.getUserData();
    expect(component.userData).toEqual(mockUser);
  });

  it('should fetch FileTrac ID', fakeAsync(() => {
    spyOn(authService, 'GetFileTracId').and.callThrough();
    component.userData = { userId: 123, Email: 'test@test.com' };
    
    component.getFileTracId();
    tick();

    expect(authService.GetFileTracId).toHaveBeenCalled();
    expect(component.fileTracForm.get('userId')?.value).toBe(12345);
  }));

  it('should fetch FileTrac data and update charts', fakeAsync(() => {
    spyOn(authService, 'GetFileTracDataGroupByYear').and.callThrough();
    spyOn(authService, 'GetFileTracDataGroupByCompanyName').and.callThrough();
    spyOn(authService, 'GetTotalNumberOfClaims').and.callThrough();
    spyOn(spinnerService, 'show').and.callThrough();
    spyOn(spinnerService, 'hide').and.callThrough();
    
    // Initialize userData with fileTracId
    component.userData = { fileTracId: 12345 };
    
    component.getFileTracDataGroupByYear();
    tick();

    expect(spinnerService.show).toHaveBeenCalled();
    expect(component.filetracDataByYear.length).toBe(2);
    expect(component.filetracDataByName.length).toBe(2);
    expect(component.numberzOfClients).toBe(130);
    expect(spinnerService.hide).toHaveBeenCalled();
  }));

 

  it('should format header display correctly', () => {
    expect(component.getHeaderDisplay('year')).toBe('Year');
    expect(component.getHeaderDisplay('totalClaims')).toBe('Total Number of Claims');
    expect(component.getHeaderDisplay('companyName')).toBe('Client Company');
  });

  it('should update FileTrac ID successfully', fakeAsync(() => {
    spyOn(authService, 'UpdateFileTracId').and.callThrough();
    spyOn(component, 'getFileTracDataGroupByYear');
    
    component.userData = { Email: 'test@test.com' };
    component.fileTracForm.controls['userId'].setValue(12345);
    
    component.updateFileTracId();
    tick(); // First tick for UpdateFileTracId
    
    // Simulate the Swal.fire confirmation
    const swalConfirmButton = document.querySelector('.swal2-confirm');
    if (swalConfirmButton) {
      (swalConfirmButton as HTMLElement).click();
    }
    tick(); // Second tick for after-confirmation actions
    
    expect(authService.UpdateFileTracId).toHaveBeenCalledWith({
      email: 'test@test.com',
      fileTracId: 12345
    });
    
    // Clear all remaining timers
    flush();
  }));

  it('should validate number input in keyPressNumbers', () => {
    const validEvent = { which: 49, preventDefault: () => {} }; // Key code for '1'
    const invalidEvent = { which: 65, preventDefault: () => {} }; // Key code for 'A'
    
    spyOn(invalidEvent, 'preventDefault');
    
    expect(component.keyPressNumbers(validEvent)).toBe(true);
    expect(component.keyPressNumbers(invalidEvent)).toBe(false);
    expect(invalidEvent.preventDefault).toHaveBeenCalled();
  });

  it('should disable form for non-admin roles', () => {
    component.role = 3; // Non-admin role
    component.isFileTracIdEdit();
    expect(component.fileTracForm.disabled).toBe(true);
    expect(component.updateBtnAlowed).toBe(false);
  });

  it('should prepare chart data correctly', () => {
    const mockData = [
      { year: '2023', totalClaims: 100 },
      { year: '2022', totalClaims: 80 }
    ];
    
    component.getDataForChart(mockData, []);
    
    expect(component.years).toEqual(['2023', '2022']);
    expect(component.totalNumberOfClaimByYear).toEqual([100, 80]);
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.clear();
  });
});



