import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lib-pagination',
    template: `
  <ul *ngIf="Pager && Pager.pages && Pager.pages.length" class="table-pagination">
  <li>
      <span class="btns" [ngClass]="{disable:Pager.currentPage === 1}" (click)="ChangePage(Pager.currentPage - 1)">Previous</span>
      <span class="btns" [ngClass]="{disable:Pager.currentPage === 1}" (click)="ChangePage(1)"><<</span>
      <span *ngFor="let page of Pager.pages" class="btns" [ngClass]="{active:Pager.currentPage === page}" (click)="ChangePage(page)">{{page}}</span>    
      <span class="btns"  [ngClass]="{disable:Pager.currentPage === Pager.totalPages}"  (click)="ChangePage(Pager.totalPages)">>></span>
      <span class="btns"  [ngClass]="{disable:Pager.currentPage === Pager.totalPages}" (click)="ChangePage(Pager.currentPage + 1)">Next</span>
  </li>
</ul>
  `,
    standalone: false
})
export class PaginationComponent {

  Pager: any;
  showPager:boolean = true;
  prevPagerVal:number;

  @Input('Pager') set setPager(pager:any) {
    
    
      this.Pager = pager; 
      if(this.Pager) this.prevPagerVal = this.Pager.currentPage;
        
    console.log("this.Pager",this.Pager); 
    setTimeout(() => {
      //console.clear();
    }, 3000);
  }

  @Output('OutputPage') valueChange = new EventEmitter();

  ChangePage(pageNumber) {
    if(this.prevPagerVal == pageNumber) this.showPager = false;
      else this.showPager = true;

    if((pageNumber > 0 && pageNumber <= this.Pager.totalPages) && this.showPager) {
      this.valueChange.emit(pageNumber);
      this.prevPagerVal = pageNumber;
    }
    
  }

}


