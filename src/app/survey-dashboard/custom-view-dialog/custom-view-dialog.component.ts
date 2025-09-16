import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

export interface CustomViewColumn {
  field: string;
  title: string;
  isRequired?: boolean;
}

export interface CustomViewDialogData {
  availableColumns: CustomViewColumn[];
  selectedColumns: CustomViewColumn[];
}

export interface CustomViewResult {
  applied: boolean;
  selectedColumns: CustomViewColumn[];
}

@Component({
  selector: 'app-custom-view-dialog',
  templateUrl: './custom-view-dialog.component.html',
  styleUrls: ['custom-view-dialog.component.scss']
})
export class CustomViewDialogComponent {
  availableColumns: CustomViewColumn[] = [];
  selectedColumns: CustomViewColumn[] = [];

  availableSearch = '';
  selectedSearch = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomViewDialogData,
    private dialogRef: MatDialogRef<CustomViewDialogComponent, CustomViewResult>
  ) {
    // Make local copies to avoid mutating input arrays
    this.availableColumns = [...(data?.availableColumns || [])].sort((a, b) => a.title.localeCompare(b.title));
    this.selectedColumns = [...(data?.selectedColumns || [])];
  }

  get filteredAvailable() {
    const term = this.availableSearch.toLowerCase();
    return this.availableColumns.filter(c => c.title.toLowerCase().includes(term));
  }

  get filteredSelected() {
    const term = this.selectedSearch.toLowerCase();
    return this.selectedColumns.filter(c => c.title.toLowerCase().includes(term));
  }

  add(col: CustomViewColumn) {
    const idx = this.availableColumns.findIndex(c => c.field === col.field);
    if (idx > -1) {
      const [removed] = this.availableColumns.splice(idx, 1);
      this.selectedColumns.push(removed);
    }
  }

  remove(col: CustomViewColumn) {
    if (col.isRequired) {
      return; // required columns cannot be removed
    }
    const idx = this.selectedColumns.findIndex(c => c.field === col.field);
    if (idx > -1) {
      const [removed] = this.selectedColumns.splice(idx, 1);
      this.availableColumns.push(removed);
      this.availableColumns.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  drop(event: CdkDragDrop<CustomViewColumn[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // prevent transferring required columns out of Selected list
      const movingFromSelectedToAvailable = event.previousContainer.data === this.selectedColumns && event.container.data === this.availableColumns;
      if (movingFromSelectedToAvailable) {
        const item = event.previousContainer.data[event.previousIndex];
        if (item?.isRequired) {
          return;
        }
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  cancel() {
    this.dialogRef.close({ applied: false, selectedColumns: [] });
  }

  apply() {
    this.dialogRef.close({ applied: true, selectedColumns: this.selectedColumns });
  }
}


