import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'adjuster-overview',
  templateUrl: './adjuster-overview.component.html',
  styleUrls: ['./adjuster-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdjusterOverviewComponent implements OnInit {
  any:any;
  drawer: any;
  Arrow: boolean = false;
  isToggleList:boolean=false;
  @Input() menuTrigger?: MatMenuTrigger;
  @Output() toggleArrow = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit(): void {
    // Initialization if needed
  }
  
  toggleList(): void {
    this.Arrow = !this.Arrow;
    this.isToggleList = !this.isToggleList;
    this.toggleArrow.emit(this.Arrow);
  }
}
