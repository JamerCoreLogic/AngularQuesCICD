import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface AuditTrail {
  changedOn: string;
  updatedBy: string;
  tabName: string;
  propertyName: string;
  oldValue: string;
  newValue: string;
}

@Component({
  selector: 'app-audit-trail-info',
  templateUrl: './audit-trail-info.component.html',
  styleUrls: ['./audit-trail-info.component.scss'],
  providers: [DatePipe]
})
export class AuditTrailInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  userId: any;
  displayedColumns: string[] = ['changedOn', 'updatedBy', 'tabName', 'propertyName', 'oldValue', 'newValue'];
  dataSource: AuditTrail[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageNo = 1;
  pageSize = 100;
  sortColumn = 'changedOn';
  sortDesc = true;
  totalCount = 0;
  lastLoginDate: any;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private SpinnerService: NgxSpinnerService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // No data fetching here; moved to ngAfterViewInit
  }

  ngAfterViewInit(): void {
    // Listen to paginator and sort events
    if (this.paginator && this.sort) {
      this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe((event: PageEvent) => {
        this.pageNo = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.getAuditLogEntry();
      });
      this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe((sort: Sort) => {
        this.sortColumn = sort.active;
        this.sortDesc = sort.direction === 'desc';
        this.pageNo = 1; // Reset to first page on sort
        this.paginator.firstPage();
        this.getAuditLogEntry();
      });
      // Set initial sort state
      setTimeout(() => {
        const sortState: Sort = { active: 'changedOn', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }, 0);
      // Initial data fetch
      this.getAuditLogEntry();
    }
  }

  getAuditLogEntry() {
    this.errorMessage = '';
    this.authService.getUserData().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res) {
          const userData = res;
          const UserId = userData.userId;
          if (userData.lastLogin) {
            const date = new Date(userData.lastLogin);
            this.lastLoginDate = this.datePipe.transform(date, 'MM/dd/yyyy') || 'N/A';
            this.cdr.detectChanges();
          } else {
            this.lastLoginDate = 'N/A';
            this.cdr.detectChanges();
          }
          if (UserId) {
            this.SpinnerService.show();
            const data = {
              userId: UserId,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
              sortColumn: this.sortColumn,
              sortDesc: this.sortDesc
            };
            this.authService.getAuditLogEntry(data).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: any) => {
                const auditLogs = res.data?.auditLogs || [];
                auditLogs.forEach((item: any) => {
                  if (item.changedOn) {
                    const utcDate = item.changedOn.endsWith('Z') ? item.changedOn : item.changedOn + 'Z';
                    const localDate = new Date(utcDate);
                    item.changedOn = this.datePipe.transform(localDate, 'MM/dd/yyyy, h:mm:ss a') || localDate.toLocaleString();
                  }
                });
                this.dataSource = auditLogs;
                this.totalCount = res.data?.totalCount || 0;
                if (this.paginator) {
                  this.paginator.length = this.totalCount;
                }
                this.SpinnerService.hide();
              },
              error: (error: any) => {
                this.SpinnerService.hide();
                this.errorMessage = 'Failed to load audit log entries.';
              }
            });
          }
        }
      },
      error: (err: any) => {
        this.lastLoginDate = 'N/A';
        this.cdr.detectChanges();
        this.errorMessage = 'Failed to load user data.';
        this.SpinnerService.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
