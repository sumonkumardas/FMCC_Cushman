angular.module("fmcc")
  .controller("Dashboard", function ($scope, $rootScope, Dashboard,ready) {
      $scope.power = 0;
      $scope.water = 0;
      $scope.blocks = [];
      Dashboard.Get({
          success: function (res) {
              var dashboard = res.data;
              $scope.water = dashboard.WaterAvg.toFixed(0);
              $scope.power = dashboard.PowerAvg.toFixed(0);
              $scope.blocks = dashboard.Blocks;
          }
      });
      $rootScope.show = ready.show;
  });