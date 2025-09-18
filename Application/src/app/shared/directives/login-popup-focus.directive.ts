import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[loginPopupFocus]',
    standalone: false
})
export class LoginPopupFocusDirective {

  @Input("loginPopupFocus")
  isOverlayHidden: boolean = true;

  constructor(private element: ElementRef, private renderer: Renderer2) { }
  
  ngAfterViewInit(){
     
    this.element.nativeElement.focus();
  }

}
