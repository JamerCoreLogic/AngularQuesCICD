import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[dataTextFocus]',
    standalone: false
})
export class TextFocusDirective implements OnInit {

  constructor(private host: ElementRef) {
    
  }

  ngOnInit(){
    this.host.nativeElement.focus();
  }


}