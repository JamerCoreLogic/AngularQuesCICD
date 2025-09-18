import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  filterData(DataSource: any[], ColumnList: any[], filterValue:string) {
    return DataSource.filter(item => {
      return ColumnList.some(key => {
        return String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
      })
    })
  }

}
