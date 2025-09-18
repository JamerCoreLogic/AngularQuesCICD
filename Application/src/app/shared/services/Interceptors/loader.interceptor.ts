import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoaderService } from "../../utility/loader/loader.service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.loaderService.show();

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.decrease();
          }
        },
        error: () => this.decrease()
      })
    );
  }

  private decrease() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this.loaderService.hide();
    }
  }
}