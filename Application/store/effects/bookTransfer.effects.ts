// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import * as BobActionActions from '../actions/bookTransfer.action';

// import { AQQuotesListService } from '@agenciiq/quotes';
// import { catchError, switchMap, tap } from 'rxjs/operators';
// import { map } from 'highcharts';
// import { of } from 'rxjs';
// import { LoaderService } from 'src/app/shared/utility/loader/loader.service';

// @Injectable()
// export class BOBEffects {
//     constructor(private actions$: Actions,
//         private _quotesService: AQQuotesListService,
//         private loader: LoaderService) { }   

//     loadQuoteList$ = createEffect(() =>
//         this.actions$.pipe(
//             ofType(BobActionActions.loadBobList)yyyyyy
//             switchMap(({ request}) =>
//                 this._quotesService.QuotesViewList(request).pipe(
//                     map(resp => {
//                         // const dataList = resp[0].data.quote?.map(item => item.quote) || [];
//                         const dataList = resp[0].data.quote.length > 0 ? resp[0].data.quote : [];
//                         return BobActionActions.loadBobListSuccess({ bookOfBusinessTransferList: dataList as any });
//                     }),
//                     catchError(error => {
//                         return of(BobActionActions.loadBobListFailure({ error }));
//                     })
//                 )
//             )
//         )
//     );
// }

// kpi.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as BobActionActions from '../actions/bookTransfer.action';
import { AQQuotesListService, LOBService } from '@agenciiq/quotes';
import { AQParameterService } from '@agenciiq/aqadmin';
import { BusinessTransferService } from '@agenciiq/aqbusinesstransfer';

@Injectable()
export class BOBEffects {
    constructor(
        private actions$: Actions,
        private _quotesService: AQQuotesListService,
        private parameterService: AQParameterService,
        private businessTransferService: BusinessTransferService,
        private lobService: LOBService,
    ) { }

    //for BoB List
    loadBobList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BobActionActions.loadBobList),
            switchMap(({ request, enabledForkJoin }) =>
                this._quotesService.QuotesViewList(request, enabledForkJoin).pipe(
                    map((resp) => {
                        const data = resp[0]?.data?.quote || [];
                        const totalItem = enabledForkJoin && resp[1] ? resp[1].totalQuote : 0;
                        return BobActionActions.loadBobListSuccess({ data, totalItem });
                    }),
                    catchError((error) => of(BobActionActions.loadBobListFailure({ error })))
                )
            )
        )
    );

    //for parameter data
    loadParameters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BobActionActions.loadParameters),
            switchMap(({ userId }) =>
                this.parameterService.getParameter('', userId).pipe(
                    map(data => {
                        if (data && data.success && data.message == null) {
                            return BobActionActions.loadParametersSuccess({ parameterdata: data });
                        } else {
                            return BobActionActions.loadParametersFailure({ error: 'Invalid response' });
                        }
                    }),
                    catchError(error =>
                        of(BobActionActions.loadParametersFailure({ error }))
                    )
                )
            )
        )
    );


    //for Agent List
    loadAgents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BobActionActions.loadAgents),
            switchMap(({ userId, agentId }) =>
                this.businessTransferService.GetAgents(userId, agentId).pipe(
                    map(resp => {
                        let agents = resp;


                        return BobActionActions.loadAgentsSuccess({ agents });
                    }),
                    catchError(error => of(BobActionActions.loadAgentsFailure({ error })))
                )
            )
        )
    );

    //for LOB list
    loadLobs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BobActionActions.loadLobList),
            switchMap(({ userId }) =>
                this.lobService.GetLOBList(userId).pipe(
                    map(response => BobActionActions.loadLobListSuccess({ lobs: response.data.lobsList || [] })),
                    catchError(error => of(BobActionActions.loadLobListFailure({ error })))
                )
            )
        )
    );
}