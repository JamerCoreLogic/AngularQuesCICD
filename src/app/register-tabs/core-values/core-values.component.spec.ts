import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CoreValuesComponent } from './core-values.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from '../../shared-material/shared-material.module';
import { ChangeDetectorRef } from '@angular/core';

interface CoreValueControl {
  controlId: number;
  questionText: string;
  controlType: string;
  options: string[];
  maxLength: number;
  isMandatory: boolean;
  controlValue: string;
}

interface CoreValueHeader {
  headerText: string;
  headerId: number;
}

interface CoreValueData {
  header: CoreValueHeader;
  controls: CoreValueControl[];
}

describe('CoreValuesComponent', () => {
  let component: CoreValuesComponent;
  let fixture: ComponentFixture<CoreValuesComponent>;
  let formBuilder: FormBuilder;
  let cdr: ChangeDetectorRef;

  const mockCoreValuesData: CoreValueData[] = [
    {
      header: {
        headerText: 'Test Header 1',
        headerId: 1
      },
      controls: [
        {
          controlId: 1,
          questionText: 'Test Question 1',
          controlType: 'text',
          options: [],
          maxLength: 100,
          isMandatory: true,
          controlValue: ''
        }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoreValuesComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedMaterialModule
      ],
      providers: [
        FormBuilder,
        ChangeDetectorRef
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreValuesComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  beforeEach(fakeAsync(() => {
    // Mock fetch for each test
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockCoreValuesData)
      } as Response)
    );

    // Initialize component
    component.ngOnInit();
    tick();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data from JSON', () => {
    expect(component.coreValuesData).toEqual(mockCoreValuesData);
    expect(component.coreValuesForm).toBeDefined();
    expect(component.headers.length).toBe(1);
  });

  it('should create header group correctly', () => {
    const headerGroup = component.createHeaderGroup(mockCoreValuesData[0]);
    
    expect(headerGroup.get('headerText')?.value).toBe('Test Header 1');
    expect(headerGroup.get('headerId')?.value).toBe(1);
    expect(headerGroup.get('controls')).toBeDefined();
  });

  it('should create control group correctly', () => {
    const controlGroup = component.createControlGroup(mockCoreValuesData[0].controls[0]);
    
    expect(controlGroup.get('controlId')?.value).toBe(1);
    expect(controlGroup.get('questionText')?.value).toBe('Test Question 1');
    expect(controlGroup.get('controlType')?.value).toBe('text');
    expect(controlGroup.get('isMandatory')?.value).toBeTrue();
  });

  it('should get headers form array', () => {
    expect(component.headers).toBeDefined();
    expect(component.headers.length).toBe(1);
  });

  it('should get controls for a header group', () => {
    const headerGroup = component.headers.at(0);
    const controls = component.getControls(headerGroup);
    
    expect(controls).toBeDefined();
    expect(controls.length).toBe(1);
  });

  it('should disable form in view mode', () => {
    component.isCoreValuesFormView();
    expect(component.coreValuesForm.disabled).toBeTrue();
  });

  it('should handle post user data', () => {
    const editData = [...mockCoreValuesData];
    component.PostUserData(editData);
    
    expect(component.coreValuesData).toEqual(editData);
    expect(component.coreValuesForm).toBeDefined();
    expect(component.headers.length).toBe(1);
  });

  it('should validate form and return formatted data', () => {
    const result = component.isCoreValuesFormValid();
    
    expect(result).toBeDefined();
    expect(result.coreValuesForm).toBeDefined();
    expect(result.coreValuesForm[0].header.headerId).toBe(1);
    expect(result.coreValuesForm[0].controls[0].controlId).toBe(1);
  });

 

  it('should handle form array operations', () => {
    const headerGroup = component.headers.at(0);
    const controls = component.getControls(headerGroup);
    
    expect(headerGroup).toBeDefined();
    expect(controls).toBeDefined();
    expect(controls.length).toBe(1);
  });

  it('should preserve form structure after reset', () => {
    const initialLength = component.headers.length;
    component.reset();
    
    expect(component.headers.length).toBe(initialLength);
    expect(component.getControls(component.headers.at(0)).length).toBe(1);
  });

  it('should handle user type from localStorage', () => {
    const mockUserType = '1';
    spyOn(localStorage, 'getItem').and.returnValue(mockUserType);
    
    // Re-create component to trigger constructor
    fixture = TestBed.createComponent(CoreValuesComponent);
    component = fixture.componentInstance;
    
    expect(component.userType).toBe(1);
  });

  it('should handle form validation with empty values', () => {
    const result = component.isCoreValuesFormValid();
    expect(result.coreValuesForm[0].controls[0].controlValue).toBe('');
  });
});
