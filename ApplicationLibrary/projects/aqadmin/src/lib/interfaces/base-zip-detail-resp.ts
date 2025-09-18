export interface ZipCode {
    Zip5: string;
    City: string;
    State: string;
}

export interface CityStateLookupResponse {
    ZipCode: ZipCode;
}

export interface RootObject {  
    CityStateLookupResponse: CityStateLookupResponse;
}
