import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectNewQuoteOptionComponent } from './select-new-quote-option.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgramService } from '@agenciiq/aqadmin';
import { of } from 'rxjs';
import { MGAProgramsResp } from '@agenciiq/aqadmin/lib/classes/mga-program-resp';

describe('SelectNewQuoteOptionComponent', () => {
  let component: SelectNewQuoteOptionComponent;
  let fixture: ComponentFixture<SelectNewQuoteOptionComponent>;
  let mockProgramService: jasmine.SpyObj<ProgramService>;

  beforeEach(waitForAsync(() => {
    mockProgramService = jasmine.createSpyObj('ProgramService', ['MGAPrograms']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder, ProgramService],
      declarations: [SelectNewQuoteOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNewQuoteOptionComponent);
    component = fixture.componentInstance;
    component.newQuoteOptionForm = new FormBuilder().group({
      LOB: [''],
      State: [{ value: '', disabled: true }]
    });


    component.programData = [
      { lob: 'Auto', state: 'CA' },
      { lob: 'Home', state: 'TX' },
      { lob: 'Auto', state: 'NV' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createNewQuoteOptionForm, getMGAPrograms, and onFormChagne on ngOnInit', () => {
    spyOn((component as any), 'createNewQuoteOptionForm');
    spyOn((component as any), 'getMGAPrograms');
    spyOn((component as any), 'onFormChagne');

    component.ngOnInit();

    expect((component as any).createNewQuoteOptionForm).toHaveBeenCalled();
    expect((component as any).getMGAPrograms).toHaveBeenCalled();
    expect((component as any).onFormChagne).toHaveBeenCalled();
  });

  it('should create newQuoteOptionForm with default values and validators', () => {
    // component.createNewQuoteOptionForm();
    const form = component.newQuoteOptionForm;

    expect(form).toBeTruthy();
    expect(form.get('LOB')).toBeTruthy();
    expect(form.get('State')).toBeTruthy();
    expect(form.get('QuoteType')).toBeTruthy();

    // Check default values
    expect(form.get('LOB')?.value).toBe('');
    expect(form.get('State')?.value).toBe('');
    expect(form.get('QuoteType')?.value).toBe('QQ');

    // Check validators
    form.get('LOB')?.setValue('');
    expect(form.get('LOB')?.valid).toBeFalse();

    form.get('State')?.setValue('');
    expect(form.get('State')?.valid).toBeFalse();

    form.get('QuoteType')?.setValue('');
    expect(form.get('QuoteType')?.valid).toBeFalse();
  });

  it('should disable the State control', () => {
    // component.createNewQuoteOptionForm();
    const stateControl = component.newQuoteOptionForm.get('State');
    expect(stateControl?.disabled).toBeTrue();
  });

  it('should update StateList and enable State control on LOB change', () => {
    (component as any).onFormChagne();
    // Simulate LOB value change
    component.newQuoteOptionForm.controls['LOB'].setValue('Auto');

    expect(component.StateList).toEqual(['CA', 'NV']);
    expect(component.newQuoteOptionForm.controls['State'].enabled).toBeTrue();
  });

});
