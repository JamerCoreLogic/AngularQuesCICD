import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CarrierActions from '../actions/carrier-list.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AQCarrierService } from '@agenciiq/aqcarrier';

@Injectable()
export class CarrierEffects {
    constructor(private actions$: Actions, private carrierService: AQCarrierService) { }

    loadCarrierList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CarrierActions.loadCarrierList),
            switchMap(({ userId, savedCarrierList }) =>
                this.carrierService.CarrierList(userId).pipe(
                    map(carrierList => {
                        if (carrierList?.success && carrierList?.data?.carrierList) {
                            return CarrierActions.loadCarrierListSuccess({ carrierList: carrierList });
                        } else {
                            return CarrierActions.loadCarrierListFailure({ error: 'No carriers found' });
                        }
                    }),
                    catchError(error => of(CarrierActions.loadCarrierListFailure({ error })))
                )
            )
        )
    );
}
