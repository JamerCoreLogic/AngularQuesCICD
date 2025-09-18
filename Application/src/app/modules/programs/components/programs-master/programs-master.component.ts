import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, observable } from 'rxjs';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AQAgencyService } from '@agenciiq/agency';
import { AQUserInfo } from '@agenciiq/login';
import { MAnageProgramService } from '@agenciiq/aq-programs';

@Component({
  selector: 'app-programs-master',
  templateUrl: './programs-master.component.html',
  styleUrls: ['./programs-master.component.sass'],
  standalone: false
})
export class ProgramsMasterComponent implements OnInit, OnDestroy {
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
  private programListSubscription: Subscription

  constructor(
    private _programService: MAnageProgramService,
    private router: Router,
    private _loader: LoaderService,
  ) { }

  ngOnInit() {
    this.getProgramList();
  }
  getProgramList() {
    this._loader.show();
    this.programListSubscription = this._programService.ManagePrograms(this.userId, this.clientId).subscribe(programList => {
      this._loader.hide();
      if (programList?.data?.getProgramsList) {
        this.ColumnList = Object.keys(programList.data.getProgramsList[0]);
        this.dataSource = programList.data.getProgramsList
        this.sortedColumnName = { 'columnName': 'programName', isAsc: this.flag };
        this.NoRecordsMessage = "";
      } else {
        this.NoRecordsMessage = "No Record Found.";
      }
    }, (err) => {
      this._loader.hide();
      console.log("err", err);
    }, () => {
      this._loader.hide();
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
