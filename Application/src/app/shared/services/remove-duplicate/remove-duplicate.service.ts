import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RemoveDuplicateService {

  constructor() { }
  removeDuplicates(key, arr: any[]) {
    let newArray = [];
    let uniqueObject = {};
    for (let i in arr) {
      let keytitle = arr[i][key];
      uniqueObject[keytitle] = arr[i];
    }
    for (let i in uniqueObject) {
      newArray.push(uniqueObject[i]);
    }
    return newArray;
  }
}
