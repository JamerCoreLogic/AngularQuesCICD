import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[clickOutside]',
    standalone: false
})
export class ClickOutsideDirective {
    @Output() public clickOutside = new EventEmitter();
    constructor(private _elementRef: ElementRef) {

    }

    @HostListener('document:dblclick', ['$event.target'])
    public onClick(targetElement) {
        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!isClickedInside) {
            this.clickOutside.emit(null);
        }
    }
}