import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddParameterDialogComponent } from './add-parameter-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { By } from '@angular/platform-browser';

describe('AddParameterDialogComponent', () => {
  let component: AddParameterDialogComponent;
  let fixture: ComponentFixture<AddParameterDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [AddParameterDialogComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: DialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.addParameterKeyForm).toBeDefined();
    expect(component.modalTitle).toBe('Add Parameter Key');
  });

  it('should have invalid form initially', () => {
    expect(component.addParameterKeyForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.addParameterKeyForm;
    form.patchValue({ ParameterCode: '', DisplayName: '' });

    expect(form.get('ParameterCode')?.valid).toBeFalse();
    expect(form.get('DisplayName')?.valid).toBeFalse();
  });

  it('should close dialog with null on cancel', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
  });

  it('should close dialog with parameter data on valid form submission', () => {
    component.addParameterKeyForm.patchValue({
      ParameterCode: 'CODE123',
      DisplayName: 'Sample Display'
    });

    component.saveParameterKey();

    expect(dialogRefSpy.close).toHaveBeenCalledWith([{
      ParameterId: 0,
      ParameterKey: 'CODE123',
      ParameterAlias: 'Sample Display'
    }]);
  });

  it('should set submitted to true on invalid form submission', () => {
    component.addParameterKeyForm.patchValue({
      ParameterCode: '',
      DisplayName: ''
    });

    component.saveParameterKey();

    expect(component.submitted).toBeTrue();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should return form controls correctly', () => {
    expect(component.ParameterCode).toBe(component.addParameterKeyForm.get('ParameterCode'));
    expect(component.DisplayName).toBe(component.addParameterKeyForm.get('DisplayName'));
  });
});