
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQUserInfo } from '@agenciiq/login';
import { AQSession } from 'src/app/global-settings/session-storage';
import { InsuredsProspectsService } from '@agenciiq/quotes'
import { SortingService } from 'src/app/shared/services/sorting-service/sorting.service';
import { Store } from '@ngrx/store';
import { selectInsuredProspects } from 'store/selectors/insured.selectors';
import { loadInsuredProspects } from 'store/actions/insured.actions';

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
  insuredDataSource$: Observable<any[]>;
  private InsuredListSubscription: Subscription;

  constructor(
    private router: Router,
    private _loader: LoaderService,
    private _userInfo: AQUserInfo,
    private Session: AQSession,
    private _insuredsProspects: InsuredsProspectsService,
    private _sortingService: SortingService,
    private store: Store
  ) {
    this.userId = _userInfo.UserId();
  }

  ngOnInit() {
    this.getInsuredProspectList();
  }

  // getInsuredProspectList() {
  //   this._loader.show();
  //   this._insuredsProspects.getInsuredsProspects(this.userId, this.clientId).subscribe(insuredsProspectsList => {
  //     this._loader.hide();
  //     if (insuredsProspectsList?.data?.insureds?.length) {
  //       this.ColumnList = Object.keys(insuredsProspectsList.data.insureds[0]);
  //       this.dataSource = insuredsProspectsList.data.insureds;
  //       this.sortedColumnName = { 'columnName': 'insuredName', isAsc: this.flag };
  //       this.NoRecordsMessage = "";
  //     } else {
  //       this.NoRecordsMessage = "No Record Found.";
  //     }
  //   }, (err) => {
  //     console.error('Error fetching insureds/prospects:', err);
  //     this._loader.hide();
  //   }, () => {
  //     this._loader.hide();

  //   });

  // }

  getInsuredProspectList() {
    this.insuredDataSource$ = this.store.select(selectInsuredProspects);

    this.InsuredListSubscription?.unsubscribe();
    this.InsuredListSubscription = this.insuredDataSource$.pipe().subscribe((data: any) => {
      if (!data || data.length === 0) {
        this.store.dispatch(loadInsuredProspects({ userId: this.userId, clientId: this.clientId }));
      }
      if (data?.length) {
        this.ColumnList = Object.keys(data[0]);
        setTimeout(() => {
          this.dataSource = data;
          this._loader.hide();
        }, 100);
        this.sortedColumnName = { 'columnName': 'insuredName', isAsc: this.flag };
        this.NoRecordsMessage = "";
      } else {
        this.NoRecordsMessage = "No Record Found.";
      }
    });
    this._loader.hide();
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
