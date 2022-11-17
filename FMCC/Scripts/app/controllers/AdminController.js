angular.module("fmccwebportal").controller("adminController", function ($scope, $http) {

    var role = angular.element(".role-form-elem");

    var module = angular.element(".module-form-elem");

    role.select2({
        allowClear: true,
        placeholder: "Select a user role"
    });

    module.select2({
        allowClear: true,
        placeholder: "Select a module"
    });

    $http.get("/api/admin/getrolelist").error(function (res) {
        console.log(res);
    }).success(function (res) {
        if (res.okay) {
            role.select2({
                data: res.model,
                placeholder: "Select a user role"
            });
        } else {
            console.log(res.message);
        }
    });

    $http.get("/api/admin/getmodulelist").error(function (res) {
        console.log(res);
    }).success(function (res) {
        if (res.okay) {
            module.select2({
                data: res.model,
                placeholder: "Select a module"
            });
        } else {
            console.log(res.message);
        }
    });

    $scope.loadMenuItem = function () {
        if (role.val().trim() == "") {
            alert("Please select a role!");
        } else if (module.val().trim() == "") {
            alert("Please select a module!");
        } else {
            var url = "/api/admin/getmenulist?role=" + role.val() + "&moduleId=" + module.val();
            $http.get(url).error(function (res) {
                console.log(res);
            }).success(function (res) {
                if (res.okay) {
                    $scope.menuList = res.model;
                } else {
                    console.log(res.message);
                }
            });
        }
    }

    $scope.SaveMenuItem = function () {
        if ($scope.menuList.length) {
            $scope.menuList.RoleId = role.val();
            $http.post("/api/admin/setmenulist", $scope.menuList).error(function (res) {
                console.log(res);
                role.val("").trigger("change");
                module.val("").trigger("change");
            }).success(function (res) {
                role.val("").trigger("change");
                module.val("").trigger("change");
                if (res.okay) {
                    $scope.menuList = [];
                   
                } else {
                    alert(res.message)
                }
            });
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
    };

});