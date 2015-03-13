// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var fb = new Firebase('https://glaring-inferno-8114.firebaseio.com/');

angular.module('passwordApp', ['ionic', 'firebase'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    document.addEventListener("resume", function () {
      $state.go("locked", {}, {location: "replace"});
    }, false);
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('locked', {
        url: '/locked',
        templateUrl: 'templates/locked.html',
        controller: 'VaultController as vm',
        cache: false
      })
      .state('createvault', {
        url: '/createvault',
        templateUrl: 'templates/create_vault.html',
        controller: 'VaultController'
      })
      .state('firebase', {
        url: '/firebase',
        templateUrl: 'templates/firebase.html',
        controller: 'FirebaseController'
      })
      .state('categories', {
        url: '/categories/:masterPassword',
        templateUrl: 'templates/categories.html',
        controller: 'CategoryController'
      })
      .state('passwords', {
        url: '/passwords/:categoryId/:masterPassword',
        templateUrl: 'templates/password_list.html',
        controller: 'PasswordController',
        cache: false
      })
      .state('newpassword', {
        url: '/newpassword/:categoryId/:masterPassword',
        templateUrl: 'templates/password_new.html',
        controller: 'PasswordController'
      })
      .state('viewpassword', {
        url: '/viewpassword/:categoryId/:masterPassword/:passwordId',
        templateUrl: 'templates/password_view.html',
        controller: 'PasswordController'
      });

    $urlRouterProvider.otherwise('/locked');
  });