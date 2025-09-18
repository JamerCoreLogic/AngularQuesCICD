import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() { }

  SortObjectArray(columnName: string, order: "ASC" | "DSC", arrayList: any[]) {
    if (order == 'ASC') {
      return arrayList.sort((a, b) => {
        if (String(a[columnName]).toLowerCase() < String(b[columnName]).toLowerCase()) {
          return -1;
        } else if (String(a[columnName]).toLowerCase() > String(b[columnName]).toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (order == 'DSC') {
      return arrayList.sort((a, b) => {
        if (String(a[columnName]).toLowerCase() < String(b[columnName]).toLowerCase()) {
          return 1;
        } else if (String(a[columnName]).toLowerCase() > String(b[columnName]).toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

}
