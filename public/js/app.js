'use strict';

var gocApp = angular.module('gocApp', ['ngRoute', 'ngResource', 'ui.bootstrap'])

// Routes config
.config(function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: '/partials/home.html',
            controller: 'HomeCtrl',
            shortName: 'home', // used to display active menu item
            requiredLogin: false
        }).
        otherwise({
            redirectTo: '/home'
        });
})

// Route changing rules
.run(function($rootScope, $location, AuthenticationService) {
    // Start changing route
    $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
        // If the new route requires to be logged and the user is not logged
        if (nextRoute.requiredLogin && !AuthenticationService.isLogged) {
            // Go back to the home page for authentification
            $location.path("/home");
        }
    });

    // Route changed successfully 
    $rootScope.$on('$routeChangeSuccess', function(event, newRoute) {
        //TODO sauvegarder le path courant (newRoute.originalPath) pour initialiser l'interface au demarrage
    });
})
;