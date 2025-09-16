import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dateFormatValidator, dateRangeValidator, pastDateValidator } from 'src/app/models/date.validator';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.scss']
})
export class HistoryInfoComponent {
  additionalInfoForm!: FormGroup
  submit: boolean = false;
  isResume = false;
  UplodedfileName: string = '';
  today = new Date();

  OptionList1: string[] = ['None', '< 1 Year', '1-3 Years', '4-9 Years', '10+ Years'];
  OptionList2: string[] = ["None", "Beginner", "Intermediate", "Advanced"]
  Location_PreferenceOptions = ["Local", "In State", "Out of State"]

  QuestionsExperience = [
    { "formControl": "residential_Property_Desk", "label": "Residential Property Desk*", "groupId": "1" },
    { "formControl": "residential_Property_Field", "label": "Residential Property Field*", "groupId": "1" },
    { "formControl": "casualty", "label": "Casualty", "groupId": "1" },
    { "formControl": "commercial_Property_Desk", "label": "Commercial Property Desk", "groupId": "1" },
    { "formControl": "commercial_Property_Field", "label": "Commercial Property Field", "groupId": "1" },
    { "formControl": "flood_Desk", "label": "Flood Desk", "groupId": "1" },
    { "formControl": "flood_Field", "label": "Flood Field", "groupId": "1" }]

  QuestionsSpecialties = [
    { "formControl": "auto", "label": "Auto", "groupId": "2" },
    { "formControl": "auto_Appraisal", "label": "Auto Appraisal", "groupId": "2" },
    { "formControl": "construction", "label": "Construction", "groupId": "2" },
    { "formControl": "construction_Defect", "label": "Construction Defect", "groupId": "2" },
    { "formControl": "general_Liability", "label": "General Liability", "groupId": "2" },
    { "formControl": "heavy_Equipment", "label": "Heavy Equipment", "groupId": "2" },
    { "formControl": "homeowner_Liability", "label": "Homeowner Liability", "groupId": "2" },
    { "formControl": "inland_Marine", "label": "Inland Marine", "groupId": "2" },
    { "formControl": "on_SceneInvestigations", "label": "On Scene Investigations", "groupId": "2" }]

  QuestionsPropertySpe = [
    { "formControl": "business_Interruption", "label": "Business Interruption/Time Element Losses", "groupId": "3" },
    { "formControl": "claims_Supervisor", "label": "Claims Supervisor", "groupId": "3" },
    { "formControl": "crop", "label": "Crop", "groupId": "3" },
    { "formControl": "earthquake", "label": "Earthquake", "groupId": "3" },
    { "formControl": "environment_Disaster", "label": "Environmental Disaster", "groupId": "3" },
    { "formControl": "high_End_Residential", "label": "High End Residential", "groupId": "3" },
    { "formControl": "large_Loss_Commercial", "label": "Large Loss Commercial", "groupId": "3" },
    { "formControl": "large_Loss_Contents", "label": "Large Loss Contents", "groupId": "3" },
    { "formControl": "large_Loss_Fire", "label": "Large Loss Fire", "groupId": "3" },
    { "formControl": "litigation", "label": "Litigation", "groupId": "3" },
    { "formControl": "mobile_Homes", "label": "Mobile Homes", "groupId": "3" },
    { "formControl": "municipality_Losses", "label": "Municipality Losses", "groupId": "3" },
    { "formControl": "sinkhole", "label": "Sinkhole", "groupId": "3" },
    { "formControl": "water_Mitigation_Estimating", "label": "Water Mitigation Estimating", "groupId": "3" }]

  QuestionsSoftwareKnow = [
    { "formControl": "fileTrac", "label": "FileTrac*", "groupId": "4" },
    { "formControl": "xactimate_Estimating", "label": "Xactimate Estimating*", "groupId": "4" },
    { "formControl": "claimXperience", "label": "ClaimXperience", "groupId": "4" },
    { "formControl": "clickClaims", "label": "Click Claims", "groupId": "4" },
    { "formControl": "guidewire", "label": "Guidewire", "groupId": "4" },
    { "formControl": "hover", "label": "Hover", "groupId": "4" },
    { "formControl": "mitchell", "label": "Mitchell", "groupId": "4" },
    { "formControl": "plnar", "label": "PLNAR", "groupId": "4" },
    { "formControl": "symbility", "label": "Symbility", "groupId": "4" },
    { "formControl": "xactAnalysis", "label": "XactAnalysis", "groupId": "4" },
    { "formControl": "xactimate_Collaboration", "label": "Xactimate Collaboration", "groupId": "4" }]


  constructor(private fb: FormBuilder, private renderer: Renderer2, private el: ElementRef) {
    this.createAdditionalInfoForm();
  }

  ngOnInit(): void {

this.listenForDateInputChanges();
  }
  listenForDateInputChanges() {
    this.additionalInfoForm.get('approximate_Date_I_Began_Adjusting')?.valueChanges
      .subscribe(val => {
        const control = this.additionalInfoForm.get('approximate_Date_I_Began_Adjusting');
        if (control) {
          if (val) {
            control.setValidators([
              dateFormatValidator,
              pastDateValidator,
              dateRangeValidator(new Date("1949-12-31"), new Date())
            ]);
          } else {
            control.clearValidators();
          }
          control.updateValueAndValidity({ emitEvent: false }); // Avoid triggering valueChanges again
        }
      });
  }
  getControlName(Qlist: any[], i: any) {
    return Qlist[i].formControl
  }
  getLabel(label: string) {
    if (label.endsWith('*')) {
      return label.slice(0, -1);
    }
    else {
      return label
    }
  }
  isLastAsterisk(label: string): boolean {
    return label.endsWith('*');
  }
  createAdditionalInfoForm() {
    this.additionalInfoForm = this.fb.group({
      adjusterInformationId: [1],
      approximate_Date_I_Began_Adjusting: [null],
      largest_Claim_I_Have_Handled: [, [Validators.min(0)]],
      xactNetAddressSkill:[],
      location_Preference:[, [Validators.required]],
      writing_Denial_Or_Coverage_Letters: [],
      experience_With_PAs: [],
      experience_With_AOB: [],
      fluent_In_Spanish: [],
      what_Sets_You_Apart_From_Other_Adjusters: [],
      iA_Firms_I_Have_Worked_With: [],
      carriers_You_Have_Worked_For: [],
      residential_Property_Desk: [, [Validators.required]],
      residential_Property_Field: [, [Validators.required]],
      commercial_Property_Desk: [],
      commercial_Property_Field: [],
      flood_Desk: [],
      flood_Field: [],
      casualty: [],
      auto: [],
      auto_Appraisal: [],
      heavy_Equipment: [],
      on_SceneInvestigations: [],
      homeowner_Liability: [],
      inland_Marine:[],
      general_Liability: [],
      construction: [],
      construction_Defect: [],
      sinkhole: [],
      water_Mitigation_Estimating: [],
      crop: [],
      large_Loss_Contents: [],
      large_Loss_Fire: [],
      large_Loss_Commercial: [],
      litigation: [],
      high_End_Residential: [],
      business_Interruption: [],
      mobile_Homes: [],
      municipality_Losses: [],
      claims_Supervisor: [],
      earthquake: [],
      environment_Disaster: [],
      xactimate_Estimating: [, [Validators.required]],
      xactimate_Collaboration: [],
      xactAnalysis: [],
      mitchell: [],
      symbility: [],
      guidewire: [],
      // isLocked: [],
      hover: [],
      claimXperience: [],
      plnar: [],
      fileTrac: [, [Validators.required]],
      clickClaims: [],
      resume: [],
      file_Review_Experience: [],
      bio_Or_Mini_Resume: [, [Validators.maxLength(1000)]],
      userId: [],
      // content_Loss: [],
      // auto_Liability: [],
      // auto_Total_Loss: [],
      // auto_Commertial: [],
      // juris: [],
      // next_Gen: [],
      // fox_Pro: [],
      // aS400: [],
      // simsol: [],
      // diamond: [],
      // isDeleted: [],
      // createdOn: [],
      // modifiedOn: [],
      createdBy: [Number(localStorage.getItem('LoggeduserId'))],
      modifiedBy: [Number(localStorage.getItem('LoggeduserId'))]
    })
  }

  restrictEnteringE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-' || event.key === '.') {
      event.preventDefault();
    }
  }

  isFileUploaded: boolean = false; // Declare a new flag

  onFileSelected(event: any) {
    if (this.isFileUploaded) {
      Swal.fire({
        title: '',
        text: 'A file already uploaded . Do you want to replace it?',
        icon: 'info',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, replace it!',
        confirmButtonColor: '#ffa022',
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadFile(event);
        }
      });
    } else {
      this.uploadFile(event);
    }
  }

  uploadFile(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = inputElement.files ? inputElement.files[0] : null;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file && file.size > maxFileSize) {
      Swal.fire({
        title: '',
        text: 'File size exceeds the 10MB limit.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      });
      inputElement.value = ''; // Clear the input element to allow selecting the same file again if needed
      return;
    }
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent: string | ArrayBuffer = e.target.result;
        if (typeof fileContent === 'string') {
          const base64String: string = btoa(fileContent);
          this.additionalInfoForm.patchValue({ resume: base64String });
          this.UplodedfileName = file.name;
          this.isValidBase64Resume()
        } else {
          console.error('Failed to convert file to base64 string.');
          inputElement.value = '';
        }
      };
      reader.readAsBinaryString(file);
    }
    inputElement.value = '';
  }

  isValidBase64Resume() {
    const resumeBase64 = this.additionalInfoForm.controls['resume'].value
    if (resumeBase64 && resumeBase64.length > 100) {
      const decoded = atob(resumeBase64);
      const encoded = btoa(resumeBase64);
      this.isResume = encoded === resumeBase64;
      this.isResume = true;
      this.isFileUploaded = true; // Set the flag to true when a file is uploaded
      Swal.fire({
        title: '',
        text: 'File uploaded successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#ffa022',
      })
    }
    else {
      this.isResume = false;
      this.isFileUploaded = false; // Set the flag to false when the file upload fails
    }
  }


  onKeyDown(event: KeyboardEvent, row: number, col: number) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const nextRow = (col === this.OptionList1.length - 1) ? row + 1 : row;
      const nextCol = (col + 1) % this.OptionList1.length;
      const nextRadio: HTMLElement | null = document.getElementById(`radio-${nextRow}-${nextCol}`);
      if (nextRadio) {
        nextRadio.focus();
      }
    }
  }
  downloadPDF(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
  getQuestionByKey(key: string) {
    const allQuestions = [
      ...this.QuestionsExperience,
      ...this.QuestionsSpecialties,
      ...this.QuestionsPropertySpe,
      ...this.QuestionsSoftwareKnow
    ];
    return allQuestions.find((question) => question.formControl === key);
  }
  scrollToParagraph(paragraphId: string) {
    const paragraph = document.getElementById(paragraphId);
    if (paragraph) {
      paragraph.scrollIntoView({ behavior: 'smooth' });
    }
  }
  isAdditionalInfoFormValid() {
     
    if (this.additionalInfoForm.valid == false) {
      this.submit = true;
      for (const key of Object.keys(this.additionalInfoForm.controls)) {
        if (this.additionalInfoForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl) {
            invalidControl.focus();
          } else {
            // Handle the case when the control is not found
            //console.log(`Form control with name ${key} not found.`);
            const question = this.getQuestionByKey(key);
            if (question) {
              this.scrollToParagraph(question.groupId);
            }
          }
          Swal.fire({
            title: '',
            text: 'Please fill all the required fields (marked with * ).',
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ffa022',
          })
          break
        }
      }
      return false;
    }
    else {
      let obj = {
        additionalInfoForm: this.additionalInfoForm.getRawValue()
      }
      return obj;
    }
  }
  ishistoryInfoFormDirty(){
    return this.additionalInfoForm.dirty;
  }

  reset() {
    this.submit = false;
    this.additionalInfoForm.reset();
    this.additionalInfoForm.controls['adjusterInformationId'].setValue(1)
  }
}
