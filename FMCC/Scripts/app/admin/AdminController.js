/// <reference path="AdminController.js" />
angular
    .module("fmcc")
    .controller("Admin", function ($scope, $rootScope, $http, ready) {

        var nope = function (res) { };
        var roleElm = angular.element(".role-form-elem");
        var moduleElm = angular.element(".module-form-elem");

        roleElm.select2({
            allowClear: true,
            placeholder: "Select Role"
        });
        moduleElm.select2({
            allowClear: true,
            placeholder: "Select Module"
        })

        $http
            .get("/service/admin/getrolelist")
            .then(function (res) {
                var data = res.data
                roleElm.select2({
                    data: res.data,
                    placeholder: "Select Role"
                });
            }, nope);
        $http
            .get("/service/admin/getmodulelist")
            .then(function (res) {
                moduleElm.select2({
                    data: res.data,
                    placeholder: "Select Module"
                });
            }, nope);

        $scope.loadMenuItem = function () {
            if (roleElm.val() && moduleElm.val()) {
                var url = "/service/admin/getmenulist?role=" + roleElm.val() + "&moduleId=" + moduleElm.val();
                $http.get(url)
                .success(function (res) {
                    $scope.menuList = res;
                }).error(nope);
            }
        }

        $scope.SaveMenuItem = function () {
            if ($scope.menuList.length) {
                $scope.menuList.RoleId = roleElm.val();
                $http.post("/service/admin/setmenulist", $scope.menuList)
                .success(function (res) {
                    if (res.okay) {
                        $scope.menuList.forEach(function (item, index) {
                            item.Id = res.model[index].Id;
                        })

                        alert("Permission has been Set.");
                    } else {
                        alert(res.message)
                    }
                }).error(nope);
            }
        }

        $scope.SetChecked = function (item, menuList) {
            if (item.Parent == 0) {
                if (item.IsAuthorized) {
                    menuList.forEach(function (menu) {
                        menu.IsAuthorized = false;
                    });
                } else {
                    menuList.forEach(function (menu) {
                        menu.IsAuthorized = true;
                    });
                }
            } else {
                if (item.IsAuthorized) {
                    item.IsAuthorized = false;
                    var hasSelectedChild = false;
                    menuList.forEach(function (menu) {
                        if (menu.Parent != 0) {
                            hasSelectedChild = menu.IsAuthorized ? true : hasSelectedChild;
                        }
                    });
                    if (hasSelectedChild) {
                        menuList.forEach(function (menu) {
                            if (menu.Parent == 0) {
                                menu.IsAuthorized = true;
                            }
                        });
                    } else {
                        menuList.forEach(function (menu) {
                            if (menu.Parent == 0) {
                                menu.IsAuthorized = false;
                            }
                        });
                    }
                } else {
                    item.IsAuthorized = true;
                    menuList.forEach(function (menu) {
                        if (menu.Parent == 0) {
                            menu.IsAuthorized = true;
                        }
                    });
                }
            }
        }
        $rootScope.show = ready.show;
    });