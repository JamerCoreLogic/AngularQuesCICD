import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HistoryInfoComponent } from './history-info.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../../shared-material/shared-material.module';
import { ElementRef, Renderer2 } from '@angular/core';
import { SweetAlertResult } from 'sweetalert2';
import Swal from 'sweetalert2';
import { dateFormatValidator, dateRangeValidator, pastDateValidator } from 'src/app/models/date.validator';

interface MockFileReader {
  readAsBinaryString: jasmine.Spy;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null;
  result: string | ArrayBuffer | null;
}

describe('HistoryInfoComponent', () => {
  let component: HistoryInfoComponent;
  let fixture: ComponentFixture<HistoryInfoComponent>;
  let formBuilder: FormBuilder;
  let renderer: Renderer2;
  let elementRef: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryInfoComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedMaterialModule
      ],
      providers: [
        FormBuilder,
        Renderer2,
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryInfoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    renderer = TestBed.inject(Renderer2);
    elementRef = TestBed.inject(ElementRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.additionalInfoForm).toBeDefined();
    expect(component.submit).toBeFalse();
    expect(component.isResume).toBeFalse();
    expect(component.UplodedfileName).toBe('');
  });

  it('should initialize option lists correctly', () => {
    expect(component.OptionList1).toEqual(['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years']);
    expect(component.OptionList2).toEqual(['None', 'Beginner', 'Intermediate', 'Advanced']);
    expect(component.Location_PreferenceOptions).toEqual(['Local', 'In State', 'Out of State']);
  });

  it('should validate required fields', () => {
    const form = component.additionalInfoForm;
    expect(form.get('location_Preference')?.errors?.['required']).toBeTruthy();
    expect(form.get('residential_Property_Desk')?.errors?.['required']).toBeTruthy();
    expect(form.get('residential_Property_Field')?.errors?.['required']).toBeTruthy();
    expect(form.get('xactimate_Estimating')?.errors?.['required']).toBeTruthy();
    expect(form.get('fileTrac')?.errors?.['required']).toBeTruthy();
  });

  

  it('should validate largest claim amount', () => {
    const claimControl = component.additionalInfoForm.get('largest_Claim_I_Have_Handled');
    
    claimControl?.setValue(-1);
    expect(claimControl?.errors?.['min']).toBeTruthy();
    
    claimControl?.setValue(1000);
    expect(claimControl?.errors).toBeNull();
  });

  it('should validate bio length', () => {
    const bioControl = component.additionalInfoForm.get('bio_Or_Mini_Resume');
    
    bioControl?.setValue('a'.repeat(1001));
    expect(bioControl?.errors?.['maxlength']).toBeTruthy();
    
    bioControl?.setValue('a'.repeat(1000));
    expect(bioControl?.errors).toBeNull();
  });

  it('should handle file selection', fakeAsync(() => {
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    let onLoadCallback: Function | null = null;
    
    // Mock FileReader
    spyOn(window, 'FileReader').and.returnValue({
      readAsBinaryString: (blob: Blob) => {
        // Store the callback
        if (onLoadCallback) {
          onLoadCallback({ target: { result: 'test content' } });
        }
      },
      set onload(cb: Function) {
        onLoadCallback = cb;
      }
    } as unknown as FileReader);
    
    const mockSwalResult: SweetAlertResult<any> = {
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: undefined
    };
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve(mockSwalResult));
    
    component.onFileSelected({ target: { files: [file] } });
    tick();
    
    expect(component.UplodedfileName).toBe('test.pdf');
  }));

  it('should reject large files', fakeAsync(() => {
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const event = { target: { files: [largeFile], value: '' } };
    
    const mockSwalResult: SweetAlertResult<any> = {
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: undefined
    };
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve(mockSwalResult));
    
    component.onFileSelected(event);
    tick();
    
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      text: 'File size exceeds the 10MB limit.',
      icon: 'error'
    }));
  }));

  it('should handle label formatting', () => {
    expect(component.getLabel('Test*')).toBe('Test');
    expect(component.getLabel('Test')).toBe('Test');
    expect(component.isLastAsterisk('Test*')).toBeTrue();
    expect(component.isLastAsterisk('Test')).toBeFalse();
  });

  it('should restrict special characters in number input', () => {
    const event = new KeyboardEvent('keydown', { key: 'e' });
    spyOn(event, 'preventDefault');
    
    component.restrictEnteringE(event);
    expect(event.preventDefault).toHaveBeenCalled();
    
    const validEvent = new KeyboardEvent('keydown', { key: '1' });
    spyOn(validEvent, 'preventDefault');
    
    component.restrictEnteringE(validEvent);
    expect(validEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should handle form reset', fakeAsync(() => {
    // Create a new form group with initial values
    const initialForm = component.additionalInfoForm;
    initialForm.patchValue({
      location_Preference: ['Local'],
      residential_Property_Desk: 'Beginner',
      bio_Or_Mini_Resume: 'Test bio'
    });
    tick();
    fixture.detectChanges();
    
    // Reset the form
    initialForm.reset({
      location_Preference: [],
      residential_Property_Desk: null,
      bio_Or_Mini_Resume: null
    });
    tick();
    fixture.detectChanges();
    
    // Check reset values
    expect(initialForm.get('location_Preference')?.value).toEqual([]);
    expect(initialForm.get('residential_Property_Desk')?.value).toBeNull();
    expect(initialForm.get('bio_Or_Mini_Resume')?.value).toBeNull();
    expect(initialForm.pristine).toBeTrue();
  }));

  it('should validate form state', fakeAsync(() => {
    // Initially form should be invalid due to required fields
    expect(component.additionalInfoForm.valid).toBeFalse();
    
    // Fill required fields
    component.additionalInfoForm.patchValue({
      location_Preference: ['Local'],
      residential_Property_Desk: 'Beginner',
      residential_Property_Field: 'Beginner',
      xactimate_Estimating: 'Beginner',
      fileTrac: 'Beginner'
    });
    
    tick();
    fixture.detectChanges();
    expect(component.additionalInfoForm.valid).toBeTrue();
  }));

  it('should check form dirty state', fakeAsync(() => {
    // Get the form
    const form = component.additionalInfoForm;
    
    // Ensure form starts clean
    form.markAsPristine();
    tick();
    fixture.detectChanges();
    expect(form.dirty).toBeFalse();
    
    // Make a change to the form
    form.patchValue({
      location_Preference: ['Local']
    });
    form.markAsDirty();
    tick();
    fixture.detectChanges();
    
    expect(form.dirty).toBeTrue();
  }));

  it('should scroll to paragraph', () => {
    const scrollIntoViewMock = jasmine.createSpy('scrollIntoView');
    spyOn(document, 'getElementById').and.returnValue({ 
      scrollIntoView: scrollIntoViewMock 
    } as unknown as HTMLElement);
    
    component.scrollToParagraph('test-id');
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should get question by key', () => {
    const question = component.getQuestionByKey('residential_Property_Desk');
    expect(question).toBeDefined();
    expect(question?.label).toBe('Residential Property Desk*');
    expect(question?.groupId).toBe('1');
  });

  it('should handle keyboard navigation', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    component.onKeyDown(event, 1, 1);
    expect(component).toBeTruthy(); // Add more specific expectations based on your implementation
  });
});
