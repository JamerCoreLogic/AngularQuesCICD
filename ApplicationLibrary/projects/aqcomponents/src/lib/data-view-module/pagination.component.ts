import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lib-pagination',
    template: `
  <ul *ngIf="Pager && Pager.pages && Pager.pages.length" class="table-pagination">
  <li>
      <span class="btns" [ngClass]="{disable:Pager.currentPage === 1}" (click)="valueChange.emit(Pager.currentPage - 1)">Previous</span>
      <span class="btns" [ngClass]="{disable:Pager.currentPage === 1}" (click)="valueChange.emit(1)"><<</span>
      <span *ngFor="let page of Pager.pages" class="btns" [ngClass]="{active:Pager.currentPage === page}" (click)="valueChange.emit(page)">{{page}}</span>    
      <span class="btns"  [ngClass]="{disable:Pager.currentPage === Pager.totalPages}" (click)="valueChange.emit(Pager.totalPages)">>></span>
      <span class="btns"  [ngClass]="{disable:Pager.currentPage === Pager.totalPages}" (click)="valueChange.emit(Pager.currentPage + 1)">Next</span>
  </li>
</ul>
  `,
    standalone: false
})
export class PaginationComponent {

  Pager: any;

  @Input('Pager') set setPager(pager:any) {       
      this.Pager = pager;   
  }

  @Output('OutputPage') valueChange = new EventEmitter();
 

}


