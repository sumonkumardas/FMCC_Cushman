angular.module("fmccwebportal").factory("Alarm", function ($http) {
  return {
    Get: function () {
      return $http({
        method: "GET",
        url: "/service/Alarm/GetBuildingForwardAlarm",
      })
    }
  }
});