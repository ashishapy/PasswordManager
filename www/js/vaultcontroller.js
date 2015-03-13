/**
 * Created by ashishpandey on 12/03/15.
 */
'use strict'

angular.module('passwordApp').controller('VaultController', VaultController);

VaultController.$inject = ['$scope', '$state', '$ionicHistory', '$firebaseObject', 'cipherFactory'];

/* @ngInject */
function VaultController($scope, $state, $ionicHistory, $firebaseObject, cipherFactory) {

  $ionicHistory.clearHistory();

  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  })

  var fbAuth = fb.getAuth();
  if (fbAuth) {
    var userReference = fb.child('users/' + fbAuth.uid);
    var synchObject = $firebaseObject(userReference);
    synchObject.$bindTo($scope, 'data');
  } else {
    $state.go('firebase');
  }

  $scope.unlock = function (masterPassword) {
    synchObject.$loaded().then(function () {
      var decipherPhrase = cipherFactory.decrypt($scope.data.masterPassword.cipher_text, masterPassword, $scope.data.masterPassword.salt, $scope.data.masterPassword.iv, {output: "hex"});

      if (decipherPhrase === 'Authenticated'.toHex()) {
        $state.go("categories", {masterPassword: masterPassword});
      }
    });
  }
  
  $scope.create = function (masterPassword) {
    synchObject.$loaded().then(function () {
      userReference.child('masterPassword').set(cipherFactory.encrypt("Authenticated", masterPassword), function(error) {
        $state.go("locked")
      });
    });
  }

  $scope.reset = function () {
    userReference.remove(function (error) {
      if(error){
        console.log('ERROR: ' + error);
      } else {
        $state.go('createvault');
      }
    });
  }
}