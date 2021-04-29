module.exports = angular.module('myServers')
// .service('authInterceptor', function($q) {
//     var service = this;

//     service.responseError = function(response) {
//         console.log(response);
//         if (response.status == 401){
           
//            // window.location = "/login";
//         }
//         return $q.reject(response);
//     };
// })
.config(['$httpProvider',function($httpProvider){

  $httpProvider.defaults.headers.post = {  
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Request-With' : null
   }; 
   $httpProvider.defaults.headers.get = {  
       'Content-Type': 'application/x-www-form-urlencoded',
       'X-Request-With' : null
   };

  
  //   $httpProvider.interceptors.push(function($q) {
  //   return {
  //    'request': function(config) {
  //       return config;
  //        // same as above
  //     },

  //     'response': function(response) {
  //       return response;
  //        // same as above
  //     },
  //     'responseError': function(rejection) {
  //       // do something on error
  //       // if (canRecover(rejection)) {
  //       //   return responseOrNewPromise
  //       // }
  //       return $q.reject(rejection);
  //     }
  //   };
  // });
}]);