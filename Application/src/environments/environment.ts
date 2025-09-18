// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  multiClient: true,
  StripeKey: 'pk_test_51IWhFoJCHLOATEOGHhhQfZG1yOPVIB8Uz76TqFQhnDyJJlF7I8zpqbPqwCGbjJ00Zlrw1th7wnYTn6d8DxY8si7x004p1asZYT',
  //'pk_test_51HZDEaDEvbqueZryoSqd3eQp0wd9YMT3SxAO9nXhcON3214rgy3pp6uv29VUQ0SWSTQnVKsapxEyzHpZ82gYD8ez00Wqhd6gTf',
  // ClientName: "unitech", // acme or unitech or insur
  // ChatBotToken : "f12ad7bda83847d087c73a351546cf4e",

  //Azure Server
  ClientName: "aqnext",

  //demo Server
  // ClientName: "Demo",

  ClientId: "ac2bfa54-4b4b-4251-8e25-03d3e67177f8",
  TenantId: "5e93fb32-e7aa-46fe-9abc-30374c82eac9",
  RedirectUri: "http://localhost:7700",
  BaseUrl: 'aqnext.azurewebsites.net',
  ApiUrl: 'https://aqnextapi.azurewebsites.net/gateway/gateway/',//'https://demo.agenciiq.net/gateway/gateway/', // 'https://api.acme.com/api' or 'https://api.insur.com/api'
  AppVersion: '1.0.0.20250828', //YYYYMMDD
  formanizer: '1.0.0.20250828',
  Amplify: '0.1.1.0',
  Chatbot: '0.1.1.20250828'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
