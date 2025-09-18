import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'lib-filter',
    template: `
  <div class="filter-block" *ngIf="FilterOpen">
  <div class="fb_header">
      <div class="col-lg-1 col-md-2 col-sm-3 pd_zero">
          <div class="form-group">
              <label class="textbox_borderlabel">Saved Filters</label>
          </div>
      </div>
      <div class="col-sm-2 col-md-3 col-lg-2">
          <div class="form-group">
              <select class="form-control dropdown_border">
                  <option disabled selected>Select</option>
                  <option>Filter 1</option>
              </select>
          </div>
      </div>
  </div>

  <div class="fb_center">
      <div class="row pd_zero">
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Ref #</label>
                  <input type="text" class="form-control textbox_border_input">
              </div>
          </div>
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Insured Name</label>
                  <input type="text" class="form-control textbox_border_input">
              </div>
          </div>
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">LOB</label>
                  <select class="form-control dropdown_border">
                      <option disabled selected>Select</option>
                      <option>Filter 1</option>
                  </select>
              </div>
          </div>
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Agent Name</label>
                  <input type="text" class="form-control textbox_border_input">
              </div>
          </div>
      </div>
      <div class="row pd_zero">
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Start Date & End Date</label>
                  <input type="text" class="form-control textbox_border_input width45">
                  <span class="inline-span">To</span>
                  <input type="text" class="form-control textbox_border_input width45">
              </div>
          </div>
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Transaction Type</label>
                  <select class="form-control dropdown_border">
                      <option disabled selected>Select</option>
                      <option>Filter 1</option>
                  </select>
              </div>
          </div>
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Status</label>
                  <select class="form-control dropdown_border">
                      <option disabled selected>Select</option>
                      <option>Filter 1</option>
                  </select>
              </div>
          </div>
          <div class="col-sm-3 col-md-3 col-lg-3">
              <div class="form-group">
                  <label class="textbox_borderlabel">Premium Range</label>
                  <input type="text" class="form-control textbox_border_input width45">
                  <span class="inline-span">To</span>
                  <input type="text" class="form-control textbox_border_input width45">
              </div>
          </div>
      </div>
      <div class="row pd_zero">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="col-md-12 pd_zero">
                  <div class="form-group">
                      <label class="textbox_borderlabel">Alfred Flags</label>
                      <div class="styled-checkbox">
                          <div class="checkbox">
                              <input type="checkbox" id="AlfredFlag1" checked>
                              <label for="AlfredFlag1">
                                  <div class="checkercheckbox"></div>
                                  Option 1
                              </label>
                          </div>
                          <div class="checkbox">
                              <input type="checkbox" id="AlfredFlag2">
                              <label for="AlfredFlag2">
                                  <div class="checkercheckbox"></div>
                                  Option 2
                              </label>
                          </div>
                          <div class="checkbox">
                              <input type="checkbox" id="AlfredFlag3">
                              <label for="AlfredFlag3">
                                  <div class="checkercheckbox"></div>
                                  Option 3
                              </label>
                          </div>
                          <div class="checkbox">
                              <input type="checkbox" id="AlfredFlag4">
                              <label for="AlfredFlag4">
                                  <div class="checkercheckbox"></div>
                                  Option 4
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
          <div class="form-group right-buttons">
              <button class="btn cancel-btn">Clear All</button>
              <button class="btn btn-theme-radius fix_width">Search</button>
          </div>
      </div>
  </div>
</div>
  `,
    styles: [],
    standalone: false
})
export class FilterComponent implements OnInit {

  FilterOpen = false;

  @Input('AdvanceFilter') set filter(filter: boolean) {
    this.FilterOpen = filter;
  }

  constructor() { }

  ngOnInit() {
  }

}
