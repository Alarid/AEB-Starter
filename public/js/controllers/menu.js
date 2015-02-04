/**
 * Created by altran on 10/12/14.
 */

gocApp.controller('MenuCtrl', ['$rootScope', '$scope', '$window', 'UserService', function($rootScope, $scope, $window, UserService) {

    $scope.isLogged = false;
    $scope.username = '';
    $scope.currentItem = 'home';
    $scope.isAdmin = false;
    $scope.hasUpdateRight = false;
    $scope.hasReadRight = false;
    $scope.hasWriteRight = false;

    /**
     * Events
     */
    $scope.$on(UserService.EVENTS.LOGIN_OK, function (event, data) {
        $scope.isLogged = true;
        $scope.username = data.username;
        $scope.updateUserRights();
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        $scope.currentItem = current.shortName;
    });

    
    /**
     * Check user rights
     */
    $scope.updateUserRights = function() {
        UserService.checkAccess(function(user) {

            if(user) {
                $scope.isLogged = true;
                $scope.username = user.username;

                // Check read right 
                UserService.hasRightToRead(user, function(hasReadRight) {
                    $scope.hasReadRight = hasReadRight;
                });

                // Check admin right
                UserService.isAdmin(user, function(isAdmin) {
                    $scope.isAdmin = isAdmin;
                });

                // Check update right
                UserService.hasRightToUpdate(user, function(hasUpdateRight) {
                    $scope.hasUpdateRight = hasUpdateRight;
                });

                // Check write right
                UserService.hasRightToWrite(user, function(hasWriteRight) {
                    $scope.hasWriteRight = hasWriteRight;
                });
            } else {
                $scope.isLogged = false;
            }
        });
    }
    $scope.updateUserRights();
    
    
    /**
     * Logout a user
     */
    $scope.logout = function() {

        UserService.logout(function(result) {
            $scope.checkAccess = false;
            $window.location.href = '/';
        });
    }
}]);