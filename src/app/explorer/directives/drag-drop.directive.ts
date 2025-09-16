import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { ExplorerService } from '../services/explorer.service';

@Directive({
  selector: '[nxeDragDrop]'
})
export class DragDropDirective {
  @Output() dragEnter = new EventEmitter<any>();
  @Output() dragOver = new EventEmitter<any>();
  @Output() dragLeave = new EventEmitter<any>();
  @Output() dragDrop = new EventEmitter<any>();
  @Output() dragging = new EventEmitter<boolean>();

  constructor(private explorerService: ExplorerService) { }

  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragEnter.emit(event);
    this.dragging.emit(true);

  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.emit(event);
    this.dragging.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragLeave.emit(event);
    this.dragging.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const dataTransfer = event.dataTransfer;
      if (dataTransfer && dataTransfer.files) {
        const files = Array.from(dataTransfer.files);
        if (files.length > 0) {
          try {
            this.explorerService.upload(files);
            this.dragDrop.emit(files);
          } catch (error) {
            console.error('Upload failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    } finally {
      this.dragging.emit(false);
    }
  }

}

