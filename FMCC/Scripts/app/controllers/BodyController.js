angular.module("fmccwebportal").controller("body", function ($scope, $http, $window, DashboardMenu) {
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
                name: name,
                order: angular.element(e.target).closest("ul").children().length
            }, function (res) {
                if (res.data) {
                    var container = angular.element("li.my-dashboard").find(".treeview-menu");
                    var li = angular.element("<li><a class='clearfix' href='#/mydashboard" + res.data.url + "'><i class='fa fa-circle-o pull-left'></i><span class='pull-left'>" + res.data.text + "</span><i data-menuid=" + res.data.Id + " class='fa fa-trash-o pull-right'></i></a></li>");
                    li.find("i.pull-right").bind("click", removeMenu);
                    container.append(li);
                    angular.element(e.target).closest("li").slideUp(function () {
                        angular.element(this).remove();
                        dashboard.menu.form = false;
                    });
                } else {
                    angular.element(e.target).closest("li").find("input").val("");
                }
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
    angular.element(".treeview-menu li a").bind("click", removeMenu);
    function removeMenu(e) {
        var target = angular.element(e.target);
        var remove = target.hasClass("fa-trash-o");
        if (remove) {
            var data = target.data();
            createModal(function (e) {
                $http.post("/api/dashboardmenu/remove", { Id: data.menuid }).then(function (res) {
                    angular.element(e.target).closest(".modal").remove();
                    if (res.data.okay) {
                        target.closest("li").remove();
                    }
                }, function () {
                    angular.element(e.target).closest(".modal").remove();
                });
            });
        }
    }
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