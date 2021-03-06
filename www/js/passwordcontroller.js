/**
 * Created by ashishpandey on 12/03/15.
 */
'use strict'

angular.module('passwordApp').controller('PasswordController', PasswordController);

PasswordController.$inject = ['$scope', '$stateParams', '$firebaseObject', '$state', 'cipherFactory', '$ionicHistory'];

/* @ngInject */
function PasswordController($scope, $stateParams, $firebaseObject, $state, cipherFactory, $ionicHistory) {

  $scope.masterPassword = $stateParams.masterPassword;
  $scope.categoryId = $stateParams.categoryId;
  $scope.passwords = [];

  var fbAuth = fb.getAuth();
  if(fbAuth) {
    var categoryReference = fb.child("users/" + fbAuth.uid + "/categories/" + $stateParams.categoryId);
    var passwordsReference = fb.child("users/" + fbAuth.uid + "/categories/" + $stateParams.categoryId + "/passwords");
    var syncObject = $firebaseObject(categoryReference);
    syncObject.$bindTo($scope, "data");
  } else {
    $state.go("firebase");
  }

  $scope.list = function() {
    syncObject.$loaded().then(function() {
      var encryptedPasswords = $scope.data.passwords;
      for(var key in encryptedPasswords) {
        if(encryptedPasswords.hasOwnProperty(key)) {
          $scope.passwords.push({
            id: key,
            password: JSON.parse(cipherFactory.decrypt(encryptedPasswords[key].cipher_text, $stateParams.masterPassword, encryptedPasswords[key].salt, encryptedPasswords[key].iv))
          });
        }
      }
    });
  }

  $scope.view = function() {
    syncObject.$loaded().then(function() {
      var encryptedPassword = $scope.data.passwords[$stateParams.passwordId];
      $scope.password = JSON.parse(cipherFactory.decrypt(encryptedPassword.cipher_text, $stateParams.masterPassword, encryptedPassword.salt, encryptedPassword.iv));
    });
  }

  $scope.save = function(title, username, password) {
    var passwordObject = {
      title: title,
      username: username,
      password: password
    };
    //syncObject.$loaded().then(function() {
      passwordsReference.child(JSON.stringify(passwordObject).toSHA1()).set(cipherFactory.encrypt(JSON.stringify(passwordObject), $stateParams.masterPassword), function(ref) {
        $state.go("passwords", $stateParams);
      });
    //});
  }

  $scope.back = function() {
    $ionicHistory.goBack();
  }
}