angular.module("fmccwebportal").controller("UserRoleController", function ($scope, $http, $rootScope, UserRole) {

    var userRoleTable = angular.element('#userroles').DataTable({
        ajax: {
            url: '/api/userrolemanagement/getuserroles',
            dataSrc: "data"
        },
        language: {
            search: "",
            searchPlaceholder: "Search...",
            paginate: {
                next: "»",
                previous: "«"
            },
        },
        processing: true,
        serverSide: true,
        ordering: false,
        paging: true,
        searching: false,
        pageLength: 10,
        columns: [            
            { data: "Username", title: "User" },
            { data: "Rolename", title: "Role" },
            { data: null, width: '85px', "contentPadding": "0", defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
        ]
    });

    $scope.userRole = {}
    $scope.userRole.Id = 0;
    $scope.userRole.userId = '';
    $scope.userRole.roleId = '';

    var userElm = angular.element("#userrole-user");
    var roleElm = angular.element("#userrole-role");

    userElm.select2({
        placeholder: "Select User"
    });
    roleElm.select2({
        placeholder: "Select Role"
    });

    $scope.setUserRole = function () {
        if (!userElm.val()) {
            alert("Select a user")
            return;
        } else if (!roleElm.val()) {
            alert("Select a Role")
            return;
        }
        else {
            var model = {
                UserId: userElm.val(),
                RoleId: roleElm.val(),
            };
            UserRole.setUserRole(model).then(function (res) {
                if (res.data.okay) {
                    userElm.val("").trigger("change");
                    roleElm.val("").trigger("change");
                    $('#userroles').DataTable().ajax.reload();
                } else {
                    alert(res.data.message);
                }
            });
        }
    };
    $scope.unSetUserRole = function () {
        if (!userElm.val()) {
            alert("Select a user")
            return;
        } else if (!roleElm.val()) {
            alert("Select a Role")
            return;
        }
        else {
            var model = {
                UserId: userElm.val(),
                RoleId: roleElm.val(),
            };
            UserRole.unsetUserRole(model).then(function (res) {
                if (res.data.okay) {
                    $scope.userRole.Id = 0;
                    $scope.userRole.userId = '';
                    $scope.userRole.roleId = '';
                    userElm.val("").trigger("change");
                    roleElm.val("").trigger("change");
                    $('#userroles').DataTable().ajax.reload();
                } else {
                    alert(res.data.message);
                }
            });
        }
    };
    $scope.cancelUserRole = function () {
        $scope.userRole.Id = 0;
        $scope.userRole.userId = '';
        $scope.userRole.roleId = '';
        userElm.val("").trigger("change");
        roleElm.val("").trigger("change");
        userRoleTable.$("tr.selected").removeClass('selected');
        userRoleTable.ajax.reload();
    };

    UserRole.getusers().success(function (res) {
        $scope.users = res.model;
        var data = [];
        for (var i = 0; i < res.model.length; i++) {
            data.push({ id: res.model[i].Id, text: res.model[i].Username })
        }
        userElm.select2({
            data: data,
            placeholder: "Select User"
        });
    });

    UserRole.getroles().success(function (res) {
        $scope.roles = res.model;
        var data = [];
        for (var i = 0; i < res.model.length; i++) {
            data.push({ id: res.model[i].Id, text: res.model[i].Name })
        }
        roleElm.select2({
            data: data,
            placeholder: "Select Role"
        });
    });

    angular.element("#userroles tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = userRoleTable.row(this).data();
        if (e.target.tagName == "BUTTON") {
            var target = $(e.target);
            if (target.hasClass('btn-primary')) {
                target.removeClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.userRole.Id = 0;
                    userElm.val("").trigger("change");
                    roleElm.val("").trigger("change");
                })
            }
            else {
                userRoleTable.$("button").removeClass('btn-primary');
                target.addClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.userRole.Id = 1;
                    $scope.userRole.userId = rowData.Username;
                    $scope.userRole.roleId = rowData.Rolename;
                    userElm.val(rowData.UserId).trigger("change");
                    roleElm.val(rowData.RoleId).trigger("change");
                });
            }
        }
    });
});