angular.module("fmccwebportal").controller("RoleController", function ($scope, $rootScope, UserRole) {
    var roleTable = angular.element("#roles").DataTable({
        ajax: {
            url: '/api/userrolemanagement/getroles',
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
            { data: "Name", title: "Role Name" },
            { data: "Description", title: "Description" },
            { data: "ExpirationTime", title: "Expiration Time" },
            { data: null, width: '85px', defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
        ]
    });

    $scope.role = {}
    $scope.role.Id = 0;
    $scope.role.name = '';
    $scope.role.description = '';
    $scope.role.expirationTime = '';

    var activeEl = angular.element("#is-active");

    activeEl.select2({
        placeholder: "Select Status"
    });

    $scope.checkNum = function (evt) {
        if (!evt.target.value) {
            evt.target.value = "";
        }
    }

    $scope.setRole = function (model) {
        if ($scope.role) {
            UserRole.setrole({
                Name: $scope.role.name,
                Description: $scope.role.description,
                ExpirationTime: $scope.role.expirationTime
            }).then(function (res) {

                if (res.data.okay) {
                    $scope.role.name = "";
                    $scope.role.description = "";
                    $scope.role.expirationTime = "";
                    $('#roles').DataTable().ajax.reload();
                } else {
                    alert(res.data.message);
                }
            });
        } else {
            return;
        }
    };

    $scope.updateRole = function (model) {
        if ($scope.role) {
            UserRole.updateRole({
                Id: $scope.role.Id,
                Name: $scope.role.name,
                Description: $scope.role.description,
                ExpirationTime: $scope.role.expirationTime
            }).then(function (res) {
                if (res.data.okay) {
                    $scope.role.Id = 0;
                    $scope.role.name = "";
                    $scope.role.description = "";
                    $scope.role.expirationTime = "";
                    $('#roles').DataTable().ajax.reload();
                } else {
                    alert(res.data.message);
                }
            });
        } else {
            return;
        }
    };

    $scope.deleteRole = function (model) {
        createModal(function (e) {
            if ($scope.role) {
                UserRole.deleteRole({
                    Id: $scope.role.Id
                }).then(function (res) {
                    angular.element(e.target).closest(".modal").remove();
                    if (res.data.okay) {
                        $scope.role.Id = 0;
                        $scope.role.name = "";
                        $scope.role.description = "";
                        $scope.role.expirationTime = "";
                        $('#roles').DataTable().ajax.reload();
                    } else {
                        alert(res.data.message);
                    }
                });
            } else {
                angular.element(e.target).closest(".modal").remove();
            }
        });
    };

    $scope.cancelRole = function () {
        $scope.role.Id = 0;
        $scope.role.name = "";
        $scope.role.description = "";
        $scope.role.expirationTime = "";
        roleTable.$("tr.selected").removeClass('selected');
        roleTable.ajax.reload();
    };
    function isValid(model) {
        var flag = false;
        for (var prop in model) {
            if (model[prop]) {
                flag = model[prop].trim() != "" ? true : flag;
            }
        }
        return flag;
    }

    angular.element("#roles").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = roleTable.row(this).data();
        if (e.target.tagName == "BUTTON") {
            var target = $(e.target);
            if (target.hasClass('btn-primary')) {
                target.removeClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.role.Id = 0;
                    $scope.role.name = '';
                    $scope.role.description = '';
                    $scope.role.expirationTime = '';
                })
            }
            else {
                roleTable.$("button").removeClass('btn-primary');
                target.addClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.role.Id = rowData.Id || 0;
                    $scope.role.name = rowData.Name;
                    $scope.role.description = rowData.Description;
                    $scope.role.expirationTime = rowData.ExpirationTime;
                });
            }
        }
    });
    function createModal(proceed) {
        var modalElm = angular.element(angular.element("#delete-confirmation-template").html())
        angular.element("body").append(modalElm)
        var modal = modalElm.modal({ show: false });
        modal.show();
        modal.find(".proceed-button").on("click", proceed)
        modal.find(".cancel-button").on("click", function (e) {
            modalElm.remove();
        })
    }
});