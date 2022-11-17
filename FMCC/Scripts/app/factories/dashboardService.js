angular.module("fmccwebportal").factory("dashboardService", function ($http) {
    return {
        get: function (option) {
            return $http.get("/api/dashboard/", {
                params: { siteId: $("#siteId").val()}
            });
        }
    }
});

