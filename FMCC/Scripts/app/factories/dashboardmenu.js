angular.module("fmccwebportal").factory("DashboardMenu", function ($http) {
    return {
        Get: function (option, success, failure) {
            return $http({
                method: "GET",
                url: "/api/dashboardmenu",
            }).then(success, failure);
        },
        Post: function (option, success, failure) {
            return $http({
                method: "POST",
                url: "/api/dashboardmenu?name=" + option.name + "&order=" + option.order,
            }).then(success, failure);
        }
    }
});