angular
    .module("directives", ["ngAnimate"])
    .directive("uiSelect", function ($q, $http) {
        return {
            restrict: "A",
            //templateUrl: function () {
            //},
            link: function (scope, element, attributes, ctroller) {
                var elmHeight = element.height() + 14;
                element.addClass("form-control");
                var promise = $http.get("api/dashboardmenu/getall").then(function (res) {
                    if (res.data.okay) {
                        return res.data;
                    }
                });
                promise.then(function (res) {
                    var name = scope.uiSelect;
                    var data = res.model;
                    var count = res.model.length;

                    var wrapper = angular.element("<div class=\"ui-select\"></div>");

                    var listOption = angular.element("<ul class=\"list-option\"></ul>");
                    for (var i = 0; i < count; i++) {
                        var li = angular.element("<li class=\"ui-select-list-item\">" + data[i].text + "</li>");
                        listOption.append(li);
                    }
                    var listContainer = angular.element("<div class=\"list-container\"></div>");
                    listContainer.height(10 * 32);
                    listOption.height(10 * 32);
                    listContainer.append(listOption);


                    wrapper = element.wrap(wrapper).parent();
                    wrapper.css("height", elmHeight + "px");
                    wrapper.append("<span class=\"down-icon\"><i class=\"fa fa-angle-down\"></i></span>");
                    wrapper.append(listContainer);
                });
            }
        }
    })