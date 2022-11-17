angular
    .module("fmccwebportal")
    .controller("alertAveragingSetupController", function ($scope, $http, $rootScope) {
        $scope.form = {};
        $scope.form.mode = {};
        $scope.form.mode.edit = false;

        var formElm = {
            Id: $("#alertAverageSetupId"),
            Minute: $("#alertAverageMinute")
        };

        $http.post("/api/alertaverage/getalertaverage", {}).then(function (res) {

                formElm.Minute.val(res.data.model.Minute);
        });

        $scope.validateAlertAverageSetupForm = function () {
            var model = {};
            if (!formElm.Minute.val()) {
                alert("Please enter minute");
            }
            else if (parseInt(formElm.Minute.val()) <= 0) {
                alert("Invalid minute");
            } else {
                model.Id = formElm.Id.val();
                model.Minute = formElm.Minute.val();
                return model;
            }
        };

        $scope.cancelAlertAverageSetup = function (model) {
            formElm.Id.empty(),
            formElm.Minute.val('');
            $scope.form.mode.edit = false;
        };

        $scope.updateAlertAverageSetup = function (model) {
            var model = $scope.validateAlertAverageSetupForm();
            if (model) {
                $http.post("/api/alertaverage/update", model).then(function (res) {
                    $scope.form.mode.edit = false;
                    //$scope.cancelAlertAverageSetup();
                })
            } else {
                return;
            }
        };


        $scope.submitAlertAverageSetup = function () {
            var model = $scope.validateAlertRuleSetupForm();
            if (model) {
                $http.post("api/alertaverage/update", model).then(function (res) {
                    $scope.cancelAlertAverageSetup();
                })
            }
        };
    })