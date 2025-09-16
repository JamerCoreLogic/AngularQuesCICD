import { core } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-core-values',
  templateUrl: './core-values.component.html',
  styleUrls: ['./core-values.component.scss']
})
export class CoreValuesComponent implements OnInit {
  coreValuesForm!: FormGroup;
  coreValuesData: any[] = [];
  formInitialized = false;
  hasUserData = false;
  userType = Number((localStorage.getItem('LoggedUserType')));

  constructor(public fb: FormBuilder ,private cdr:ChangeDetectorRef, private authService: AuthService) {}

  ngOnInit(): void {
    // Only initialize with default data if we don't have user data
    if (!this.hasUserData) {
      this.loadDefaultCoreValues();
    }
  }

  loadDefaultCoreValues() {
    // Get core values from auth service instead of directly importing JSON
    this.coreValuesData = this.authService.getCorevalues();
    this.initializeForm();
  }

  initializeForm() {
    if (this.coreValuesData && this.coreValuesData.length > 0) {
      // Normalize the data structure
      this.normalizeData();
      
      this.coreValuesForm = this.fb.group({
        headers: this.fb.array(this.coreValuesData.map((header: any) => this.createHeaderGroup(header)))
      });
      this.formInitialized = true;
      this.isCoreValuesFormView();
      this.cdr.detectChanges();
    }
  }

  /**
   * Normalize the data structure before creating form groups
   */
  normalizeData() {
    if (!this.coreValuesData) return;
    
    // Ensure each header has the expected structure
    this.coreValuesData = this.coreValuesData.map(item => {
      // If header property is missing, create it
      if (!item.header && (item.headerId || item.headerText)) {
        return {
          header: {
            headerId: item.headerId || 0,
            headerText: item.headerText || ''
          },
          controls: item.controls || []
        };
      }
      return item;
    });
  }

  createHeaderGroup(headerData: any): FormGroup {
    // Handle case where data structure might vary
    const headerInfo = headerData.header || headerData;
    const headerControls = headerData.controls || [];
    
    return this.fb.group({
      headerText: [headerInfo.headerText || ''],
      headerId: [headerInfo.headerId || 0],
      controls: this.fb.array(headerControls.map((control: any) => this.createControlGroup(control)))
    });
  }

  createControlGroup(control: any): FormGroup {
    return this.fb.group({
      controlId: [control.controlId || 0],
      questionText: [control.questionText || ''],
      controlType: [control.controlType || 'TextArea'],
      options: [control.options || []],
      maxLength: [control.maxLength || 20000],
      isMandatory: [control.isMandatory || false],
      controlValue: [control.controlValue || '']
    });
  }

  get headers(): FormArray {
    return this.coreValuesForm.get('headers') as FormArray;
  }

  getControls(headerGroup: AbstractControl): FormArray {
    return headerGroup.get('controls') as FormArray;
  }

  onSubmit() {
    // console.log(this.coreValuesForm.value);
  }

  isCoreValuesFormView() {
    if (!this.coreValuesForm) return;
    
    const currentURL = window.location.href;
    const currentUrlObj = new URL(currentURL);
    const path = currentUrlObj.pathname;
    if (['/main/admin/view-profile'].includes(path)) {
      this.coreValuesForm.disable();

      const headersArray = this.coreValuesForm.get('headers') as FormArray;
      if (headersArray) {
        for (let i = 0; i < headersArray.length; i++) {
          const headerGroup = headersArray.at(i) as FormGroup;
          const controlsArray = headerGroup.get('controls') as FormArray;
          if (controlsArray) {
            for (let j = 0; j < controlsArray.length; j++) {
              controlsArray.at(j).disable();
            }
          }
        }
      }
    }
  }

  PostUserData(userData: any) {
    // console.log("Core Values PostUserData called with:", userData);
    
    if (!userData) {
      // console.warn("No core values data provided");
      return;
    }
    
    // Mark that we have user data to prevent default data loading
    this.hasUserData = true;
    
    try {
      // Handle different data structures that might be passed
      if (Array.isArray(userData)) {
        // If it's already an array of header objects
        this.coreValuesData = [...userData]; // Create a copy to avoid reference issues
      } else if (typeof userData === 'object') {
        // It might be a different structure, try to adapt
        if (userData.headers) {
          // It might be a FormGroup value with headers property
          this.coreValuesData = userData.headers.map((header: any) => {
            return {
              header: {
                headerId: header.headerId || 0,
                headerText: header.headerText || ''
              },
              controls: header.controls || []
            };
          });
        } else if (userData.coreValuesForm) {
          // It might be wrapped in a coreValuesForm property
          this.coreValuesData = userData.coreValuesForm;
        } else {
          // Check if it's a simple object that needs to be put in an array
          if (userData.header || userData.controls) {
            this.coreValuesData = [userData];
          } else {
            // Fall back to default data
            console.warn("Unrecognized core values data format, using default");
            this.loadDefaultCoreValues();
            return;
          }
        }
      } else {
        // Fall back to default data
        console.warn("Unrecognized core values data format, using default");
        this.loadDefaultCoreValues();
        return;
      }
      
      // console.log("Processed coreValuesData:", this.coreValuesData);
      
      // Normalize the data structure before form creation
      this.normalizeData();
      
      // Recreate the form with the new data
      this.initializeForm();
      
      // console.log("Core values form updated:", this.coreValuesForm?.value);
    } catch (error) {
      console.error("Error processing core values data:", error);
      this.loadDefaultCoreValues();
    }
  }

  isCoreValuesFormValid() {
    if (!this.coreValuesForm) return { coreValuesForm: [] };
    
    const output = this.coreValuesForm.value.headers.map((header: any) => {
      return {
        header: {
          headerId: header.headerId,
          headerText: header.headerText
        },
        controls: header.controls.map((control: any) => {
          return {
            controlId: control.controlId,
            headerId: header.headerId,
            questionText: control.questionText,
            controlType: control.controlType,
            options: control.options,
            maxLength: control.maxLength,
            isMandatory: control.isMandatory,
            isDeleted: false,
            controlValue: control.controlValue
          };
        })
      };
    });
    return { coreValuesForm: output };
  }

  reset() {
    if (!this.coreValuesForm) return;
    
    this.coreValuesForm.reset();
    this.initializeForm();
  }
  enableEditMode() {
    this.coreValuesForm.enable();
    const headersArray = this.coreValuesForm.get('headers') as FormArray;
    if (headersArray) {
      for (let i = 0; i < headersArray.length; i++) {
        const headerGroup = headersArray.at(i) as FormGroup;
        const controlsArray = headerGroup.get('controls') as FormArray;
        if (controlsArray) {
          for (let j = 0; j < controlsArray.length; j++) {
            controlsArray.at(j).enable();
          }
        }
      }
    }
  }
}