import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { Router, NavigationEnd } from '@angular/router';
import { AQRoleInfo } from '@agenciiq/login';

@Component({
    selector: 'app-aqforms-master',
    templateUrl: './aqforms-master.component.html',
    styleUrls: ['./aqforms-master.component.sass'],
    standalone: false
})
export class AQFormsMasterComponent implements OnInit {

  roleCode: string;
  IsInnerHeader: boolean = false;

  constructor(
    private _loaderService: LoaderService,
    private _roleRoleInfo: AQRoleInfo,
    private _router: Router
  ) {
    _loaderService.hide();
  }

  ngOnInit() {
   this.checkURL();
  }



  checkURL() {
    /*this.roleCode = this._roleRoleInfo.Roles()[0].roleCode;
    if (this.roleCode == 'MGAAdmin' && this._router.url == '/agenciiq/agencies') {
      this.IsInnerHeader = true;
    }

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.roleCode == 'MGAAdmin' && event.url == '/agenciiq/agencies') {
          this.IsInnerHeader = true;
        } else {
          this.IsInnerHeader = false;
        }
      }
    });
    */
  }

}
