angular.module("fmccwebportal").factory("PowerConsumption", function ($http) {
    return {
        Hourly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/powerconsumption/hourly",
            }).then(success, failure);
        },
        Weekly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/powerconsumption/weekly",
            }).then(success, failure);
        },
        ThisMonth: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/powerconsumption/thismonth",
            }).then(success, failure);
        },
        Monthly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/powerconsumption/monthly",
            }).then(success, failure);
        },
        Yearly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/powerconsumption/yearly",
            }).then(success, failure);
        }
    }
});