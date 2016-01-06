angular.module('cityQuest.authenticationService', [])

.factory('Auth', function ($http, $location, $window) {
  var auth = {};
  auth.signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      console.log('resp: ', resp);
      $window.localStorage.setItem('sessiontoken', resp.data.token);
      $location.path('/');
    });
  };

  auth.signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      console.log('resp.data.token: ', resp.data.token);
      $window.localStorage.setItem('sessiontoken', resp.data.token);
      $location.path('/')
    });
  };

  auth.isAuth = function () {
    return !!$window.localStorage.getItem('sessiontoken');
  };

  auth.signout = function () {
    $window.localStorage.removeItem('sessiontoken');
    $location.path('/signin');
  };

  return auth;
});
