import { Component, OnInit, OnDestroy, Type, AfterViewInit, ViewChild, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { InsertionDirective } from './insertion.directive';
import { DialogConfig } from './dialog-config';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    standalone: false
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly _onClose = new Subject<any>();

  public componentRef: ComponentRef<any>
  public childComponentType: Type<any>;
  public onClose = this._onClose.asObservable();

  @ViewChild(InsertionDirective, {static:true}) insertionPoint: InsertionDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cd: ChangeDetectorRef,
    public config: DialogConfig,
  ) { }

  loadChildComponent(componentType: Type<any>){
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    let viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }

  ngOnDestroy(){
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onOverlayClicked(evt: MouseEvent){

  }

  onDialogClicked(evt:MouseEvent){
    evt.stopPropagation();
  }

}
