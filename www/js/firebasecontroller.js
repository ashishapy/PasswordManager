/**
 * Created by ashishpandey on 12/03/15.
 */
'use strict'

angular.module('passwordApp').controller('FirebaseController', FirebaseController);

FirebaseController.$inject = ['$scope', '$state', '$ionicHistory', '$firebaseAuth'];

/* @ngInject */
function FirebaseController($scope, $state, $ionicHistory, $firebaseAuth) {
  /* jshint validthis: true */
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  var fbAuth = $firebaseAuth(fb);

  $scope.login = function (username, password) {
    fbAuth.$authWithPassword({
      email: username,
      password: password
    }).then(function (authData) {
      $state.go('locked');
    }).catch(function (error) {
      console.log('ERROR: ' + error);
    });
  };

  $scope.register = function (username, password) {
    fbAuth.$createUser({email: username, password: password})
      .then(function (userData) {
        return fbAuth.$authWithPassword({
          email: username,
          password: password
        });
      }).then(function (authData) {
        $state.go('createvault');
      }).catch(function (error) {
        console.log('ERROR: ' + error);
      });
  };
}