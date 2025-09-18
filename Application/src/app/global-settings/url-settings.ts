import { environment } from 'src/environments/environment';

export class ApiUrlSettings {
    static acmeApiUrl: 'https://acmeapi.agenciiq.net';
    static unitedApiUrl: 'https://unitedapi.agenciiq.net';
    static insurApiUrl: 'https://insurapi.agenciiq.net';
    static federalUrl: 'https://federal.agenciiq.net';
    static conveloUrl: 'https://convelo.agenciiq.net';
    static conveloUATUrl: 'http://10.151.0.43';
    static conveloUATApiUrl: 'http://agenciiquat.lambis.com';




    getUrlForAPI() {

        return environment.ApiUrl + '/aqapi' ;

        // if (environment.production) {
        //     let path = window.location.host;
        //     // if (path == 'acme.agenciiq.net' || path == 'united.agenciiq.net' || path == "insur.agenciiq.net"
        //     //     || path == "federal.agenciiq.net" || path == "convelo.agenciiq.net" || path == '10.151.0.43' || path == 'agenciiquat.lambis.com') {
        //     //     return window.location.origin;
        //     // } else if (path.toLowerCase().includes('acme')) {
        //     //     return ApiUrlSettings.acmeApiUrl;
        //     // } else if (path.toLowerCase().includes('united')) {
        //     //     return ApiUrlSettings.unitedApiUrl;
        //     // } else if (path.toLowerCase().includes('insur')) {
        //     //     return ApiUrlSettings.insurApiUrl;
        //     // } else if (path.toLowerCase().includes('federal')) {
        //     //     return ApiUrlSettings.federalUrl;
        //     // } else if (path.toLowerCase().includes('convelo')) {
        //     //     return ApiUrlSettings.conveloUrl;
        //     // } else if (path.toLowerCase().includes('10.151.0.43')) {
        //     //     return ApiUrlSettings.conveloUATUrl;
        //     // }
        //     // else if (path.toLowerCase().includes('agenciiquat.lambis.com')) {
        //     //     return ApiUrlSettings.conveloUATApiUrl;
        //     // }
        //     if (path.toLowerCase() == ("agenciiq.acme.com")) {
        //         return "https://apiv2.acme.com/";
        //     }
        //     else {
        //         return environment.ApiUrl;
        //     }
        // } else {
        //     // Url for localhost
        //     //return 'https://acme.agenciiq.net';
        //     return 'https://demo.agenciiq.net/AQAPI';
        //     //return 'https://localhost:5001'

        //     //return 'http://localhost';
        //     // return 'https://apiv2.conveloins.com';
        //     // return 'http://10.151.0.43';
        // }


    }

    getUrlForFB() {
 return environment.ApiUrl;
}
}












