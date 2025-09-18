import { createAction, props } from "@ngrx/store";

export const loadAccountDetails = createAction(
    '[AccountDetails] Load Account Details',
    props<{
    Address1: string,
    Address2: string,
    City: string,
    State: string,
    Zip5: number,
    Zip4: number
}>()
);

export const loadAccountDetailsSuccess = createAction(
    '[AccountDetails] Load Account Details Success',
    props<{ accountDetails: any[]; }>()
);

export const loadAccountDetailsFailure = createAction(
    '[AccountDetails] Load Account Details Failure',
    props<{ error: any }>()
);
