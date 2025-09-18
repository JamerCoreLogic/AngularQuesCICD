import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'lib-aq-multiselect',
    template: `
    <div class="multi-select-container">
      <div class="selected-list" aria-placeholder="Seelct">
        <span *ngFor="let item of selectedItem" class="selected-item">{{item[checkBoxNameProperty]}} 
          <img *ngIf="isEditable" src="assets/images/delete-popup.png" (click)="removeItem(item[checkBoxValueProperty], $event)">
          </span>
      </div>      
      <ng-container>  
      <div *ngIf="isEditable" class="multi-select-options">    
        <div class="styled-checkbox">
            <input class="form-control textbox_border_input" (keyup)="filterData($event.target.value)" type="text" placeholder="Filter" />
            <div class="checkboxgrid">            
              <input type="checkbox" (change)="selectAllCheckBox($event.target.checked, $event)" [id]="dropdownName" [checked]="isAllCheckboxSelected">
                <label [for]="dropdownName">
                <div class="checkercheckboxgrid"></div>
                Select All
                </label>
            </div>
            <div *ngFor="let option of optionList" class="checkboxgrid">            
              <input type="checkbox" (change)="selectCheckBox($event.target.checked,option, $event)" [id]="dropdownName + option[checkBoxValueProperty]" [checked]="option?.checked">
                <label [for]="dropdownName + option[checkBoxValueProperty]">
                <div class="checkercheckboxgrid"></div>
                {{option[checkBoxNameProperty]}}
                </label>
            </div>
          </div>
          </div>
        </ng-container> 
    </div>
  `,
    styleUrls: ['./aq-multiselect.css'],
    standalone: false
})
export class AqMultiselectComponent {


  selectedItem: any[] = [];
  isMultiSelectListOpen: boolean = false;
  optionList: any[] = [];
  optionListResult: any[] = [];
  optionListMaster: any[] = [];
  checkBoxNameProperty: string;
  checkBoxValueProperty: string;
  isAllCheckboxSelected: boolean = false;
  isEditable: boolean = true;

  @Input('CheckBoxName') set setCheckBoxName(name: string) {
    this.checkBoxNameProperty = name;
  }

  @Input('CheckBoxValue') set setCheckBoxValue(value: string) {
    
    this.checkBoxValueProperty = value;
  }

  @Input('IsEditable') set setIsEditable(value: boolean) {
    
    this.isEditable = value;
  }

  @Input('OptionList') set setOptionList(options: any[]) {

    if (options && options != undefined) {
      this.optionList = options;
      this.optionListMaster = options;
      this.optionList.forEach(option => {
        if (option.checked) {
          this.selectCheckBox(option.checked, option, null);
        }
      });
    }
  }


  @Input('DropdownName') dropdownName: string;

  


  @Output('SelectedListOutput') selectectedList = new EventEmitter();


  selectCheckBox(isChecked, option, event) { 
    
    this.checkBoxValueProperty = this.checkBoxValueProperty;
    if(event){
      event.stopPropagation();
    }
    if (isChecked) {
      this.optionListResult = this.optionListMaster.map(resp => {
        if (resp[this.checkBoxValueProperty] == option[this.checkBoxValueProperty]) {
          
          resp['checked'] = true;
        }
        return resp;
      });
      this.optionList = this.optionListResult.filter(item => {
        return this.optionList.some(opt => opt[this.checkBoxValueProperty] == item[this.checkBoxValueProperty]);
      });
    } else {
      this.optionListResult = this.optionListMaster.map(resp => {
        if (resp[this.checkBoxValueProperty] == option[this.checkBoxValueProperty]) {
          resp['checked'] = false;
        }
        return resp;
      });
      this.optionList = this.optionListResult.filter(item => {
        return this.optionList.some(opt => opt[this.checkBoxValueProperty] == item[this.checkBoxValueProperty]);
      });
    }
    this.selectedItem = this.optionListMaster.filter(item => item.checked);
    console.log("this.selectedItem", this.selectedItem);
    this.CheckIsAllCheckboxSelected();
    this.selectectedList.emit(this.optionListResult);
  }

  selectAllCheckBox(isChecked, event) {
    
    let optionList  = this.optionList;
    optionList.forEach(optionItem => {
      this.selectCheckBox(isChecked, optionItem, event)
    });
  }

  CheckIsAllCheckboxSelected() {
    this.isAllCheckboxSelected = this.optionListMaster.length === this.selectedItem.length;
    console.log(this.isAllCheckboxSelected);
  }

  removeItem(selectedValue, event) {
    event.stopPropagation();
    let item = this.optionList.filter(option => option[this.checkBoxValueProperty] == selectedValue)[0];
    this.selectCheckBox(false, item, null);
  }

  filterData(filterValue: string) {

    if (filterValue.trim() != '') {
      this.optionList = this.optionListMaster.filter(item => String(item[this.checkBoxNameProperty]).toLowerCase().includes(filterValue.toLowerCase()));
    } else {
      this.optionList = this.optionListMaster;
    }
    this.CheckIsAllCheckboxSelected();
  }


  toggleMultiselectOption() {
    this.isMultiSelectListOpen = !this.isMultiSelectListOpen;
  }

}


export interface IOptionList {
  checkBoxName: string;
  checkBoxValue: string;
}