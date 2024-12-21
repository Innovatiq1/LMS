// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://stark-fjord-47564.herokuapp.com/api/',
  // apiUrl: 'https://apis.collegey.com/api/',
  // apiUrl: 'http://beta.api.collegey.com/api/',
  // awsUrl: 'https://collegey.s3.ap-southeast-1.amazonaws.com/',

  awsUrl: 'https://collegey.s3.ap-southeast-1.amazonaws.com/',
  filesPath: 'https://s3.ap-southeast-1.amazonaws.com/storage.collegey/',
  apiUrl: 'http://192.168.1.190:3004/api/',
  Url: 'http://192.168.1.190:3004/',
  companyUrl: 'http://192.168.1.190:3004/',
  publicApiUrl: 'http://192.168.1.190:3004/x-api/v1/public/',


    // apiUrl:'http://13.212.97.97:3001/api/',


  /* * /
  // Localhost server API connection URL
    // apiUrl: 'http://localhost:3000/api/',
  // apiUrl:'http://35.154.206.124:3000/api/',
  apiEndpointNew: 'http://35.154.206.124/x-api/v1/',
  frontEndUrl: 'http://35.154.206.124:4200/',
  apiNewEndpoint: 'http://35.154.206.124/api1/',

  /* */


  /* */
  // Localhost server API connection URL  // http://35.154.206.124:3000/
  // apiUrl: 'http://localhost:3000/api/',
  // apiEndpointNew: 'http://localhost:3000/x-api/v1/',
  // frontEndUrl: 'http://localhost:4300/',
  // apiNewEndpoint: 'http://localhost:3000/api1/',
  /* */

  /* */
  // UAT server API connection URL
  // apiUrl: 'http://3.0.100.217/api/',
  apiEndpointNew: 'http://3.0.100.217/x-api/v1/',
  frontEndUrl: 'http://3.0.100.217/',
  apiNewEndpoint: 'http://3.0.100.217/api1/',
  /* */

  /* * /
  // UAT server API connection URL
  apiUrl: 'https://prodapi.collegey.com/api/',
  apiEndpointNew: 'https://prodapi.collegey.com/x-api/v1/',
  frontEndUrl: 'https://www.collegey.com/',
  apiNewEndpoint: 'https://prodapi.collegey.com/api1/',
  /* */

  /* zoom api url to generating token,for testing*/
 // ZoomUrl:'https://zoom.us/oauth/authorize?client_id=H65uMhcET8KNpbQ8RWvw&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fadmin%2Fcourses%2Fcreate-class'
  ZoomUrl: 'https://zoom.us/oauth/authorize?client_id=LiiBCSVsQzi2MPZIsglZYg&response_type=code&redirect_uri=http%3A%2F%2F192.168.1.190%3A4500%2Fadmin%2Fcourses%2Fcreate-class'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
