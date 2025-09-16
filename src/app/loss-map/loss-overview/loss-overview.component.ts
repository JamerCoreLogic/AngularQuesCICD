import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'loss-overview',
  templateUrl: './loss-overview.component.html',
  styleUrls: ['./loss-overview.component.scss']
})
export class LossOverviewComponent implements OnInit  {
  any:any;
  drawer: any;
  Arrow: boolean = false;
  isToggleList:boolean=false;
  @Output() toggleArrow = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {

  }
  
  toggleList() {
    this.Arrow = !this.Arrow;
    this.isToggleList= !this.isToggleList
   
    this.toggleArrow.emit(this.Arrow); // Emitting the output event
  }
  

}
