import { Injector, Type, InjectionToken, InjectFlags } from '@angular/core';

export class DialogInjector implements Injector {
    constructor(
        private _parentInjector: Injector,
        private _additionalToken: WeakMap<any, any>
    ){

    }

    get<T>(
        token:Type<any> | InjectionToken<T>,
        notFoundValue?: T,
        flags?: InjectFlags
    ): T
    get(token:any, notFoundValue?:any)
    get(token:any, notFoundValue?:any, flags?:any){
        const value =   this._additionalToken.get(token);
        if(value){
            return value;
        }
        return this._parentInjector.get<any>(token, notFoundValue);
    }
}
