import { Router } from '@angular/router';
import { AQLogoutService, AQUserInfo } from '@agenciiq/login';
import { Injectable, NgZone } from '@angular/core';

const MINUTES_UNITL_AUTO_LOGOUT = 30 // in Minutes
const CHECK_INTERVALL = 1000 // in ms
const STORE_KEY = 'lastAction';

@Injectable({
    providedIn:'root'
})

export class AutoLogoutService {

  constructor(
    private auth: AQLogoutService,
    private router: Router,
    private ngZone: NgZone,
    private userInfo:AQUserInfo
  ) {
    this.check();
    this.initListener();
    this.initInterval();
  }

  get lastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
  set lastAction(value) {
    localStorage.setItem(STORE_KEY, value.toString());
  }

  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
      document.body.addEventListener('mouseover', () => this.reset());
      document.body.addEventListener('keypress', () => this.reset());
    });
  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVALL);
    })
  }

  reset() {
    this.lastAction = new Date().getTime();
  }

  check() {      
    const now = new Date().getTime();
    const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;       
    this.ngZone.run(() => {        
      if (isTimeout && this.userInfo.UserId()) {             
        this.auth.Logout();
        this.router.navigate(['/']);
      }
    });
  }
}