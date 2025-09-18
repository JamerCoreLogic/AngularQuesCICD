import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/utility/loader/loader.service';
import { AppSettings } from 'src/app/global-settings/app-setting';
import { AQUserInfo, AQAgentInfo } from '@agenciiq/login';
import { debug } from 'console';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  idToken: String;


  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private _userInfo: AQUserInfo,
    private _agentInfo: AQAgentInfo
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    const Client = {};
    Client['ClientID'] = this.getAgentID();

    let cloned: any;

    if (req['body']) {
      if ('ClientID' in req['body']) {
        req['body']['ClientID'] = Client['ClientID'];
        cloned = req;
      } else {
        cloned = req.clone({
          body: { ...req.body, ...Client }
        });
      }
    }




    return next.handle(cloned).pipe(
      tap(
        this.alert.bind(this),
        this.error.bind(this)
      ),
      finalize(() => {

      })
    );
  }


  alert(httpEvent: HttpEvent<any>): void {
    if (httpEvent instanceof HttpResponse) {
      const httpRes = httpEvent as HttpResponse<any>;
    }
  }

  error(httpEvent: HttpEvent<any>): void {
    if (httpEvent instanceof HttpErrorResponse) {
      const httpErr = httpEvent as HttpErrorResponse;
      if (httpErr.status === 401) {
        sessionStorage.clear();
        this.router.navigate(['/']);
      }
    }
  }

  modifyURL(req: HttpRequest<any>): string {

    if (req.url.includes('api/users/authenticateuser')) {
      return "http://10.130.205.69:9080/api/users/authenticateuser";
    } else if (req.url.includes('api/Agency/GetAgencyList')) {

      return "http://10.130.205.69:9080/api/Agency/GetAgencyList";
    }
  }

  getUserID() {
    return this._userInfo.UserId() ? this._userInfo.UserId() : null;
  }

  getAgentID() {
    return this._agentInfo.AgentId() ? this._agentInfo.AgentId() : 0;
  }

}
