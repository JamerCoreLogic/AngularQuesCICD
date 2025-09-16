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
import { environment } from 'src/environments/environment'; 
import { AiApiService } from '../services/ai-api.service';
import { SurveySentListComponent } from './survey-sent-list/survey-sent-list.component';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-survey-dashboard',
  templateUrl: './survey-dashboard.component.html',
  styleUrls: ['./survey-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SurveyDashboardComponent implements OnInit , AfterViewInit {

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  loggedUserRes: any;
  loggedUserType: number | any;

  constructor(
    private DS: DashboardService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private SS: AiApiService,
  ) { }

  isActive = true;
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  columnsToDisplay: string[] = [
    'title',
    'surveyName',
    'createOn',
    'totelSent',
    'submitted',
    'notResponded',
  ];
  columnsAliases: { [key: string]: string } = {
    title: 'Title',
    surveyName: 'Survey Name',
    createOn: 'Sent Date',
    totelSent: 'Sent',
    submitted: 'Responded',
    notResponded: 'Not Responded',
    Action: 'Action',
  };
  dashboardData: any;
  dashBoardPercentage: any = { activePercent: 0, completePercent: 0 };
  expandedElement: PeriodicElement | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'Action','expand' ];
  pageSize = 10;

  ngOnInit() {
   
    this.loadData();
    this.loggedUserRes = localStorage.getItem('currentUser');
    this.loggedUserType = Number(localStorage.getItem('LoggedUserType'));
  
    if (this.loggedUserRes) {
      this.loggedUserRes = JSON.parse(this.loggedUserRes);
      // console.log('USER Respnce', this.loggedUserRes);
    }
  }

 
  loadData(): void {
    this.spinner.show();
    this.SS.getSurveyDashBoardDetails().subscribe(
      (response: any) => {
        if (response.success && response.data) {
          this.dashBoardPercentage.activePercent = response.data.activeSurveyPercentage;
          this.dashBoardPercentage.completePercent = response.data.closedSurveyPercentage;

          const surveyList = this.isActive ? response.data.activeSurveyList : response.data.closedSurveyList;
          this.processSurveyList(surveyList);
        }
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching survey dashboard data:', error);
        this.spinner.hide();
      }
    );
  }
  processSurveyList(surveyList: any[]): void {
    // console.log('surveyList', surveyList);
    this.dataSource.data = surveyList.map((survey) => ({
      ...survey,
      isExpanded: false // Add an expanded property to each row
    }));

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  ActiveList(): void {
    this.isActive = true;
    this.loadData();
  }

  CompletedList(): void {
    this.isActive = false;
    this.loadData();
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
      const sortState: Sort = { active: 'createOn', direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  viewSurveyList(element: any): void {
     // Expand the current row
  
      // Make an API call for the expanded row
      this.spinner.show(); // Show a spinner if needed
      let sortBy='Name'
      let sortOrder='asc'
      this.SS.getSurveyRecordsById(element.portalId, sortBy, sortOrder)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (response: any) => {
          if (response?.data) {
            element.expandedData = response.data;
            this.dialog.open(SurveySentListComponent, {
              data: { element },
              panelClass: 'survey_list_form',
            });
          } else {
            console.error('Failed to fetch expanded details:', response?.message);
          }
        },
        error: (error) => {
          console.error('Error fetching expanded details:', error);
        }
      });
    

   
  }

  sendSurvey() {
    this.router.navigate(['/main/initiatesurvey'] , { queryParams: { module: 'Survey' }});
  }
  viewResponce(data: any) {
    // console.log('viewResponce', data);
    this.router.navigate(['/main/survey/survey-response'] , { queryParams: { id: data.portalId , title:data.title}});
  }

  createSurvey() {
    // console.log('createSurvey');
    // i want to open a new tab with external url
    window.open(environment.AI_UIENDPOINT , '_blank');
  }
  toggleRowExpansion(element:any){
    if (this.expandedElement === element) {
      this.expandedElement = null; // Collapse if already expanded
    } else {
      this.expandedElement = element; // Expand the current row
  
      // Make an API call for the expanded row
      this.spinner.show(); // Show a spinner if needed
      let sortBy='Name'
      let sortOrder='asc'
      this.SS.getSurveyRecordsById(element.portalId,sortBy,sortOrder).subscribe(
        (response:any) => {
          if (response) {
            // console.log('Expanded details:', response.data);
            // console.log('element:', element);
            element.expandedData = response.data; // Store expanded details in the row's model
          } else {
            console.error('Failed to fetch expanded details:', response.message);
          }
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching expanded details:', error);
          this.spinner.hide();
        }
      );
    }

  }
  // hasUserRole(moduleName: string): boolean {
  //   return this.loggedUserRes?.data?.role && this.loggedUserRes.data?.role.some((role: any) => role.userPageList.some((userPage: any) => userPage.moduleName === moduleName));
  // }
  isadmin(): boolean {
    if (this.loggedUserType === 1) {
      return this.loggedUserRes?.data?.role && this.loggedUserRes.data?.role.some((role: any) => role.roleName === 'Admin' || role.roleName === 'Super Admin');
    }
    return false;
  }
  assignToUser(event:boolean){
    // console.log("assignToUser",event)
    if(event){
      this.loadData();
    }
  }
  refreshData(event:boolean){
    if(event){
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

