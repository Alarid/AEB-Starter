/**
 * Created by altran on 26/11/14.
 */

var AUTH = '/auth';

gocApp.factory('UserService', ['$http', '$rootScope', 'AuthenticationService', function($http, $rootScope, AuthenticationService) {
    var userService = {};

    userService.EVENTS = {
        LOGIN_OK : 'user:login.ok',
        LOGIN_KO : 'user:login.ko',
        LOGOUT_OK : 'user:logout.ok',
        LOGOUT_KO : 'user:logout.ko'
    };

    // Get restrictions enum
    var restrictions = null;
    $http.get(AUTH + '/restrictions/enum').success(function(data) {
        restrictions = data;
    }).error(function(error) {
        console.log(error);
    });

    /**
     * Check if the user is logged
     */
    userService.checkAccess = function(callback, cache) {
        $http.get(AUTH, { cache: (cache == null || cache) })
            .success(function(data) {
                callback(data.user);
            })
            .error(function() {
                callback(null);
            });
    }

    /**
     * User login
     */
    userService.login = function(username, password, keepMeLogin, callback) {
        console.log("Logging " + username + " / " + password + "...");
        $http.post(AUTH, { username: username, password: password, keepMeLogin: keepMeLogin })
            .success(function (data) {

                $rootScope.$broadcast(userService.EVENTS.LOGIN_OK, data.user);

                AuthenticationService.setKeepLoggedIn(data.user.keepMeLogin);
                AuthenticationService.storeToken(data.token);

                callback(data.user);
            })
            .error(function () {

                $rootScope.$broadcast(userService.EVENTS.LOGIN_KO);

                // Erase the token if the user fails to log in
                AuthenticationService.deleteToken();
                AuthenticationService.setKeepLoggedIn(false);

                callback(null);
            });
    }

    /**
     * User logout
     */
    userService.logout = function(callback) {

        $http.delete(AUTH)
            .success(function (data) {

                // send a logout success event
                $rootScope.$broadcast(userService.EVENTS.LOGOUT_OK);

                // Erase the token if the user fails to log in
                AuthenticationService.deleteToken();
                AuthenticationService.setKeepLoggedIn(false);

                callback(true);
            })
            .error(function () {

                // send a logout failure event
                $rootScope.$broadcast(userService.EVENTS.LOGOUT_KO);

                callback(false);
            });
    }

    /**
     * Get users
     */
    userService.getUsers = function(success, error) {
        $http.get(AUTH + '/users').success(function(data) {
            success(data);
        }).error(function(data, status, headers, config) {
            error(data);
        });
    }

    /**
     * Get restrictions
     */
    userService.getRestrictions = function(success, error) {
        $http.get(AUTH + '/restrictions').success(function(data) {
            success(data);
        }).error(function(data, status, headers, config) {
            error(data);
        });
    }

    /**
     * New user
     */
    userService.createUser = function(user, success, error) {
        $http.post(AUTH + '/create', user).success(function(data) {
            success(data);
        }).error(function(data, status, headers, config) {
            error(data);
        });
    }

    /**
     * Delete user
     */
    userService.delete = function(user_id, success, error) {
        $http.delete(AUTH + '/' + user_id).success(function(data, status, headers, config) {
            //_debug($log, 'DELETE success', data, status, config);
            success();
        })
        .error(function(data, status, headers, config) {
            if(error) error(data);
        });
    }

    /**
     * Update user
     */
    userService.update = function(user, success, error) {
        $http.post(AUTH + '/update', user).success(function(data) {
            success(data);
        }).error(function(data, status, headers, config) {
            if (error) error(data);
        });
    }

    /**
     * Has right to read
     */
    userService.hasRightToRead = function(user, callback) {
        if (user.restrictions && restrictions) 
            callback((user.restrictions.indexOf(restrictions.read) != -1) || (user.restrictions.indexOf(restrictions.admin) != -1));
        else callback(false);
    }

    /**
     * Restriction check: update
     */
    userService.hasRightToUpdate = function(user, callback) {
        if (user.restrictions && restrictions) 
            callback((user.restrictions.indexOf(restrictions.update) != -1) || (user.restrictions.indexOf(restrictions.admin) != -1));
        else callback(false);   
    }

    /**
     * Restriction check: delete
     */
    userService.hasRightToDelete = function(user, callback) {
        if (user.restrictions && restrictions) 
            callback((user.restrictions.indexOf(restrictions.delete) != -1) || (user.restrictions.indexOf(restrictions.admin) != -1));
        else callback(false);   
    }

    /**
     * Restriction check: write
     */
    userService.hasRightToWrite = function(user, callback) {
        if (user.restrictions && restrictions)
            callback((user.restrictions.indexOf(restrictions.write) != -1) || (user.restrictions.indexOf(restrictions.admin) != -1));
        else callback(false);
    }

    /**
     * Restriction check: admin
     */
    userService.isAdmin = function(user, callback) {
        if (user.restrictions && restrictions) 
            callback(user.restrictions.indexOf(restrictions.admin) != -1);
        else callback(false);   
    }

    /**
     * Change password
     */
    userService.changePassword = function(user, success, error) {
        $http.post(AUTH + '/changePassword', user).success(function(data) {
            success(data);
        }).error(function(data, status, headers, config) {
            if (error) error(data);
        });
    }

    userService.sendNewPassword = function(args, success, error) {
        $http.post(AUTH + '/sendNewPassword', args).success(function() {
            success();
        }).error(function(data, status, headers, config) {
            if (error) error(data);
        });
    }

    return userService;
}])

.factory('AuthenticationService', ['$window', function($window) {
    var service = {};

    service.isLogged = false;

    /**
     *
     * @returns {boolean}
     */
    service.isKeepLoggedIn = function() {
        return this.keepMeLoggedIn = $window.localStorage ? $window.localStorage.keepMeLoggedIn : false;
    }

    /**
     *
     * @param keepMeLoggedIn
     */
    service.setKeepLoggedIn = function(keepMeLoggedIn) {

        if(keepMeLoggedIn && $window.localStorage) {
            $window.localStorage.keepMeLoggedIn = keepMeLoggedIn;
        }
        else if(!keepMeLoggedIn && $window.localStorage && $window.localStorage.keepMeLoggedIn) {
            delete $window.localStorage.keepMeLoggedIn;
        }
    }

    /**
     * Put token in session or local storage
     *
     * @param token
     */
    service.storeToken = function(token) {
        if(this.isKeepLoggedIn()) {
            // persist token in local storage
            $window.localStorage.token = token;
        } else {
            // persist token in session storage
            $window.sessionStorage.token = token;
        }
    }

    /**
     * Get the token in local or session storage
     *
     * @returns {string} The token
     */
    service.getToken = function() {

        var token = '';

        if(this.isKeepLoggedIn() && $window.localStorage && $window.localStorage.token) {
            token = $window.localStorage.token;
        }
        else if(!this.isKeepLoggedIn() && $window.sessionStorage && $window.sessionStorage.token) {
            token = $window.sessionStorage.token;
        }

        return token;
    }

    /**
     * Delete the token in local or session storage
     */
    service.deleteToken = function() {

        if(this.isKeepLoggedIn() && $window.localStorage && $window.localStorage.token) {
            delete $window.localStorage.token;
        }
        else if(!this.isKeepLoggedIn() && $window.sessionStorage && $window.sessionStorage.token) {
            delete $window.sessionStorage.token;
        }
    }

    return service;
}])
;
