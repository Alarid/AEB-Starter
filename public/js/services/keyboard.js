// Keyboard input handler
gocApp.factory('KeyboardService', function() {
    var $doc = angular.element(document);
    var listeners = [];
    var service = {};
    service.KEYS = {
        RIGHT: 39,
        LEFT: 37,
        ENTER: 13,
        S: 83
    };

    service.subscribe = function(key, hasCtrl, callback) {
        listeners.push({
            keyCode: key,
            hasCtrl: hasCtrl,
            callback: callback
        });
    }

    var handler = function(keyEvent) {
        listeners.forEach(function(listener) {
            if(keyEvent.keyCode == listener.keyCode) {
                if((listener.hasCtrl && keyEvent.ctrlKey) || !listener.hasCtrl) {
                    listener.callback();
                }
            }
        });
    };

    $doc.on('keydown', handler);
    /*$scope.$on('$destroy', function() {
        $doc.off('keydown', handler);
    });*/

    return service;
});