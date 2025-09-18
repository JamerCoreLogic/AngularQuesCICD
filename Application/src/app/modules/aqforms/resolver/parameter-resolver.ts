
import { AQStates, AQParameterService } from '@agenciiq/aqadmin';
import { AQUserInfo } from '@agenciiq/login';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { loadParametersByKey } from 'store/actions/master-table.action';
import { selectFilteredParameterList } from 'store/selectors/master-table.selectors';
// import { Observable } from 'rxjs';
// import { filter, switchMap, take, tap } from 'rxjs/operators';
// import { loadParametersByKey } from 'store/actions/master-table.action';
// import { loadParametersData } from 'store/actions/parameterdata.action';
// import { selectFilteredParameterList } from 'store/selectors/master-table.selectors';
// import { selectFilteredParameterDataList } from 'store/selectors/parameterdata.selectors';

@Injectable({
    providedIn: 'root'
})
export class ParameterResolver {
    constructor(
        private parameter: AQParameterService,
        private _userInfo: AQUserInfo,
        private store: Store
    ) {

    }
    // resolve() {
    //     return this.parameter.getParameterByKey("FORM TYPE", this._userInfo.UserId())
    // }

    resolve(): Observable<any> {
        const parameterAlias = "FORM TYPE";
        const userId = this._userInfo.UserId();

        return this.store.select(selectFilteredParameterList).pipe(
            tap(paramList => {
                if (!paramList || !paramList[parameterAlias]) {
                    this.store.dispatch(loadParametersByKey({ parameterAlias, userId }));
                }
            }),
            filter(paramList => !!paramList && !!paramList[parameterAlias]),
            map(paramList => paramList[parameterAlias]), // return just that alias’ data
            take(1)
        );
    }

}