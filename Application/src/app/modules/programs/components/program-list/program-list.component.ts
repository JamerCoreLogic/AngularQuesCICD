import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQUserInfo } from '@agenciiq/login';
import { MAnageProgramService } from '@agenciiq/aq-programs';
import { PopupService } from 'src/app/shared/utility/Popup/popup.service';
import { AQSession } from 'src/app/global-settings/session-storage';
import { Store } from '@ngrx/store';
import { selectFilteredPrograms, selectProgramNoRecordMessage } from 'store/selectors/program.selectors';
import { take } from 'rxjs/operators';
import { loadProgramList } from 'store/actions/program.action';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.sass'],
  standalone: false
})
export class ProgramListComponent implements OnInit {
  dataSource: any = [];
  NoRecordsMessage: string = '';
  Pagination: any;
  HideAdvanceFilterOption: boolean = false;
  ColumnList: string[] = [];
  upload: boolean = false;
  sortedColumnName: { columnName: any; isAsc: boolean; };
  flag: boolean = true;
  viewMode: "list" | "add" | "edit" | 'branch' = "list";
  userId: number;
  clientId: any;
  ProgramStage: any = '';
  programFormDefinition: any;
  private programListSubscription: Subscription
  dataSource$: Observable<any[]>;
  noRecordsMessage$: Observable<string>;

  constructor(
    private _programService: MAnageProgramService,
    private router: Router,
    private _loader: LoaderService,
    private _popupService: PopupService,
    private _userInfo: AQUserInfo,
    private Session: AQSession,
    private store: Store
  ) {
    this.userId = _userInfo.UserId();
  }

  ngOnInit() {
    this.getProgramList();
  }

  addAqProgramForm(type: any, data: any) {
    this.Session.setData('AQProgramData', JSON.stringify(data));
    this.router.navigateByUrl('agenciiq/programs/aqProgram');
  }


  // getProgramList() {
  //   this._loader.show();
  //   this.ProgramStage = ''
  //   this.programListSubscription = this._programService.ManagePrograms(this.userId, this.clientId).subscribe(programList => {
  //     this._loader.hide();
  //     if (programList?.data?.getProgramsList) {
  //       this.ColumnList = Object?.keys(programList?.data?.getProgramsList[0] ? programList?.data?.getProgramsList[0] : {});
  //       this.dataSource = programList?.data?.getProgramsList
  //       this.sortedColumnName = { 'columnName': 'programName', isAsc: this.flag };
  //       this.NoRecordsMessage = "";
  //     } else {
  //       this.NoRecordsMessage = "No Record Found.";
  //     }
  //   }, (err) => {
  //     this._loader.hide();
  //     console.log("err", err);
  //   }, () => {
  //     this._loader.hide();
  //   });
  // }


  getProgramList() {
    this.dataSource$ = this.store.select(selectFilteredPrograms, {
      userId: this.userId,
      clientId: this.clientId,
    });

    this.noRecordsMessage$ = this.store.select(selectProgramNoRecordMessage, {
      userId: this.userId,
      clientId: this.clientId,
    });

    this.programListSubscription?.unsubscribe();
    this.programListSubscription = this.dataSource$.pipe(take(1)).subscribe((data: any) => {
      if (!data || !data?.success) {
        this.store.dispatch(loadProgramList({ userId: this.userId, clientId: this.clientId }));
      }
      this.dataSource = data?.data?.getProgramsList;
      this.NoRecordsMessage = this.dataSource?.length > 0 ? '' : 'No Record Found.';
    });
  }

  sortPrograms(columnName: any) {
    this.flag = !this.flag;
    this.sortedColumnName = { 'columnName': columnName, isAsc: this.flag };
  }

  ngOnDestroy() {
    if (this.programListSubscription) {
      this.programListSubscription.unsubscribe();
    }
  }


}
