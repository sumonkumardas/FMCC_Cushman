angular.module("fmccwebportal").factory("PermissionService", function ($http) {
    return {
        Get: function () {
            return $http({
                method: "GET",
                url: "/service/Alarm/GetBuildingForwardAlarm",
            })
        }
    }
});