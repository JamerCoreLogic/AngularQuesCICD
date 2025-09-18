
import { AQStates, AQParameterService } from '@agenciiq/aqadmin';
import { AQUserInfo } from '@agenciiq/login';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { loadFormTypes } from 'store/actions/other-screen.action';
import { selectFormTypes, selectFormTypesLoaded } from 'store/selectors/other-screen.selector';

@Injectable({
    providedIn: 'root'
})
export class ParameterResolver {
    constructor(
        private parameter: AQParameterService,
        private _userInfo: AQUserInfo,
        private store: Store,
    ) {

    }
    // resolve() {
    //     debugger
    //     return this.parameter.getParameterByKey("FORM TYPE", this._userInfo.UserId())
    // }

    resolve() {
        const userId = this._userInfo.UserId();

        return this.store.select(selectFormTypes).pipe(
            first(), // only check once
            switchMap(formTypes => {
                if (!formTypes || !formTypes.success) {
                    // if not available or success=false, call API
                    this.store.dispatch(loadFormTypes({ userId }));

                    return this.store.select(selectFormTypes).pipe(
                        filter(resp => !!resp && resp.success), // wait until success=true
                        first()
                    );
                } else {
                    // already have valid data in store
                    return of(formTypes);
                }
            })
        );
    }
}