import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AQHttpInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = "68a8a0a5-f22f-4ef8-ae1c-81fc23f40faf"; // Replace with your actual API key
    const requestUid = "Johnsmith@stai09.onmicrosoft.com"; // Use UserID or fallback]
    const cloned = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        'X-Request-Uid': requestUid
      }
    });

    return next.handle(cloned);
  }
}
