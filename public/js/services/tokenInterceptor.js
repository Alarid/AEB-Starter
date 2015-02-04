// Token request interceptor

gocApp.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + AuthenticationService.getToken();
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set AuthenticationService.isLogged to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && !AuthenticationService.isLogged) {
                AuthenticationService.isLogged = true;
            }

            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && AuthenticationService.isLogged) {
                AuthenticationService.deleteToken();
                AuthenticationService.isLogged = false;
                $location.path("/home");
            }

            return $q.reject(rejection);
        }
    };
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});