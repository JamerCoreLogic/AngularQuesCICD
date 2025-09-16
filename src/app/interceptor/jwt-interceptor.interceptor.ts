import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, take, concatMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {
  private maintenanceChecked = false;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('token');
    const isAuthEndpoint = this.isAuthenticationEndpoint(request.url);

    if (jwtToken && !isAuthEndpoint) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
    }

    return next.handle(request).pipe(
      retryWhen(errors => errors.pipe(
        concatMap((error: HttpErrorResponse, index) => {
          if (error.status === 503 && index < 2) {
            return of(error).pipe(delay(3000));
          }
          return throwError(() => error);
        }),
        take(3)
      )),
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.handleMaintenanceCheck(event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (isAuthEndpoint) return throwError(() => error);
        return this.handleErrors(error);
      })
    );
  }

  private handleErrors(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401:
        return this.handleUnauthorizedError();
      case 403:
        return this.handleForbiddenError();
      case 500:
        return this.handleServerError();
      case 503:
        return this.handleServiceUnavailableError();
      default:
        return this.handleGenericError(error);
    }
  }

  private handleUnauthorizedError(): Observable<never> {
    if (!this.isPublicRoute()) {
      this.showSessionExpiredAlert();
    }
    return throwError(() => new Error('Session expired'));
  }

  private handleForbiddenError(): Observable<never> {
    Swal.fire({
      icon: 'error',
      title: 'Forbidden',
      text: 'You are not allowed to access this resource',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    });
    return throwError(() => new Error('Forbidden'));
  }

  private handleServerError(): Observable<never> {
    Swal.fire({
      icon: 'error',
      title: 'Server Error',
      text: 'Something went wrong, Please try again later',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    });
    return throwError(() => new Error('Internal server error'));
  }

  private handleServiceUnavailableError(): Observable<never> {
    if (!this.maintenanceChecked) {
      this.maintenanceChecked = true;
      this.router.navigate(['/maintenance']);
    }
    return throwError(() => new Error('Service unavailable'));
  }

  private handleGenericError(error: HttpErrorResponse): Observable<never> {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    });
    return throwError(() => error);
  }

  // Rest of the helper methods remain the same
  private async showSessionExpiredAlert(): Promise<void> {
    await Swal.fire({
      icon: 'error',
      title: 'Session Expired',
      text: 'Your session has expired, please login again',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    });
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private isPublicRoute(): boolean {
    const publicRoutes = ['/login', '/maintenance', '/register', '/forgot-password', '/change-pass', '/communication'];
    return publicRoutes.includes(this.router.routerState.snapshot.url);
  }

  private isAuthenticationEndpoint(url: string): boolean {
    const authEndpoints = ['/auth/login', '/auth/refresh-token'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }

  private handleMaintenanceCheck(event: HttpResponse<any>): void {
    if (event.status === 200 && event.body?.underMaintenance === true) {
      if (!this.maintenanceChecked) {
        this.maintenanceChecked = true;
        this.showMaintenanceAlert();
      }
    }
  }

  private showMaintenanceAlert(): void {
    Swal.fire({
      icon: 'error',
      title: 'Maintenance',
      text: 'The site is currently down for maintenance. Please try again later',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#ffa022',
    }).then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        this.router.navigate(['/maintenance']);
      }
    });
  }
}