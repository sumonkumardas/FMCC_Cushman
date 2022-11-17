var commonDateFormat = 'YYYY-MM-DD hh:mm A';
var commonDateOnlyFormat = 'DD/MM/YYYY';
var powerComsumptionUnit = 'kw';
var waterConsumptionUnit = 'm3';

angular
    .module("fmccwebportal", ["ngRoute"])
    .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
        $routeProvider
            .when("/amrpowerconsumption", {
                controller: "amrpowerConsumptionCtrl",
                templateUrl: "/templates/armpowerconsumption.html"
            })
            .when("/amrpowerconsumption/:tensionName", {
                controller: "amrpowerConsumptionCtrl",
                templateUrl: "/templates/armpowerconsumption.html"
            })
            .when("/amrpowerconsumptionblockview/:blockId/:blockName/:lastFromDate/:lastToDate/:prevFromDate/:prevToDate", {
                controller: "amrpowerConsumptionblockviewCtrl",
                templateUrl: "/templates/armpowerconsumptionblockview.html"
            })
            .when("/amrpowerconsumptionblockview/:blockId/:blockName", {
                controller: "amrpowerConsumptionblockviewCtrl",
                templateUrl: "/templates/armpowerconsumptionblockview.html"
            })
            .when("/amrpowerconsumptionblockview/:blockId", {
                controller: "amrpowerConsumptionblockviewCtrl",
                templateUrl: "/templates/armpowerconsumptionblockview.html"
            })
            .when("/amrbill", {
                controller: "amrbillCtrl",
                templateUrl: "/templates/armbill.html"
            })
            .when("/amrbill/:tensionName", {
                controller: "amrbillCtrl",
                templateUrl: "/templates/armbill.html"
            })
            .when("/amrbillblockview/:blockId/:blockName/:lastFromDate/:lastToDate/:prevFromDate/:prevToDate", {
                controller: "amrbillblockviewCtrl",
                templateUrl: "/templates/armbillblockview.html"
            })
            .when("/amremission/:tensionName", {
                controller: "amremissionCtrl",
                templateUrl: "/templates/armco2.html"
            })
            .when("/amremissionblockview/:blockId/:blockName/:lastFromDate/:lastToDate/:prevFromDate/:prevToDate", {
                controller: "amremissionblockviewCtrl",
                templateUrl: "/templates/armco2blockview.html"
            })
            .when("/amrbillblockview/:blockId/:blockName", {
                controller: "amrbillblockviewCtrl",
                templateUrl: "/templates/armbillblockview.html"
            })
            .when("/amrbillblockview/:blockId", {
                controller: "amrbillblockviewCtrl",
                templateUrl: "/templates/armbillblockview.html"
            })
           .when("/newdashboard", {
               controller: "newDashboardController",
               templateUrl: "/templates/newDashboard.html"
           })
           .when("/powerbi/view1", {
               templateUrl: "/templates/powerbiView1.html"
           })
           .when("/powerbi/view2", {
               templateUrl: "/templates/powerbiView2.html"
           })
           .when("/powerbi/view3", {
               templateUrl: "/templates/powerbiView3.html"
           })
           .when("/dashboard", {
               controller: "newDashboardController",
               templateUrl: "/templates/mydashboard.html"
           })
           .when("/amrpowerconsumptiondetailview/:blockId/:blockName", {
               controller: "amrpowerConsumptiondetailviewCtrl",
               templateUrl: "/templates/amrpowerconsumptiondetailview.html"
           })
          .otherwise("/dashboard");
    }])
    .factory("PopupService", function () {
        var modal = angular.element(".modal").modal();
        if (modal) {
            modal = angular.element(angular.element("modaltemplate").html()).modal();
        }
        return {
            modal: modal
        }
    })
    .run(["$rootScope", "$templateCache", function ($rootScope, $templateCache) {
        $rootScope.$on("$routeChangeStart", function (routeChangeEvent, nextRoute, currentRoute) {
            var permissions = permission.split(",");
            if (permissions.indexOf("Administrator") < 0) {
                switch (nextRoute.controller) {
                    case "adminController":
                        if (permissions.indexOf("AdminPermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "Setup":
                        if (permissions.indexOf("ObjectDataFiledSetupRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "objectUnitMappingController":
                        if (permissions.indexOf("ObjectUnitMappingRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "AlarmSetup":
                        if (permissions.indexOf("SettingsPermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "AlarmList":
                        if (permissions.indexOf("ListViewPermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "Widget":
                        if (permissions.indexOf("MyDashboardRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    case "analyticsController":
                        if (permissions.indexOf("AnalyticsRolePermission") < 0) {
                            routeChangeEvent.preventDefault();
                        }
                        break;
                    default:
                        break;
                }
            }
        });


    }]);



$.ajax({
    url: '/api/alarm/loaddateformat', success: function (result) {
        if (result) {
            commonDateFormat = result;
        }
    }
});
$.ajax({
    url: '/api/reading/OverallPowerConsumption', success: function (result) {
        if (result) {
            powerComsumptionUnit = result;
        }
    }
});
$.ajax({
    url: '/api/reading/OverallWaterConsumption', success: function (result) {
        if (result) {
            waterConsumptionUnit = result;
        }
    }
});


