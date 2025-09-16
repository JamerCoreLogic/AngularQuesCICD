import { Component, OnInit, Input, Output,EventEmitter,OnChanges,SimpleChanges, ViewChild, ChangeDetectorRef, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedAdjusterService } from 'src/app/services/shared-adjuster.service';
import { LossViewProfileComponent } from '../loss-view-profile/loss-view-profile.component';

@Component({
  selector: 'loss-adjuster-list',
  templateUrl: './loss-adjuster-list.component.html',
  styleUrls: ['./loss-adjuster-list.component.scss']
})
export class LossAdjusterListComponent implements OnInit,OnChanges {
  @Input() adjusters: any[] = [];
  @Input() circleCenter!: google.maps.LatLngLiteral;
  @Input() radius!: number;
  @Input() searchText!: string;
  @Output() adjustersUpdated = new EventEmitter<any[]>();
  selectedAdjusters: any[] = [];
  private subscriptions: Subscription = new Subscription();


  isCheckboxSelected = false;
  
  originalAdjusters: any[] = []; 
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  isFilterApplied: boolean = false;
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

  constructor(public dialog: MatDialog,private sharedAS:SharedAdjusterService, private cdr:ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.originalAdjusters = [...this.adjusters];
  this.checkChangesInAdjusters();
  }
  ngAfterViewInit(): void {
    this.scrollToClickedAdjuster();
    this.cardElements.changes.subscribe(() => this.scrollToClickedAdjuster());
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['adjusters'] && changes['adjusters'].currentValue !== changes['adjusters'].previousValue) {
      this.originalAdjusters = [...changes['adjusters'].currentValue];
  
      // Filter selectedAdjusters to keep only those present in the updated adjusters list
      const currentAdjusterIds = this.adjusters.map(adjuster => adjuster.userId);
      const updatedSelection = this.selectedAdjusters.filter(adj => currentAdjusterIds.includes(adj.userId));
  
      if (JSON.stringify(this.selectedAdjusters) !== JSON.stringify(updatedSelection)) {
        this.selectedAdjusters = updatedSelection;
        this.sharedAS.setSelectedAdjusterList(this.selectedAdjusters.map(adj => adj.userId));
        this.isCheckboxSelected = this.selectedAdjusters.length > 0;
      }
    }
  }
  ngOnDestroy(): void {
    // localStorage.removeItem('clickedAdjusterId');
    this.subscriptions.unsubscribe();
  }
  checkChangesInAdjusters(){
    this.subscriptions.add(
  this.sharedAS.searchText$.subscribe((data:string)=>{
    if(data){
      // this.selectedAdjusters=[]
    }
  })
)
this.subscriptions.add(
  this.sharedAS.radius$.subscribe((data:number)=>{
    if(data){
      // this.selectedAdjusters=[]
    }
  })
)
this.subscriptions.add(
  this.sharedAS.filterSubject$.subscribe((data:any)=>{
    if(data){
      // this.selectedAdjusters=[]
    }
  }
)
)

this.subscriptions.add(
  this.sharedAS.isFilterSubject$.subscribe((data: boolean) => {
    this.isFilterApplied = data;
    this.cdr.detectChanges();
  })
);

this.subscriptions.add(
  this.sharedAS.adjusterSelectedList$.subscribe((selectedIds: string[]) => {
    const updatedSelection = this.adjusters.filter(adj => selectedIds.includes(adj.userId));
    if (JSON.stringify(this.selectedAdjusters) !== JSON.stringify(updatedSelection)) {
      this.selectedAdjusters = updatedSelection;
      this.isCheckboxSelected = this.selectedAdjusters.length > 0;
    }
  })
);
  }

  viewProfile(adjuster :any): void {

    const dialogRef = this.dialog.open(LossViewProfileComponent, {
      data: { adjuster: adjuster,width:"41vw"},
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
    localStorage.setItem('clickedAdjusterId', adjuster.userId);
    localStorage.setItem('editUser', JSON.stringify(adjuster));
  }

  // viewNotification(adjuster:any): void {
  //     const dialogRef =this.dialog.open(NotificationComponent,{

  //       data: { adjuster: adjuster },
  //       panelClass: 'view_adjuster_info'
  //     });

  //     // const dialogRef =this.dialog.open(TablinkComponent
  //     // );

  //     dialogRef.afterClosed().subscribe(result => {
  //       //console.log('The dialog was closed');
  //     });

  //   };
    initiateRequest() {
      // Pass selectedAdjusters array to InitiateRequestComponent
      this.selectedAdjusters = this.selectedAdjusters.map(adjuster => {
        return this.searchText ? { ...adjuster, searchText: this.searchText } : adjuster;
      });
      // console.log("selectedAdjusters",this.selectedAdjusters);
      this.sharedAS.setSelectedAdjusterList(this.selectedAdjusters);
      // debugger
      // navigate to initiate request page which is different module component

      this.router.navigate(['/main/initiatesurvey'] , { queryParams: { module: 'loss-map' }});

      // const dialogRef = this.dialog.open(InitiateRequestComponent, {
      //   data: { adjusters: this.selectedAdjusters },
      //   panelClass: 'custom-form'
      // });

      // dialogRef.afterClosed().subscribe(() => {
      //   //console.log('The dialog was closed');
      // });
    }
 
    updateCheckboxSelection(adjuster: any, event: any) {
      if (event.checked) {
        if (!this.selectedAdjusters.some(adj => adj?.userId === adjuster.userId)) {
          this.selectedAdjusters.push(adjuster);
        }
        this.sharedAS.setSelectedAdjuster(adjuster.userId, true);
      } else {
        this.selectedAdjusters = this.selectedAdjusters.filter(adj => adj?.userId !== adjuster.userId);
        this.sharedAS.setSelectedAdjuster(adjuster.userId, false);
      }
    
      // Filter out invalid adjusters
      this.selectedAdjusters = this.selectedAdjusters.filter(adj => adj && adj.userId);
    
      this.isCheckboxSelected = this.selectedAdjusters.length > 0;
    
      // Update the shared service with valid selected adjusters
      this.sharedAS.setSelectedAdjusterList(this.selectedAdjusters.map(adj => adj.userId));
    }



  updateFilterData(filteredData:any){
    // console.log("update Filter Data",filteredData);
    this.adjustersUpdated.emit(filteredData);
    // this.isFilterApplied = filteredData.length !== this.originalAdjusters.length;

  }
  hoverAdjuster(id: string) {
    this.sharedAS.setHoveredAdjuster(id, 'hover');
  }
  
  unhoverAdjuster(id: string) {
    this.sharedAS.setHoveredAdjuster(id, 'unhover');
  }
  
  trackByFn(index: number, item: any): any {
    return item.userId;  // Use a unique identifier from your item
  }
  isClickedAdjuster(adjusterId: string): boolean {
    const clickedAdjusterId = localStorage.getItem('clickedAdjusterId');
    return adjusterId === clickedAdjusterId;
  }
  scrollToClickedAdjuster(): void {
    const clickedAdjusterId = localStorage.getItem('clickedAdjusterId');
    if (!clickedAdjusterId) return;
  
    // Delay scrolling to ensure the DOM elements are available
    setTimeout(() => {
      this.cardElements.forEach(card => {
        if (card.nativeElement.getAttribute('id') === clickedAdjusterId) {
          card.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }, 0);
  }
  checkSelectedAdjuster(adjuster: any): boolean {
    return this.selectedAdjusters.some(adj => adj && adj.userId === adjuster.userId);
  }


}
