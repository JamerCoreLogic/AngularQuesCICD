import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreValuesComponent } from './core-values.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedMaterialModule } from 'src/app/shared-material/shared-material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CoreValuesComponent', () => {
  let component: CoreValuesComponent;
  let fixture: ComponentFixture<CoreValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoreValuesComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule, // Required for HttpClient testing
        MatDialogModule, // Required for MatDialog
        SharedMaterialModule, // Required for Material
        NoopAnimationsModule, 
      ],
      providers: [
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }, // Mock ChangeDetectorRef
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test for component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for form initialization
  it('should initialize the form with headers and controls', (done) => {
    // Mock the fetch response
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              header: { headerId: 1, headerText: 'Header 1' },
              controls: [
                {
                  controlId: 1,
                  questionText: 'Question 1',
                  controlType: 'text',
                  options: [] as any[],
                  isMandatory: true,
                  controlValue: '',
                },
              ],
            },
          ]),
      } as Response)
    );

    component.ngOnInit();

    setTimeout(() => {
      expect(component.coreValuesForm).toBeDefined();
      expect(component.headers.length).toBe(1);

      const firstHeader = component.headers.at(0);
      const controlsArray = component.getControls(firstHeader);
      expect(controlsArray.length).toBe(1);

      done();
    });
  });

  // Test for form reset
  it('should reset the form to initial values', () => {
    component.coreValuesData = [
      {
        header: { headerId: 1, headerText: 'Header 1' },
        controls: [
          {
            controlId: 1,
            questionText: 'Question 1',
            controlType: 'text',
            options: [] as any[],
            isMandatory: true,
            controlValue: '',
          },
        ],
      },
    ];
    component.coreValuesForm = component.fb.group({
      headers: component.fb.array(
        component.coreValuesData.map((header) => component.createHeaderGroup(header))
      ),
    });

    component.reset();

    expect(component.coreValuesForm.get('headers')?.value.length).toBe(1);
  });

  // Test for form view mode
  // it('should disable the form in view mode', () => {
  //   spyOn(component.coreValuesForm, 'disable');
  //   component.isCoreValuesFormView();
  //   expect(component.coreValuesForm.disable).toHaveBeenCalled();
  // });

  // Test for validity of the form
  it('should check if the form is valid and generate output', () => {
    component.coreValuesData = [
      {
        header: { headerId: 1, headerText: 'Header 1' },
        controls: [
          {
            controlId: 1,
            questionText: 'Question 1',
            controlType: 'text',
            options: [] as any[],
            isMandatory: true,
            controlValue: 'Answer 1',
          },
        ],
      },
    ];
    component.coreValuesForm = component.fb.group({
      headers: component.fb.array(
        component.coreValuesData.map((header) => component.createHeaderGroup(header))
      ),
    });

    const result = component.isCoreValuesFormValid();
    expect(result.coreValuesForm.length).toBe(1);
    expect(result.coreValuesForm[0].controls[0].controlValue).toBe('Answer 1');
  });

  // Test for setting user data
  it('should set data from parent and initialize form', () => {
    const mockData = [
      {
        header: { headerId: 1, headerText: 'Header 1' },
        controls: [
          {
            controlId: 1,
            questionText: 'Question 1',
            controlType: 'text',
            options: [] as any[],
            isMandatory: true,
            controlValue: '',
          },
        ],
      },
    ];

    component.PostUserData(mockData);
    expect(component.coreValuesData).toEqual(mockData);
    expect(component.headers.length).toBe(1);
  });
});
