/**
 * Created by altran on 25/11/14.
 */

var STATE = {
    LOADING: 'state.loading',
    LOGGED: 'state.logged',
    NOT_LOGGED: 'state.not_logged'
};

gocApp.controller('HomeCtrl', [ '$scope', '$window', 'UserService', function ($scope, $window, UserService) {

    $scope.user = { username: '', password: '', keepMeLogin: false };
    $scope.message = '';
    $scope.STATE = STATE;
    $scope.state = STATE.LOADING;


    /**
     * Check if the user is logged
     */
    UserService.checkAccess(function(user) {
        if(user) {
            $scope.user = user;
            $scope.state = STATE.LOGGED;
        } else {
            $scope.state = STATE.NOT_LOGGED;
        }
    });


    /**
     * Log a user
     */
    $scope.login = function(username, password, keepMeLogin) {
        $scope.state = STATE.LOADING;
        password = $("#inputPassword").val(); // Avoid empty value when filled by browser
        UserService.login(username, password, keepMeLogin, function(user) {

            if(user) {
                $scope.user = user;
                $scope.state = STATE.LOGGED;

            } else {
                $scope.message = "Nom d'utilisateur ou mot de passe incorrect.";
                $scope.state = STATE.NOT_LOGGED;
            }
        });
    }


    /**
     * Event triggered on a user logout
     */
    $scope.$on(UserService.EVENTS.LOGOUT_OK, function (event, data) {
        $scope.user = { username: '', password: '' };
        $scope.state = STATE.NOT_LOGGED;
        $scope.message = '';
    });


    /**
     * Forgotten password modal
     */
    $scope.isPasswordModalVisible = false;
    $scope.passwordModal = {
        show: function() {
            $scope.isPasswordModalVisible = true;
            $scope.successMessage = "";
            $scope.errorMessage = "";
            $scope.username = "";
            $scope.email = "";
        },
        hide: function() {
            $scope.isPasswordModalVisible = false;
        },
        send: function(username, email) {
            // Check if the form is empty
            if (!(username || email)) return;

            // Initialize vars
            $scope.successMessage = "Envoi d'un nouveau mot de passe en cours...";
            $scope.errorMessage = "";
            var args = {};

            // Construct args for user service
            if (username) args['username'] = username;
            if (email) args['email'] = email;

            // Ask user service to send new password to the user
            UserService.sendNewPassword(args, function() {
                $scope.successMessage = "Un nouveau mot de passe vous a été envoyé par mail.";
            }, function(error) {
                $scope.errorMessage = error;
                $scope.successMessage = "";
            });
        }
    };
}]);