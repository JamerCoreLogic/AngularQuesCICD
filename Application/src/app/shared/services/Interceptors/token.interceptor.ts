import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AQUserInfo } from '@agenciiq/login'
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { error } from 'protractor';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AQLoginService } from '@agenciiq/login';
import { LoaderService } from '../../utility/loader/loader.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(
    private _userInfo: AQUserInfo,
    private _router: Router,
    private _login: AQLoginService,
    private _loaderService: LoaderService
    //private _state:RouterStateSnapshot
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loaderService.show();
    this.totalRequests++;
    if (request.headers.get('token') !== 'no') {

      let token = this._userInfo.getToken();
      if (token) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });

      }


    }

    const apiKey = "68a8a0a5-f22f-4ef8-ae1c-81fc23f40faf"; // Replace with your actual API key
    const requestUid = "Johnsmith@stai09.onmicrosoft.com"; // Use UserID or fallback]

    // request = request.clone({
    //   headers: request.headers
    //     .set('X-Api-key', apiKey)
    //     .set('X-Request-Uid', requestUid)
    // });


    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.decreaseRequests();
        }
        return event;
      }),
      catchError((error) => {
        this.decreaseRequests();
        if (error instanceof HttpErrorResponse) {
          if (error.status == 401) {
            //console.log(error.status);
            if (request.headers.get('refresh') != 'no') {
              this.refreshToken().pipe(
                switchMap(() => {
                  request = this.addNewHeader(request);
                  return next.handle(request);
                }),
                catchError((error: HttpErrorResponse) => {
                  this._router.navigateByUrl('/');
                  return throwError(error);
                })
              ).subscribe(res => { })
              // this._router.navigate(['refresh-token'], { queryParams: { returnUrl: this._state.url }});
            }
          }
        }
        return throwError(error);
      }))

  }

  addNewHeader(request: HttpRequest<any>) {

    let token = this._userInfo.getToken();
    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
      //console.log(request);
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    return request;
  }
  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this._loaderService.hide();
    }
  }


  refreshToken() {
    return this._login.refreshToken().pipe(
      tap(() => {
        //console.log('Token Refreshed!!');
      })
    )
  }


}
