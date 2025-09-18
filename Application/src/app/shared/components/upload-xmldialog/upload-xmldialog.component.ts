import { Component, OnInit } from '@angular/core';
import { AQParameterService } from '@agenciiq/aqadmin';
import { DialogConfig } from '../../utility/aq-dialog/dialog-config';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { DialogRef } from '../../utility/aq-dialog/dialog-ref';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-xmldialog',
  templateUrl: './upload-xmldialog.component.html',
  styleUrls: ['./upload-xmldialog.component.sass'],
  standalone: false
})
export class UploadXMLDialogComponent implements OnInit {
  uploadedFile;
  isFileExists;
  isvalidExtension;
  excelData;
  base64EncodedExcel;
  loadXMLData: any;
  selectedKeys: any;
  uploadXmlForm: FormGroup;
  modalTitle: any;
  uploadXmlMsg: any;
  uploadXml: boolean = true;


  constructor(
    private parameterService: AQParameterService,
    private config: DialogConfig,
    private _popup: PopupService,
    private dialog: DialogRef,) {
    this.loadXMLData = this.config.data;
  }

  ngOnInit() {
    this.modalTitle = "Upload"
  }

  uploadExcel(event) {
    let allowedFiles = [".xml"];
    let regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");

    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
      this.isFileExists = true;
      if (!regex.test(this.uploadedFile.name.toLowerCase())) {
        this.isvalidExtension = false;
      }
      else {
        this.isvalidExtension = true;
        this.readAQFormExcel();
      }
    }
    else {
      this.isFileExists = false;
    }
  }

  readAQFormExcel() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.excelData = fileReader.result;
      var uInt8Data = new Uint8Array(this.excelData);
      var array = Array.prototype.slice.call(uInt8Data);
      var mappedArray = array.map(function (item) {
        return String.fromCharCode(item);
      });
      this.base64EncodedExcel = btoa(mappedArray.join(''));
    }

    fileReader.readAsArrayBuffer(this.uploadedFile);
  }

  uploadXML() {
    ;
    this.parameterService.SaveParameter(this.loadXMLData.UserId, this.base64EncodedExcel, this.loadXMLData.ParameterKey.parameterAlias)
      .subscribe(data => {
        if (data && data['success']) {
          this.selectedKeys = this.loadXMLData.ParameterKey.parameterAlias;
          //this.resetControls();
          this.dialog.close(data);
          // this.ParameterKeys();
          // this.OnParameterOptionChange(data['data']['parameterKey']);
        } else {
          this.uploadXml = false;
          this.uploadXmlMsg = data["message"];
        }
      })
  }

  cancel() {
    this.dialog.close(true);
  }

}
