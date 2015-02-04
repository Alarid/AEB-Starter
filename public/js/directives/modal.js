// Modal directive

gocApp.directive('modal', function () {
    return {
        template:
        '<div class="modal fade">' +
            '<div class="modal-dialog" ng-class="type">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '<h4 class="modal-title">{{ title }}</h4>' +
                    '</div>' +
                    '<div class="modal-body" ng-transclude></div>' +
                '</div>' +
            '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {

            scope.type = attrs.type == 'large' ? 'modal-lg' : (attrs.type == 'small' ? 'modal-sm' : '');
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value) {
                $(element).modal(value ? 'show' : 'hide');
            });

            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
})