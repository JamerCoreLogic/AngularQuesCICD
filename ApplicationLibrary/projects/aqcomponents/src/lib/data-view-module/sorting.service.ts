import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() { }

  SortData(columnName, order:boolean, datasource: any[]) {
    let tempDB;
    if (order) {
      tempDB = datasource.sort((a, b) => {
        if (String(a[columnName]).toLowerCase() < String(b[columnName]).toLowerCase()) {
          return -1
        } else if (String(a[columnName]).toLowerCase() > String(b[columnName]).toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else {
      tempDB = datasource.sort((a, b) => {
        if (String(a[columnName]).toLowerCase() < String(b[columnName]).toLowerCase()) {
          return 1;
        } else if (String(a[columnName]).toLowerCase() > String(b[columnName]).toLowerCase()) {
          return  -1;
        }
        return 0;
      });
    }    
    return tempDB;

  }
}
