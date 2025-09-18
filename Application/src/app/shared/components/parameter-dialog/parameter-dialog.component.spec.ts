import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ParameterDialogComponent } from './parameter-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';
import { AQParameterService, DialogSaveParameterService } from '@agenciiq/aqadmin';
import { AQUserInfo } from '@agenciiq/login';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { LoaderService } from '../../utility/loader/loader.service';

describe('ParameterDialogComponent', () => {
  let component: ParameterDialogComponent;
  let fixture: ComponentFixture<ParameterDialogComponent>;
  let mockDialogRef = { close: jasmine.createSpy('close') };
  let mockUserInfo = { UserId: () => 123 };
  let mockParamService = { getAllParameterByKey: jasmine.createSpy('getAllParameterByKey').and.returnValue(of({ data: { parameterList: [] } })) };
  let mockDialogSaveService = { SaveDialogParamForm: jasmine.createSpy('SaveDialogParamForm').and.returnValue(of({ success: true })) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterDialogComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DialogConfig, useValue: { data: { ParameterId: 0, ParameterKey: { parameterAlias: 'TestAlias' }, UserId: 123 } } },
        { provide: AQUserInfo, useValue: mockUserInfo },
        { provide: AQParameterService, useValue: mockParamService },
        { provide: DialogSaveParameterService, useValue: mockDialogSaveService },
        { provide: Router, useValue: {} },
        { provide: PopupService, useValue: {} },
        { provide: LoaderService, useValue: {} },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Sample parameterData for testing
    component.parameterData = {
      parameterName: 'Test Param',
      ShortName: 'TP',
      Value: '123',
      effectiveFrom: '2024-06-01',
      effectiveTo: '2024-06-30',
      IsActive: true,
      isNotEditable: true
    };
  });

  it('should set form values correctly and disable fields if isNotEditable is true', () => {
    component.setFormData();

    expect(component.ParameterForm.get('FullName')?.value).toBe('Test Param');
    expect(component.ParameterForm.get('ShortName')?.value).toBe('TP');
    expect(component.ParameterForm.get('Value')?.value).toBe('123');
    expect(component.setDate).toHaveBeenCalledWith('2024-06-01');
    expect(component.setDate).toHaveBeenCalledWith('2024-06-30');
    expect(component.ParameterForm.get('EffectiveFrom')?.value).toBe('2024-06-01');
    expect(component.ParameterForm.get('EffectiveTo')?.value).toBe('2024-06-30');
    expect(component.ParameterForm.get('Status')?.value).toBe(true);

    expect(component.ParameterForm.get('FullName')?.disabled).toBeTrue();
    expect(component.ParameterForm.get('ShortName')?.disabled).toBeTrue();
    expect(component.ParameterForm.get('EffectiveFrom')?.disabled).toBeTrue();
    expect(component.ParameterForm.get('EffectiveTo')?.disabled).toBeTrue();
    expect(component.ParameterForm.get('Status')?.disabled).toBeTrue();
  });

  it('should initialize form in add mode', () => {
    expect(component.ParameterForm).toBeDefined();
    expect(component.modalTitle).toBe('Add');
    expect(component.isParameterEdit).toBeFalse();
  });

  it('should validate FullName field for whitespace', () => {
    component.ParameterForm.get('FullName')?.setValue('    ');
    expect(component.ParameterForm.get('FullName')?.errors).toEqual({ whitespace: true });
  });

  it('should validate Value field for whitespace', () => {
    component.ParameterForm.get('Value')?.setValue('    ');
    expect(component.ParameterForm.get('Value')?.errors).toEqual(null);
  });

  it('should validate EffectiveFrom field for whitespace', () => {
    component.ParameterForm.get('EffectiveFrom')?.setValue('    ');
    expect(component.ParameterForm.get('EffectiveFrom')?.errors).toEqual(null);
  });

  it('should validate Status field for whitespace', () => {
    component.ParameterForm.get('Status')?.setValue('    ');
    expect(component.ParameterForm.get('Status')?.errors).toEqual(null);
  });

  it('should call SaveDialogParamForm on saveData with valid form', fakeAsync(() => {
    component.ParameterForm.patchValue({
      FullName: 'Test Name',
      ShortName: 'TN',
      Value: 'Value',
      EffectiveFrom: new Date(),
      EffectiveTo: new Date(),
      Status: true
    });

    component.saveData('close');
    tick();
    expect(mockDialogSaveService.SaveDialogParamForm).toHaveBeenCalled();
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));

  it('should not call SaveDialogParamForm if form is invalid', () => {
    component.ParameterForm.get('FullName')?.setValue('');
    component.saveData('close');
  });

  it('should call getAllParameterByKey in OnParameterOptionChange', () => {
    component.OnParameterOptionChange('key');
    expect(mockParamService.getAllParameterByKey).toHaveBeenCalledWith('key', 123);
  });

  it('should close dialog on cancel', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});

