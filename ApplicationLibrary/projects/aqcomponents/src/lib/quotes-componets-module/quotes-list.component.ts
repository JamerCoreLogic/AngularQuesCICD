import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { DataViewComponent } from '../data-view-module/data-view.component';
import { QuoteListViewComponent } from '../data-view-module/quote-list-view.component';




@Component({
  selector: 'lib-quotes-list',
  template: `
  <div class="col-sm-12">
    <lib-data-view [DataSource]="dataSource" [AdvanceFilterEnabled]='true' [SortingColumn]="sortedColumnName"
        [NoRecordsMessage]="NoRecordsMessage" [Pagination]="pagination" [HideAdvanceFilterOption]="HideAdvFilterOption"
        [ColumnList]="columns" (OutputAdvanceFilter)="getAdvanceFilter($event)" (TransferViewPolicyParam)="setViewPolicyData($event)" >

        <ng-template #AdvanceFilter>
            <div class="filter-block" *ngIf="FilterOpen">
                <span class="filter-cancel-mark" (click)="cancelAdvanceFilterForm()">
                   <img src="assets/images/delete-popup.png">
                </span>
                <form [formGroup]="advanceFilterForm">
                    <div class="fb_header">
                        <div class="col-lg-1 col-md-2 col-sm-3 pd_zero">
                            <div class="form-group">
                                <label class="textbox_borderlabel">Saved Filters</label>
                            </div>
                        </div>
                        <div class="col-sm-2 col-md-3 col-lg-2">
                            <div class="form-group">
                                <select (change)="changeFilter($event.target.value)"
                                    class="form-control dropdown_border">
                                    <option value="0">Select</option>
                                    <option [selected]="parameter.advancedFilterId == SavedAdvanceFilterParameterID"
                                        *ngFor="let parameter of SavedAdvanceFilterParameter"
                                        [value]="parameter.advancedFilterId">{{parameter.filterName}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-4">
                            <div class="form-group">
                                <div class="styled-checkbox">
                                    <div class="checkbox">
                                        <input id="defaultfilter" (change)="DefaultChecked($event.target.checked)"
                                        [checked]="isDefaultChecked" name="defaultfilter" type="checkbox">
                                        <label for="defaultfilter">
                                            <div class="checkercheckbox"></div>
                                            Mark it as default filter
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="fb_center">
                        <div class="row pd_zero">
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Agency Name</label>
                                    <input type="text" placeholder="Add Agency Name" formControlName="Agency"
                                        class="form-control textbox_border_input">
                                        <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Agent Name</label>
                                    <input type="text" placeholder="Add Agent Name" dataTextFocus formControlName="AgentName"
                                        class="form-control textbox_border_input">
                                        <div class="display-error"></div>
                                </div>
                            </div>
                        
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Ref #</label>
                                    <input type="text" placeholder="Add Ref" formControlName="Ref" class="form-control textbox_border_input">
                                    <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Insured Name</label>
                                    <input type="text" placeholder="Add Insured Name" formControlName="InsuredName"
                                        class="form-control textbox_border_input">
                                        <div class="display-error"></div>
                                </div>
                            </div>
                        </div>
                        <!--  (change)="onLOBChange($event.target.value)" -->
                        <div class="row pd_zero">
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Line of Business</label>
                                    <select class="form-control dropdown_border"
                                         formControlName="LOB">
                                        <option value=''>Select</option>
                                        
                                        <option *ngFor="let lobItem of LOBList" [value]="lobItem.lobCode">
                                            {{lobItem.lobDescription}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Transaction Type</label>
                                    <select class="form-control dropdown_border" formControlName="TransactionType">
                                        <option value=''>Select</option>
                                        <option *ngFor="let trans of TransactionTypeList"
                                            [value]="trans.parameterValue">{{trans.parameterName}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Business Type</label>
                                    <select class="form-control dropdown_border" formControlName="BusinessType">
                                        <option value=''>Select</option>
                                        <option *ngFor="let business of BusinessTypeList"
                                            [value]="business.parameterValue">{{business.parameterName}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Status</label>
                                    <select class="form-control dropdown_border" formControlName="Status">
                                        <option value=''>Select</option>
                                        <option *ngFor="let stage of STAGEList" [value]="stage.parameterValue">
                                            {{stage.parameterName}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>
                        </div>
                        <div class="row pd_zero">
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Policy Start Date Range</label>
                                    <input type="text" placeholder="MM/dd/yyyy" formControlName="EffectiveFromDate" bsDatepicker 
                                        class="form-control textbox_border_input width45">
                                    <span class="inline-span">To</span>
                                    <input type="text" placeholder="MM/dd/yyyy" formControlName="EffectiveToDate" bsDatepicker  
                                        class="form-control textbox_border_input width45">
                                        <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Policy Expiry Date Range</label>
                                    <input type="text" placeholder="MM/dd/yyyy" formControlName="ExpirationFromDate" bsDatepicker  
                                        class="form-control textbox_border_input width45">
                                    <span class="inline-span">To</span>
                                    <input type="text" placeholder="MM/dd/yyyy" formControlName="ExpirationToDate"  bsDatepicker  
                                        class="form-control textbox_border_input width45">
                                        <div class="display-error"></div>
                                </div>
                            </div>


                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Premium Range</label>
                                    <input type="text" placeholder="Add From Range" formControlName="PremiumStart"
                                        class="form-control textbox_border_input width45">
                                    <span class="inline-span">To</span>
                                    <input type="text" placeholder="Add To Range" formControlName="PremiumEnd"
                                        class="form-control textbox_border_input width45">
                                        <div class="display-error"></div>
                                </div>
                            </div>
                        </div>
                        <!-- ********      -->
                        <div class="row pd_zero">
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">State</label>
                                    <select class="form-control dropdown_border" formControlName="State">
                                        <option value=''>Select</option>
                                        <option *ngFor="let state of stateList" [value]="state.parameterId">
                                            {{state.parameterName}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>

                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Period</label>
                                    <select class="form-control dropdown_border" formControlName="Period">
                                        <option value=''>Select</option>
                                        <option *ngFor="let period of periodList" [value]="period.parameterId">
                                            {{period.parameterName}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>
                            <div class="col-sm-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label class="textbox_borderlabel">Carrier</label>
                                    <select class="form-control dropdown_border" formControlName="Carrier">
                                        <option value=''>Select</option>
                                        <option *ngFor="let carrier of carrierList" [value]="carrier.parameterId">
                                            {{carrier.parameterName}}</option>
                                    </select>
                                    <div class="display-error"></div>
                                </div>
                            </div>
                        </div>



                        <!-- *********  -->
                        <div class="row pd_zero">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="col-md-12 pd_zero">
                                    <div class="form-group">
                                        <label class="textbox_borderlabel">Processing Type</label>
                                        <div class="styled-radio">
                                            <ng-container *ngFor="let process of processTypeList; let i = index">
                                                <div class="radio">
                                                    <input type="radio" formControlName="ProcessingType"
                                                        [value]="process.parameterId" [id]="process.parameterId">
                                                    <label class="alert_check" [for]="process.parameterId">
                                                        <div class="checker"></div>
                                                        {{process.parameterName}}
                                                    </label>
                                                </div>
                                            </ng-container>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="row pd_zero">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="col-md-12 pd_zero">
                                    <div class="form-group">
                                        <label class="textbox_borderlabel">Alfred Alerts</label>
                                        <div class="styled-checkbox">
                                            <div class="checkbox" *ngFor="let alfred of AlfredFlagList; let i = index">
                                                <input type="checkbox" [checked]="isChecked(alfred.parameterValue)"
                                                    (click)="checkAlfredFlag($event.target.id, $event.target.checked)"
                                                    [value]="alfred.parameterName" [id]="alfred.parameterValue">
                                                <label [for]="alfred.parameterValue">
                                                    <div class="checkercheckbox"></div>
                                                    <img [src]="alfred.iconURL">
                                                    {{alfred.parameterName}}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="fb_footer">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="col-lg-2 col-md-2 col-sm-4 pd_zero">
                                <div class="form-group">

                                    <div class="styled-checkbox">
                                          <div class="checkbox">
                                              <input type="checkbox"  id="searchcriteria" (change)="checkFilterName($event.target.checked)"
                                              [checked]="isFilterFlag" name="searchcriteria" type="checkbox" >
                                              <label for="searchcriteria">
                                                  <div class="checkercheckbox"></div>
                                                  Save Search
                                              </label>
                                          </div>
                                      </div>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-3 col-sm-2">
                                <div class="form-group">
                                    <input class="form-control textbox_border_input border-ip-footer" type="text" maxlength="25"
                                        placeholder="Add Filter Name" formControlName="filterName" />

                                    <div class="display-error">
                                        <span *ngIf="isFilterNameValid==false && isSearched">Please enter filter
                                            name</span>
                                    </div>
                                </div>


                            </div>
                            <div class="col-lg-2 col-md-3 col-sm-2">
                                <div class="form-group">
                                    <input class="form-control textbox_border_input border-ip-footer" type="text" maxlength="200"
                                        placeholder="Add Filter Description" formControlName="filterDetails" />

                                    <div class="display-error">
                                        <span *ngIf="isFilterDescValid==false && isSearched">Please enter filter
                                            description</span>
                                    </div>
                                </div>

                            </div>
                            <div class="col-lg-6 col-md-5 col-sm-5 float-right">
                                <div class="form-group right-buttons">
                                    <button type = "button"  (click)="cancelAdvanceFilterForm()" class="btn cancel-btn">Cancel</button>
                                    <button type = "button" (click)="clearAdvanceFilterForm()" class="btn cancel-btn">Clear All</button>
                                    <button type = "submit" (click)="SearchQuoteslist()"
                                        class="btn btn-theme-radius fix_width">Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
        </ng-template>

        <ng-template #DataViewHeading>
            <th (click)="sortQuotes('ref')">Ref <img src="assets/images/sort.png"></th>
            <th>Insured Name</th>
            <th>LOB</th>
            <th>Agent Name</th>
            <th>Effective Date</th>
            <th>Expiration Date</th>
            <th># Years Insured</th>
            <th>Alfred Alerts</th>
        </ng-template>

        <ng-template #DataViewContent let-data="data">
            <td><span>{{data.ref}}</span></td>
            <td><span class="insuredname">{{data.insuredName}}</span></td>
            <td><span>{{data.lob}}</span></td>
            <td><span>{{data.agentName}}</span></td>
            <td><span>{{data.effective_Date | date:'MM/dd/yyyy'}}</span></td>
            <td><span>{{data.expiry_Date | date:'MM/dd/yyyy'}}</span></td>
            <td><span>{{data.yearsInsured}}</span></td>
            <td>
                <div class="table-alfred-icons">
                    <div class="tooltip" *ngFor="let alert of data.alerts">
                        <img [src]="alert.iconURL" />
                        <span class="tooltiptext">{{alert.description}}</span>
                    </div>
                </div>
            </td>
        </ng-template>

        <ng-template #DataViewInnerHeading>
            <th>Status</th>
            <th>Date</th>
            <th>Premium</th>
        </ng-template>

        <ng-template #DataViewInnerContent let-innerdata="innerdata">
            <td>
                <div class="tooltip">{{innerdata.status}}
                </div>
            </td>
            <td><span *ngIf="innerdata.renewal_Date">Renewal Date {{innerdata.renewal_Date | date:'MM/dd/yyyy'}}</span>
                <span *ngIf="innerdata.endorsement_Date">Endorsement Date
                    {{innerdata.endorsement_Date  | date:'MM/dd/yyyy'}}</span>
                <span *ngIf="innerdata.cancel_Date">Cancel Date {{innerdata.cancel_Date  | date:'MM/dd/yyyy'}}</span>
                <span *ngIf="!innerdata.cancel_Date && !innerdata.renewal_Date && !innerdata.endorsement_Date">Quote
                    Request Date {{innerdata.created_Date  | date:'MM/dd/yyyy'}}</span></td>
            <td><span *ngIf="innerdata.premium > 0">{{innerdata.premium | currency}}</span>
                <span class="text-danger"
                    *ngIf="innerdata.refundPremium > 0">-{{innerdata.refundPremium | currency}}</span></td>
        </ng-template>
    </lib-data-view>
</div>
  `,
  standalone: false
})
export class QuotesListComponent implements OnInit {

  dataSource;
  pagination: boolean = true;
  columns: any[] = [];
  TransactionTypeList: any[] = [];
  BusinessTypeList: any[] = [];
  FilterOpen: boolean = false;
  LOBList: any[] = [];
  STAGEList: any[] = [];
  AlfredFlagList: any[] = [];
  advanceFilterForm: FormGroup;
  alfredFlagListChecked: any[] = [];
  agentNameList: any[] = [];
  HideAdvFilterOption: boolean = false;
  SavedAdvanceFilterParameter: any[];
  SelecteFilter: any;
  advancedFilterId: number;
  filterName: any;
  isFilterFlag: boolean = false;
  isDefaultChecked: boolean = false;
  SavedAdvanceFilterParameterID: any;
  sortedColumnName: any;
  flag: boolean = true;
  bsValue: '';
  bsStartValue;
  bsEndValue;
  stateList: any[] = [];
  processTypeList: any[] = [];
  //ii.	Last Month | MTD | Last Quarter | QTD | YTD
  periodList: any[] = [];
  carrierList: any[] = [];
  isFilterNameValid: boolean = true;
  isFilterDescValid: boolean = true;
  isSearched: boolean = false;



  @Input('DataSource') set setDataSource(data: any[]) {
    if (data && data.length) {
      this.dataSource = data;
    } else {
      this.dataSource = [];
      this.FilterOpen = false;
    }
  }

  @Input('ColumnList') set setColumnist(cols: any[]) {
    if (cols && cols.length) {
      this.columns = cols;
    }
  }

  @Input('NoRecordsMessage') NoRecordsMessage: string;

  @Input('TransactionTypeList') set setTransactionType(transaction: any[]) {
    if (transaction && transaction.length) {
      this.TransactionTypeList = transaction;
    }
  }

  @Input('BusinessTypeList') set setBusinessType(business: any[]) {
    if (business && business.length) {
      this.BusinessTypeList = business;
    }
  }

  @Input('LOBList') set setLOB(lob: any[]) {
    if (lob && lob.length) {
      this.LOBList = lob;
    }
  }

  @Input('STAGEList') set setStage(stage: any[]) {
    if (stage && stage.length) {
      this.STAGEList = stage;
    }
  }

  @Input('AlfredFlagList') set alfredFlage(flags: any[]) {
    if (flags && flags.length) {
      this.AlfredFlagList = flags;
    }
  }

  @Input('AgentName') set setAgentName(agents: any[]) {
    if (agents && agents.length) {
      this.agentNameList = agents;
    }
  }

  @Input('SavedAdvanceFilterList') set savedAdvanceFilterList(savedList: any[]) {
    if (savedList && savedList.length) {
      this.SavedAdvanceFilterParameter = savedList;
      let filtered: any[] = savedList.filter(item => item.isActive);

      if (filtered.length > 0) {
        this.SavedAdvanceFilterParameterID = filtered[0]['advancedFilterId'];
        if (this.SavedAdvanceFilterParameterID) {
          this.changeFilter(this.SavedAdvanceFilterParameterID);
          this.DefaultChecked(true);
          this.checkFilterName(true);
        }
      }
    }
  }

  @Input('SortingColumn') set _sortedColumnName(columnName: string) {
    this.sortedColumnName = columnName;
  }

  @Output('FilterQuotesList') filterQuotes = new EventEmitter();
  @Output('SaveAdvanceFilter') SaveFilterOptions = new EventEmitter();

  //------------------
  @Input('StateList') set setState(stateList: any[]) {
    this.stateList = stateList;
  }
  @Input('ProcessList') set setProcess(processList: any[]) {
    this.processTypeList = processList;
  }
  @Input('PeriodList') set setPeriod(periodList: any[]) {
    this.periodList = periodList;
  }
  @Input('CarrierList') set setCarrier(carrierList: any[]) {
    this.carrierList = carrierList;
  }



  @ViewChild(DataViewComponent, { static: true }) libDataView: DataViewComponent;

  @Output()
  TransferViewPolicyParam = new EventEmitter<any>();
  //---------------------
  constructor(private fb: FormBuilder) {
    this.advanceFilterForm = this.fb.group({
      Ref: [''],
      InsuredName: [''],
      LOB: [''],
      AgentName: [''],
      // StartDate: new FormControl(''),
      //EndDate: new FormControl(''),
      TransactionType: [''],
      BusinessType: [{ value: '', disabled: true }],
      Status: [''],
      PremiumStart: [''],
      PremiumEnd: [''],
      AlfredFlags: [''],
      filterName: [''],
      Agency: [{ value: '', disabled: true }],
      Agent: [''],
      State: [{ value: '', disabled: true }],
      ProcessingType: [{ value: '', disabled: true }],
      Period: [{ value: '', disabled: true }],
      Carrier: [{ value: '', disabled: true }],
      filterDetails: [''],
      EffectiveFromDate: [''],
      EffectiveToDate: [''],
      ExpirationFromDate: [''],
      ExpirationToDate: [''],
    })
  }

  ngOnInit() {

  }

  sortQuotes(columnName) {
    this.flag = !this.flag;
    this.sortedColumnName = { 'columnName': columnName, isAsc: this.flag };
  }

  getAdvanceFilter(value) {
    this.FilterOpen = value;
  }

  SearchQuoteslist() {

    this.isSearched = true;

    if (this.isFilterFlag) {

      let filterName = this.advanceFilterForm.get('filterName').value;
      let filterDetails = this.advanceFilterForm.get('filterDetails').value;

      this.isFilterNameValid = (filterName != "" && filterName != null) ? true : false;
      this.isFilterDescValid = (filterDetails != "" && filterDetails != null) ? true : false;

      if (this.isFilterNameValid && this.isFilterDescValid) {
        this.filterQuotes.emit(this.advanceFilterForm.value);
        //this.HideAdvFilterOption = !this.HideAdvFilterOption;
        this.libDataView.OpenFilter();
        this.saveAdvanceFilterOptions();
      }

    }
    else {
      this.isFilterNameValid = true;
      this.isFilterDescValid = true;
      this.filterQuotes.emit(this.advanceFilterForm.value);
      //this.HideAdvFilterOption = !this.HideAdvFilterOption;
      this.libDataView.OpenFilter();
      this.saveAdvanceFilterOptions();
    }



  }

  clearAdvanceFilterForm() {
    this.isFilterFlag = false;
    /*  this.advanceFilterForm.reset(); */
    this.filterQuotes.emit('Clear');
    this.alfredFlagListChecked = [];
    /* this.HideAdvFilterOption = !this.HideAdvFilterOption; */
    this.libDataView.OpenFilter();
    this.resetSelectControls();
  }



  isChecked(id) {
    if (this.alfredFlagListChecked.length > 0) {
      if (this.alfredFlagListChecked.indexOf(id) > -1) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  checkFilterName(value) {
    this.isFilterFlag = value;
  }

  changeFilter(advancedFilterId) {



    if (advancedFilterId != 0) {
      this.checkFilterName(true);
      this.advancedFilterId = advancedFilterId;
      let SelecteFilter = this.SavedAdvanceFilterParameter.filter(item => item['advancedFilterId'] == advancedFilterId);

      if (SelecteFilter) {
        let parameters: any = JSON.parse(atob(SelecteFilter[0].parameters));
        if (parameters) {
          this.setFormValue(parameters);
        }
      }
    } else {
      this.advanceFilterForm.reset();
      this.DefaultChecked(false);
      this.checkFilterName(false);
      this.resetSelectControls();
    }

  }

  setFormValue(parameters) {


    this.advanceFilterForm.controls['Ref'].setValue(parameters.Ref);
    this.advanceFilterForm.controls['InsuredName'].setValue(parameters.InsuredName);

    //this.advanceFilterForm.controls['StartDate'].setValue(parameters.StartDate);
    //this.advanceFilterForm.controls['EndDate'].setValue(parameters.EndDate);

    if (parameters.EffectiveFromDate != "" && parameters.EffectiveFromDate != null)
      this.advanceFilterForm.controls['EffectiveFromDate'].setValue(new Date(parameters.EffectiveFromDate));

    if (parameters.EffectiveToDate != "" && parameters.EffectiveToDate != null)
      this.advanceFilterForm.controls['EffectiveToDate'].setValue(new Date(parameters.EffectiveToDate));

    if (parameters.ExpirationFromDate != "" && parameters.ExpirationFromDate != null)
      this.advanceFilterForm.controls['ExpirationFromDate'].setValue(new Date(parameters.ExpirationFromDate));

    if (parameters.ExpirationToDate != "" && parameters.ExpirationToDate != null)
      this.advanceFilterForm.controls['ExpirationToDate'].setValue(new Date(parameters.ExpirationToDate));



    this.advanceFilterForm.controls['PremiumStart'].setValue(parameters.PremiumStart);
    this.advanceFilterForm.controls['PremiumEnd'].setValue(parameters.PremiumEnd);
    this.advanceFilterForm.controls['filterName'].setValue(parameters.filterName);

    this.advanceFilterForm.controls['ProcessingType'].setValue(parameters.ProcessingType);
    this.advanceFilterForm.controls['Agency'].setValue(parameters.Agency);
    this.advanceFilterForm.controls['AgentName'].setValue(parameters.AgentName);
    this.advanceFilterForm.controls['filterDetails'].setValue(parameters.filterDetails);

    if (parameters.Status != null && parameters.Status != "" && parameters.Status != "0")
      this.advanceFilterForm.controls['Status'].setValue(parameters.Status);
    else
      this.advanceFilterForm.controls['Status'].setValue("");

    if (parameters.BusinessType != null && parameters.BusinessType != "" && parameters.BusinessType != "0")
      this.advanceFilterForm.controls['BusinessType'].setValue(parameters.BusinessType);
    else
      this.advanceFilterForm.controls['BusinessType'].setValue("");


    if (parameters.TransactionType != null && parameters.TransactionType != "" && parameters.TransactionType != "0")
      this.advanceFilterForm.controls['TransactionType'].setValue(parameters.TransactionType);
    else
      this.advanceFilterForm.controls['TransactionType'].setValue("");

    if (parameters.LOB != null && parameters.LOB != "" && parameters.LOB != "0")
      this.advanceFilterForm.controls['LOB'].setValue(parameters.LOB);
    else
      this.advanceFilterForm.controls['LOB'].setValue("");

    if (parameters.Period != null && parameters.Period != "" && parameters.Period != "0")
      this.advanceFilterForm.controls['Period'].setValue(parameters.Period);
    else
      this.advanceFilterForm.controls['Period'].setValue("");

    if (parameters.Carrier != null && parameters.Carrier != "" && parameters.Carrier != "0")
      this.advanceFilterForm.controls['Carrier'].setValue(parameters.Carrier);
    else
      this.advanceFilterForm.controls['Carrier'].setValue("");

    if (parameters.State != null && parameters.State != "" && parameters.State != "0")
      this.advanceFilterForm.controls['State'].setValue(parameters.State);
    else
      this.advanceFilterForm.controls['State'].setValue("");


    if (parameters.AlfredFlags.length > 0) {
      this.alfredFlagListChecked = parameters.AlfredFlags;
      this.advanceFilterForm.controls['AlfredFlags'].setValue(this.alfredFlagListChecked);
    }


    /*if (parameters.StartDate == null || parameters.StartDate == "" || parameters.StartDate == undefined)
      this.bsStartValue = new Date();
    else
      this.bsStartValue = new Date(parameters.StartDate);


    if (parameters.EndDate == null || parameters.EndDate == "" || parameters.EndDate == undefined)
      this.bsEndValue = new Date();
    else
      this.bsEndValue = new Date(parameters.EndDate);*/

    this.SavedAdvanceFilterParameterID = this.advancedFilterId;



  }

  /* onLOBChange(value) {
    this.advanceFilterForm.controls['LOB'].setValue(value);
  } */

  onTransactionTypeChange(value) {
    this.advanceFilterForm.controls['TransactionType'].setValue(value);
  }

  onStatusChange(value) {
    this.advanceFilterForm.controls['Status'].setValue(value);
  }

  checkAlfredFlag(id, checked) {
    if (checked) {
      this.alfredFlagListChecked.push(id);
    } else {
      this.alfredFlagListChecked.splice(this.alfredFlagListChecked.indexOf(id), 1);
    }
    this.advanceFilterForm.controls['AlfredFlags'].setValue(this.alfredFlagListChecked);
  }

  onAgentNameChange(value) {

  }

  DefaultChecked(value) {
    this.isDefaultChecked = value;
  }
  saveAdvanceFilterOptions() {

    if (this.isFilterFlag) {
      let reqObj: ISaveAdvanceFilterReq = {
        AdvancedFilterId: this.advancedFilterId,
        FilterName: this.advanceFilterForm.controls['filterName'].value,
        IsActive: this.isDefaultChecked,
        Parameters: btoa(JSON.stringify(this.advanceFilterForm.value))
      }
      this.SaveFilterOptions.emit(reqObj);
    }
  }
  resetSelectControls() {

    this.advanceFilterForm.controls['Ref'].setValue("");
    this.advanceFilterForm.controls['InsuredName'].setValue("");
    this.advanceFilterForm.controls['LOB'].setValue("");
    this.advanceFilterForm.controls['AgentName'].setValue("");
    //this.advanceFilterForm.controls['StartDate'].setValue("");
    //this.advanceFilterForm.controls['EndDate'].setValue("");
    this.advanceFilterForm.controls['TransactionType'].setValue("");
    this.advanceFilterForm.controls['BusinessType'].setValue("");
    this.advanceFilterForm.controls['Status'].setValue("");
    this.advanceFilterForm.controls['PremiumStart'].setValue("");
    this.advanceFilterForm.controls['PremiumEnd'].setValue("");
    this.advanceFilterForm.controls['AlfredFlags'].setValue("");
    this.advanceFilterForm.controls['filterName'].setValue("");
    this.advanceFilterForm.controls['Agency'].setValue("");
    this.advanceFilterForm.controls['Agent'].setValue("");
    this.advanceFilterForm.controls['State'].setValue("");
    this.advanceFilterForm.controls['ProcessingType'].setValue("");
    this.advanceFilterForm.controls['Period'].setValue("");
    this.advanceFilterForm.controls['Carrier'].setValue("");
    this.advanceFilterForm.controls['filterDetails'].setValue("");

    this.advanceFilterForm.controls['EffectiveFromDate'].setValue("");
    this.advanceFilterForm.controls['EffectiveToDate'].setValue("");
    this.advanceFilterForm.controls['ExpirationFromDate'].setValue("");
    this.advanceFilterForm.controls['ExpirationToDate'].setValue("");

    this.SavedAdvanceFilterParameterID = "";
    this.alfredFlagListChecked = [];
    this.DefaultChecked(false);
  }
  cancelAdvanceFilterForm() {

    this.libDataView.OpenFilter();
    this.advanceFilterForm.reset();
    this.alfredFlagListChecked = [];
    this.isFilterFlag = false;
    this.resetSelectControls();


  }
  setViewPolicyData(data: any) {

    console.log("data", data);
    this.TransferViewPolicyParam.emit({ 'quoteId': data.quoteId, 'formId': data.formId })

  }
}


export interface ISaveAdvanceFilterReq {
  AdvancedFilterId: number;
  FilterName: string;
  IsActive: boolean;
  Parameters: string;
}
