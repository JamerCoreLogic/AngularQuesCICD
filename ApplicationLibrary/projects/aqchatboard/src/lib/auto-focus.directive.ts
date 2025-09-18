
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[datoAutoFocus]',
    standalone: false
})
export class AutoFocusDirective implements AfterViewInit {


  public constructor(private host: ElementRef) { }

  ngAfterViewInit() {
    this.focus();
  }

  focus() {
    this.host.nativeElement.focus();
  }


}