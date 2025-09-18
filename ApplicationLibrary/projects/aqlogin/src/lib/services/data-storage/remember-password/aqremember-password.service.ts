import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AQRememberPassword {

  constructor() { }

  getRememberPassword(userName: string): string {
    let password = localStorage.getItem(userName);
    return password ? password : null;
  }

  getSavedUserByUserName(userName: string) {
    let savedUserList: any[] = [];
    let savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
      savedUserList = JSON.parse(savedUser);
    }
    if (savedUserList && savedUserList.length) {
      return savedUserList.filter(user => String(user.userName).toLowerCase() == userName.toLowerCase())[0];
    }
  }

  getLastSavedUser() {
    let savedUserList: any[] = [];
    let savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
      savedUserList = JSON.parse(savedUser);
    }
    if(savedUserList && savedUserList.length) {
      const savedUser = savedUserList.filter(user => user['latestLogin'] == true);
      if(savedUser.length){
        return savedUser[0];
      } else {
        return savedUserList[savedUserList.length - 1]
      }
    }
  }
}
