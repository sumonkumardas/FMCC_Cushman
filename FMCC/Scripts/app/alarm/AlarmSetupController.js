angular.module("fmcc").controller("AlarmSetup", function ($scope, $http, $rootScope, ready) {

    var status = angular.element(".status");
    var building = angular.element(".building");

    LoadBuildingList();
    LoadAlarmStatusList();
    LoadBuildingForwardAlarmList();

    $scope.SubmitObjectData = function () {
        if ($('#txtObjectId').val().trim() == "") {
            alert('Please type Object Id');
            $('#txtObjectId').focus();
            return;
        }
        else if ($('#txtObjectName').val().trim() == "") {
            alert("Please type Object name");
            $('#txtObjectName').focus();
            return;
        }

        var objectData = {
            ObjectId: $scope.mObjectId,
            Name: $scope.mObjectName
        };

        var req = $http.post('/api/SetupApi/PostObjectData', objectData);
        req.then(function (msg) {
            if (msg.data != null) {
                LoadObjectData();
            }
        },
        function () {
            alert('Sorry an error occured');
        });
    };
    $scope.SubmitDataFieldData = function () {

        if ($('#txtDataField').val().trim() == "") {
            alert("Please type datafield Id");
            $('#txtDataField').focus();
            return;
        }
        else if ($('#txtDataFieldName').val().trim() == "") {
            alert("Please type datafield name");
            $('#txtDataFieldName').focus();
            return;
        }
        else if ($('#txtDataFieldUnit').val().trim() == "") {
            alert("Please type datafield unit");
            $('#txtDataFieldUnit').focus();
            return;
        }
        var objectData = {
            DataFieldId: $scope.mDataFieldId,
            Name: $scope.mDataFieldName,
            Unit: $scope.mDataFieldUnit
        };

        var req = $http.post('/api/SetupApi/PostDataField', objectData);
        req.then(function (msg) {
            if (msg.data != null) {
                LoadDataFieldData();
            }
        },
        function () {
            alert('Sorry an error occured');
        });
    };
    $scope.SaveBuidingAlarmData = function () {
        var _status = status.select2("val");
        var _building = building.select2("val");

        if (_building.trim() == "") {
            alert("Please select a building ");
            return;
        }
        else if (_status.trim() == "") {
            alert("Please select a status ");
            return;
        }

        var forwardData = {
            BuildingId: _building,
            StatusId: _status,
        };
        console.log(forwardData)

        var req = $http.post('/service/alarm/SetBuildingForwardAlarms', forwardData);
        req.then(function (msg) {
            status.val("").trigger("change");
            building.val("").trigger("change");
            if (msg.data != null) {
                $('#alarm-status').DataTable().ajax.reload();
            }
        },
        function () {
            alert('Sorry an error occured');
        });
    };

    function LoadBuildingList() {
        var req = $http.get('/service/alarm/loadbuildinglist');
        req.then(function (msg) {
            $scope.BuildingList = msg.data;
            angular.element(".building").select2({
                allowClear: true,
                placeholder: "Select a Building"
            });
        },
        function () {
            alert('Sorry');
        });
    }
    function LoadAlarmStatusList() {
        var req = $http.get('/service/alarm/loadalarmstatuslist');
        req.then(function (msg) {
            $scope.AlarmStatusList = msg.data;
            angular.element(".status").select2({
                allowClear: true,
                placeholder: "Select a Building"
            });
        },
        function () {
            alert('Sorry');
        });
    }
    function LoadBuildingForwardAlarmList() {
        $('#alarm-status').DataTable({
            ajax: {
                url: '/service/alarm/loadbuildingforwardalarmlist',
                dataSrc: "data"
            },
            processing: true,
            serverSide: true,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
                { data: "BuildingName" },
                { data: "StatusName" }
            ]
        });
    }
    $rootScope.show = ready.show;
});