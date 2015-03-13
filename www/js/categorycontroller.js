/**
 * Created by ashishpandey on 12/03/15.
 */
'use strict'

angular.module('passwordApp').controller('CategoryController', CategoryController);

CategoryController.$inject = ['$scope', '$ionicPopup', '$firebaseObject', '$stateParams', 'cipherFactory'];

/* @ngInject */
function CategoryController($scope, $ionicPopup, $firebaseObject, $stateParams, cipherFactory) {

  $scope.masterPassword = $stateParams.masterPassword;
  $scope.categories = [];

  var fbAuth = fb.getAuth();
  if (fbAuth) {
    var categoriesReference = fb.child('users/' + fbAuth.uid);
    var syncObject = $firebaseObject(categoriesReference);
    syncObject.$bindTo($scope, 'data');
  } else {
    $state.go('firebase')
  }

  $scope.list = function () {
    syncObject.$loaded().then(function () {
      for (var key in $scope.data.categories) {
        if ($scope.data.categories.hasOwnProperty(key)) {
          $scope.categories.push({
            id: key,
            category: cipherFactory.decrypt($scope.data.categories[key].category.cipher_text, $stateParams.masterPassword, $scope.data.categories[key].category.salt, $scope.data.categories[key].category.iv)
          });
        }
      }
    });
  }

  $scope.add = function () {
    syncObject.$loaded().then(function () {
      $ionicPopup.prompt({
        title: 'Enter a new category',
        inputType: 'text'
      })
        .then(function (result) {
          if (result !== undefined) {
            if ($scope.data.categories === undefined) {
              $scope.data.categories = {};
            }
            if ($scope.data.categories[result.toSHA1()] === undefined) {
              $scope.data.categories[result.toSHA1()] = {
                category: cipherFactory.encrypt(result, $stateParams.masterPassword),
                passwords: {}
              };
              $scope.categories.push({
                id: result.toSHA1(),
                category: result
              });
            }
          } else {
            console.log('Action not completed');
          }
        });
    });
  };
}