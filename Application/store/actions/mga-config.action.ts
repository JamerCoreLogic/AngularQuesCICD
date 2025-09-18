import { createAction, props } from '@ngrx/store';


// get configration data of MGA Deatils
export const loadMGADetails = createAction(
    '[MGA] Load MGA Details',
    props<{ userId: number }>()
);

export const loadMGADetailsSuccess = createAction(
    '[MGA] Load MGA Details Success',
    props<{ data: any }>() // ideally type this properly
);

export const loadMGADetailsFailure = createAction(
    '[MGA] Load MGA Details Failure',
    props<{ error: any }>()
);