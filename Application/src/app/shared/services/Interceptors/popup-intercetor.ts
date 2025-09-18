import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { LoaderService } from '../../utility/loader/loader.service';

@Injectable()
export class PopupIntercerptor implements HttpInterceptor {

    constructor(
        private _loaderService: LoaderService
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* this._loaderService.show(); */
        return next.handle(request).pipe(
            finalize(() => ''
                /* this._loaderService.hide() */
            )
        )
    }
}