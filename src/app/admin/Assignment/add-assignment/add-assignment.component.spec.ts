import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxSpinnerService } from 'ngx-spinner';
import { AddAssignmentComponent } from './add-assignment.component';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('AddAssignmentComponent', () => {
  let component: AddAssignmentComponent;
  let fixture: ComponentFixture<AddAssignmentComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let spinnerService: jasmine.SpyObj<NgxSpinnerService>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['editAssessment', 'addAssessment']);
    spinnerService = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'main/admin/assignment', component: AddAssignmentComponent },
        ]),
        MatLegacyDialogModule,
        SharedMaterialModule,
        NoopAnimationsModule
      ],
      declarations: [ AddAssignmentComponent ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: NgxSpinnerService, useValue: spinnerService },
        { provide: MAT_LEGACY_DIALOG_DATA, useValue: {} },
        FormBuilder
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AddAssignmentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes with default form state', () => {
    expect(component.addAssignmentForm).toBeDefined();
    expect(component.addAssignmentForm.valid).toBeFalsy();
  });



  it('submits valid form for add and shows success message', () => {
    spyOn(component, 'addAssignment').and.callThrough();
    authService.addAssessment.and.returnValue(of({ success: true }));
    spyOn(Swal, 'fire');
    component.addAssignmentForm.controls['type'].setValue('Field Inspection');
    component.addAssignment();
    expect(authService.addAssessment).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success'
    }));
  });

  it('submits valid form for update and shows success message', () => {
    spyOn(component, 'updateAssignment').and.callThrough();
    authService.editAssessment.and.returnValue(of({ success: true }));
    spyOn(Swal, 'fire');
    component.isEdit = 'editAssignmentPage';
    component.data = { type: 'Field Inspection', assessmentTypeId: '123' };
    component.addAssignmentForm.controls['type'].setValue('Updated Type');
    component.updateAssignment();
    expect(authService.editAssessment).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success'
    }));
  });


  it('should navigate correctly', fakeAsync(() => {
    // Mock navigation
    router.navigate(['main/admin/assignment']);
    tick(); // Simulate the passage of time
    expect(location.path()).toBe('/main/admin/assignment');
  }));

  

  it('clears form on clearForm call', () => {
    component.addAssignmentForm.controls['type'].setValue('Type');
    component.clearForm();
    expect(component.addAssignmentForm.controls['type'].value).toBeNull();
  });
});
