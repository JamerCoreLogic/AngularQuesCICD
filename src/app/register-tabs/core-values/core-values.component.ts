import { core } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-core-values',
  templateUrl: './core-values.component.html',
  styleUrls: ['./core-values.component.scss']
})
export class CoreValuesComponent implements OnInit {
  coreValuesForm!: FormGroup;
  url:string = '/assets/coreValuesData.json';
  coreValuesData: any[] = [];
  userType = Number((localStorage.getItem('LoggedUserType')));

  constructor(private fb: FormBuilder ,private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    fetch(this.url).then(res => res.json())
    .then(json => {
      this.coreValuesData = json;
      this.coreValuesForm = this.fb.group({
        headers: this.fb.array(this.coreValuesData.map((header:any) => this.createHeaderGroup(header)))

    });
  });
  }

  createHeaderGroup(headerData: any): FormGroup {
    return this.fb.group({
      headerText: [headerData.header.headerText],
      headerId: [headerData.header.headerId],
      controls: this.fb.array(headerData.controls.map((control:any) => this.createControlGroup(control)))
    });
  }

  createControlGroup(control: any): FormGroup {
    return this.fb.group({
      controlId: [control.controlId],
      questionText: [control.questionText],
      controlType: [control.controlType],
      options: [control.options],
      maxLength: [control.maxLength],
      isMandatory: [control.isMandatory],
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
  isCoreValuesFormView(){
    this.coreValuesForm.disable();
  // i want to disable the form group child controls also
   this.coreValuesForm.get('headers')?.value.forEach((header: any) => {
      header.controls.forEach((control: any) => {
        // console.log(control);
        this.coreValuesForm.get('headers')?.get('controls')?.get(control.controlValue)?.disable();
      });
    }
    );

    return true;
  }
  PostUserData(EditUserDataFromParent: any) {
    if(EditUserDataFromParent){
      this.coreValuesData = EditUserDataFromParent;
      this.coreValuesForm = this.fb.group({
        headers: this.fb.array(this.coreValuesData.map(header => this.createHeaderGroup(header)))
      });
      this.cdr.detectChanges();

      // console.log("EditUserDataFromParent for core values", this.coreValuesData);
    }
  }
  isCoreValuesFormValid(){
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
            isDeleted: false, // Assuming you always want isDeleted to be false
            controlValue: control.controlValue // Capture the control value if needed
          };
        })
      };
    });
      return { coreValuesForm: output };
    }

    reset(){
      this.coreValuesForm.reset();
      this.coreValuesForm = this.fb.group({
        headers: this.fb.array(this.coreValuesData.map(header => this.createHeaderGroup(header)))
      });
    }



}