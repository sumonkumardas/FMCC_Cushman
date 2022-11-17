angular.module("fmccwebportal").factory("newDashboardService", function ($http) {
    return {
        getSites: function (option) {
            return $http.get("/api/newdashboard");
        },
        getBlocks: function (siteId) {
            return $http.get("/api/alertrule/block", { params: { siteId: siteId } });
        },
        getBlockMaps: function (siteId) {
            return $http.get("/api/alertrule/blockMap", { params: { siteId: siteId } });
        },
        getSite: function (siteId) {
            return $http.get("/api/getsitebyid", { params: { siteId: siteId } });
        }
    }
});

