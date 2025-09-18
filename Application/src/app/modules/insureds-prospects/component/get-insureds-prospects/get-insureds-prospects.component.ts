
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQUserInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { InsuredsProspectsService } from '@agenciiq/quotes'
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';

@Component({
  selector: 'app-get-insureds-prospects',
  templateUrl: './get-insureds-prospects.component.html',
  styleUrls: ['./get-insureds-prospects.component.sass'],
  standalone: false
})
export class GetInsuredsProspectsComponent implements OnInit {

  dataSource: any = [];
  NoRecordsMessage: string;
  Pagination: any;
  ColumnList: string[] = [];
  sortedColumnName: { columnName: any; isAsc: boolean; };
  flag: boolean = true;
  viewMode: "list" | "add" | "edit" | 'branch' = "list";
  userId: number;
  clientId: any;
  private programListSubscription: Subscription

  constructor(
    private router: Router,
    private _loader: LoaderService,
    private _userInfo: AQUserInfo,
    private Session: AQSession,
    private _insuredsProspects: InsuredsProspectsService,
    private _sortingService: SortingService,
  ) {
    this.userId = _userInfo.UserId();
  }

  ngOnInit() {
    this.getInsuredProspectList();
  }

  getInsuredProspectList() {
    this._loader.show();
    this._insuredsProspects.getInsuredsProspects(this.userId, this.clientId).subscribe(insuredsProspectsList => {
      this._loader.hide();
      if (insuredsProspectsList?.data?.insureds?.length) {
        this.ColumnList = Object.keys(insuredsProspectsList.data.insureds[0]);
        this.dataSource = insuredsProspectsList.data.insureds;
        this.sortedColumnName = { 'columnName': 'insuredName', isAsc: this.flag };
        this.NoRecordsMessage = "";
      } else {
        this.NoRecordsMessage = "No Record Found.";
      }
    }, (err) => {
      console.error('Error fetching insureds/prospects:', err);
      this._loader.hide();
    }, () => {
      this._loader.hide();

    });

  }

  getInsuredDetail(data: { insuredId: any; quoteId: any; }, type: any) {
    let reqObj = {
      UserId: this.userId,
      InsuredId: data.insuredId,
      QuoteId: data.quoteId,
      ClientId: 0,
      type: type
    }
    this.Session.removeSession('viewPolicyParams');
    this.Session.setData("insuredReqObj", reqObj);
    this.Session.setData("insuredView", "insuredView");
    this.router.navigate(['agenciiq/workbook/quickquote']);
  }

  sortInsured(columnName: any) {
    this.flag = !this.flag;
    this.sortedColumnName = { 'columnName': columnName, isAsc: this.flag };
  }

  ngOnDestroy() {
    if (this.programListSubscription) {
      this.programListSubscription.unsubscribe();
    }
  }
}
