angular.module("fmccwebportal").factory("BuildingForwardAlarm", function ($http) {
  return {
    GetBuildings: function (option) {
      $http({
        method: "GET",
        url: "/service/alarm/getbuildings",
        success: option.success,
        failure: option.failure
      })
    },
    GetAlarmStatuses: function () {

    },
    SetBuildingForwardAlarm: function () {
      $http({
        method: "GET",
        url: "/service/Alarm/GetBuildingForwardAlarm",
      })
    },
    GetBuildingForwardAlarms: function () {
      $http({
        method: "GET",
        url: "/service/Alarm/GetBuildingForwardAlarm",
      })
    },
  }
});