angular.module("fmccwebportal").factory("WaterConsumption", function ($http) {
    return {
        Hourly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/waterconsumption/hourly",
            }).then(success, failure);
        },
        Weekly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/waterconsumption/weekly",
            }).then(success, failure);
        },
        ThisMonth: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/waterconsumption/thismonth",
            }).then(success, failure);
        },
        Monthly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/waterconsumption/monthly",
            }).then(success, failure);
        },
        Yearly: function (success, failure) {
            return $http({
                method: "GET",
                url: "/api/waterconsumption/yearly",
            }).then(success, failure);
        }
    }
});