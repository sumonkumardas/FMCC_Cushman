angular.module("fmcc").controller("body", function ($scope, $rootScope, $http, DashboardMenu) {
    var dashboard = {};
    dashboard.menu = {};
    dashboard.menu.form = false;
    dashboard.menu.create = function (e) {
        e.stopPropagation();
        if (!dashboard.menu.form) {
            dashboard.menu.form = true;
            var elm = angular.element(this);
            var parent = elm.closest("li.treeview");
            var container = parent.find(".treeview-menu");
            var submenu = angular.element("#menu-item").html();

            submenu = angular.element(submenu);
            container.append(submenu).slideDown();
            submenu.find("button.btn-save").bind("click", dashboard.menu.update);
            submenu.find("button.btn-cancel").bind("click", dashboard.menu.cancel);
        }
    };
    dashboard.menu.update = function (e) {
        e.stopPropagation();
        var name = angular.element(e.target).closest("li").find("input").val();
        if (name) {
            DashboardMenu.Post({
                user: 1,
                name: name,
                order: angular.element(e.target).closest("ul").children().length
            }, function (res) {
                var container = angular.element("li.my-dashboard").find(".treeview-menu");
                var li = angular.element("<li><a href='#!/chart" + res.data.url + "'><i class='fa fa-circle-o'></i>" + res.data.text + "</a></li>");
                container.append(li);
                angular.element(e.target).closest("li").slideUp(function () {
                    angular.element(this).remove();
                    dashboard.menu.form = false;
                });
            }, function (res) {
                alert("error");
            });
        } else {
            alert("Enter Dashboard Name.")
        }
    };
    dashboard.menu.cancel = function (e) {
        e.stopPropagation();
        angular.element(e.target).closest("li").slideUp(function () {
            angular.element(this).remove();
            dashboard.menu.form = false;
        });
    };

    angular.element(".sidebar").on("click", ".sidebar-menu .my-dashboard .pull-right-container > .fa.fa-plus", dashboard.menu.create);
    DashboardMenu.Get({}, function (res) {
        var json = res.data;
        var container = angular.element("li.my-dashboard").find(".treeview-menu");
        container.html("");
        json.forEach(function (menu) {
            var li = angular.element("<li><a href='#!/chart" + menu.url + "'><i class='fa fa-circle-o'></i>" + menu.text + "</a></li>");
            container.append(li);
        })
    }, function (res) {
        alert("error")
    })
    $http.get("/account/GetUserRolePermissions").then(function (res) {
        $scope.Permission = res.data.split(',');
    }, function (res) {
        alert("error")
    });
    $rootScope.show = false;
});



