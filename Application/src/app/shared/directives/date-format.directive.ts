import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Directive({
    selector: '[DateFormat]',
    providers: [DatePipe],
    standalone: false
})
export class DateFormatDirective implements OnInit {

  private _dateControl: AbstractControl;

  @Input()
  set dateControl(control: AbstractControl) {
    this._dateControl = control;
  }

  constructor(
    private el: ElementRef,    
    private datePipe: DatePipe
  ) {

  }

  ngOnInit() {
    this._dateControl.valueChanges.subscribe(x => {
      let updatedDate = this.datePipe.transform(x, "MM/dd/yyyy");         
      this.el.nativeElement.value = updatedDate;      
    })
  }




}
