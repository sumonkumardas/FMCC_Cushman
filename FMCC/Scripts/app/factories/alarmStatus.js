angular.module("fmccwebportal").factory("AlarmStatus", function ($http) {
    return {
        total: $http({
            method: "GET",
            url: "/api/block",
        }),
        query: function (id) {

        }
    }
});