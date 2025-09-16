import { DashboardService } from './../services/dashboard.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { InitiateRequestComponent } from '../find-adjuster/initiate-request/initiate-request.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(
    private DS: DashboardService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router1: Router,
    private spinner: NgxSpinnerService
  ) { }

  isActive = true;
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  columnsToDisplay: string[] = ['title', 'location', 'date', 'submitted_By', 'availableAdjuster', 'unavailableAdjuster', 'notResponded'];
  columnsAliases: { [key: string]: string } = {
    title: 'Title',
    location: 'Location',
    date: 'Date',
    submitted_By: 'Submitted By',
    availableAdjuster: 'Available Adjuster',
    unavailableAdjuster: 'Unavailable Adjuster',
    notResponded: 'Not Responded',
    acceptedRequestDetails: 'Accepted Request Details',
    declinedRequestDetails: 'Declined Request Details',
    notRespondedRequestDetails: 'Not Responded Request Details',
  };
  dashboardData: any;
  dashBoardPercentage: any;
  expandedElement: PeriodicElement | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  router: any;
  pageSize = 10;

  ngOnInit() {
    const obj = this.authService.isUserAllowed(window.location);
    if (obj.isAllow) {
      this.spinner.show(); // Show spinner at the beginning of ngOnInit
      this.loadData();
    } else {
      this.router1.navigate([obj.allowedPath]);
    }
  }

  loadData() {
    const dashboardData$ = this.DS.GetDashboardData();
    const activeUserPercentage$ = this.DS.GetActiveUserPercentage();

    // Use forkJoin to load all data and hide spinner once all data is loaded
    forkJoin([dashboardData$, activeUserPercentage$]).subscribe(
      ([dashboardData, activeUserPercentage]) => {
        this.processDashboardData(dashboardData);
        this.processActiveUserPercentage(activeUserPercentage);
        this.spinner.hide(); // Hide spinner after all data is loaded
      },
      (error) => {
        console.error(error);
        this.spinner.hide(); // Hide spinner in case of an error
      }
    );
  }

  processDashboardData(data: any) {
    if (data) {
      const transformedData = this.transformData(data.activeDetails);
      this.dataSource.data = transformedData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  processActiveUserPercentage(data: any) {
    this.dashBoardPercentage = data;
  }

  ActiveList() {
    this.spinner.show();
    this.isActive = true;
    this.DS.GetDashboardData().subscribe(
      (data: any) => {
        if (data) {
          const transformedData = this.transformData(data.activeDetails);
          this.dataSource.data = transformedData;
        }
        this.spinner.hide();
      },
      (error) => {
        console.error(error);
        this.spinner.hide();
      }
    );
  }

  CompletedList() {
    this.spinner.show();
    this.isActive = false;
    this.DS.GetDashboardData().subscribe(
      (data: any) => {
        if (data) {
          const transformedData = this.transformData(data.completeDetails);
          this.dataSource.data = transformedData;
        }
        this.spinner.hide();
      },
      (error) => {
        console.error(error);
        this.spinner.hide();
      }
    );
  }

  transformData(data: any) {
    return data.map((user: any) => ({
      commRequestId: user.commRequestId,
      title: user.title,
      location: user.location,
      date: user.date,
      submitted_By: user.submitted_By,
      availableAdjuster: user.availableAdjuster,
      unavailableAdjuster: user.unavailableAdjuster,
      notResponded: user.notResponded,
      requestStatus: user.requestStatus,
      client: user.client,
      assignmentType: user.assignmentType,
      requestDate: user.requestDate,
      isSingleClaim: user.isSingleClaim,
      description: user.description,
      acceptedRequestDetails: user.acceptedRequestDetails,
      declinedRequestDetails: user.declinedRequestDetails,
      notRespondedRequestDetails: user.notRespondedRequestDetails,
      graphPercentage: user.graphPercentage,
      ajusterDetails: user.adjusterData,
    }));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      const sortState: Sort = { active: 'date', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewInitiateRequest(data: any) {
    data.isViewRequest = true;
    this.openDialog(data);
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(InitiateRequestComponent, {
      data: { data },
      panelClass: 'initiate_form'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle after dialog closed actions
    });
  }
  onMarkedCompletedSucess(success: boolean) {
    if (success) {
      this.spinner.show();
      this.loadData();
    }
  }
}

export interface PeriodicElement {
  title: string;
  location: string;
  date: string;
  submitted_By: string;
  availableAdjuster: number;
  unavailableAdjuster: number;
  notResponded: number;
  requestStatus: string;
  client: string;
  assignmentType: string;
  requestDate: string;
  isSingleClaim: boolean;
  description: string;
  acceptedRequestDetails: Array<{ name: string; phone: string; email: string; date: string; location: string; distance: null }>;
  declinedRequestDetails: Array<{ name: string; phone: string; email: string; date: string; location: string; distance: null }>;
  notRespondedRequestDetails: Array<{ name: string; phone: string; email: string; date: string; location: string; distance: null }>;
  graphPercentage: Array<{ acceptedPercent: number; declinedPercent: number; notRespondedPercent: number }>;
  ajusterData: Array<{ email: string; name: string; emailDate: string }>;
}
