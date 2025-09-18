import { Component, OnInit } from '@angular/core';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DialogSaveParameterService } from '@agenciiq/aqadmin';


@Component({
  selector: 'app-add-parameter-dialog',
  templateUrl: './add-parameter-dialog.component.html',
  styleUrls: ['./add-parameter-dialog.component.sass'],
  standalone: false
})
export class AddParameterDialogComponent implements OnInit {
  modalTitle: any;
  submitted: boolean = false;
  addParameterKeyForm: FormGroup;
  constructor(
    private dialog: DialogRef, private fb: FormBuilder,) { }

  ngOnInit() {
    this.createKeyParamForm()
    this.modalTitle = "Add Parameter Key"
    //this.addParameterKeyForm = this.createParameterKeyForm()
  }

  createKeyParamForm() {
    this.addParameterKeyForm = this.fb.group({
      ParameterCode: ['', [Validators.required, Validators.maxLength(100)]],
      DisplayName: ['', Validators.required],
    })
  }

  saveParameterKey() {

    if (this.addParameterKeyForm.valid) {
      let data = this.addParameterKeyForm.getRawValue();
      let paramKeyData = [{
        "ParameterId": 0,
        "ParameterKey": data.ParameterCode,
        "ParameterAlias": data.DisplayName,
      }]
      //this.resetControls();
      this.dialog.close(paramKeyData);
    }
    else
      this.submitted = true;
  }


  cancel() {
    this.dialog.close(null);
    //this.ParameterForm.reset();
  }

  get ParameterCode() {
    return this.addParameterKeyForm.get('ParameterCode');

  }

  get DisplayName() {
    return this.addParameterKeyForm.get('DisplayName');

  }

}
