
import { Injectable } from '@angular/core';
import { AQUserInfo } from '@agenciiq/login';
import { ProgramService } from '@agenciiq/aqadmin';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadMGAPrograms } from 'store/actions/submission.action';
import { selectAllPrograms } from 'store/selectors/submission.selector';
import { filter, switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MGAProgramResolver {
    userId: any = 0;
    programDataMaster;
    constructor(
        private _userInfo: AQUserInfo,
        private _programService: ProgramService,
        private store: Store
    ) {
        this.userId = this._userInfo.UserId();
    }
    // resolve() {
    //     return this._programService.MGAPrograms(this.userId, 1);
    // }

    // resolve(): Observable<any> {
    //     // const userId = '123';   // get from service/session
    //     // const agencyId = 1;

    //     //this.store.dispatch(loadMGAPrograms({ userId: this.userId }));
    //     if (this.userId) {
    //         this.store.select(selectAllPrograms).pipe(take(1)).subscribe(programs => {
    //             if (!programs || programs.length === 0) {
    //                 // STEP 2: If not, dispatch API call
    //                 this.store.dispatch(loadMGAPrograms({ userId: this.userId }));
    //             }
    //         });

    //         return this.store.select(selectAllPrograms).pipe(
    //             filter(programs => !!programs), // wait until store has data
    //             take(1)                         // complete once
    //         );
    //     }
    // }

    resolve(): Observable<any> {
        if (!this.userId) {
            return new Observable(observer => {
                observer.complete();
            });
        }

        // Always return one observable
        return this.store.select(selectAllPrograms).pipe(
            take(1), // check once if already loaded
            switchMap(programs => {
                if (!programs || programs.length === 0) {
                    this.store.dispatch(loadMGAPrograms({ userId: this.userId }));
                }

                // wait until store actually has programs
                return this.store.select(selectAllPrograms).pipe(
                    filter(p => !!p && p.length > 0),
                    take(1)
                );
            })
        );
    }
}   