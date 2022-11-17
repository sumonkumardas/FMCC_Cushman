angular.module("fmcc").controller('Setup', function ($scope, $http,$rootScope, ready) {

    LoadObjectData();

    LoadBuildingList();

    LoadDataFieldData();

    LoadBuildingObjectDataList();

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
                $('#txtObjectId').val("");
                $('#txtObjectName').val("")
                $("#object-data").DataTable().ajax.reload();
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
                $('#txtDataFieldName').val("");
                $('#txtDataField').val("");
                $('#txtDataFieldUnit').val("");
                $("#data-field").DataTable().ajax.reload();
            }
        },
        function () {
            alert('Sorry an error occured');
        });
    };

    $scope.SaveBuidingObjectData = function () {
        if ($('#idSelectBuildings').val().trim() == "") {
            alert("Please select a building ");
            return;
        }
        else if ($('#idSelectObjectList').val().trim() == "") {
            alert("Please select an object");
            return;
        }
        else if ($('#idSelectDatafieldData').val().trim() == "") {
            alert("Please select an datafield");
            return;
        }

        var objInfo = $('#idSelectObjectList').val().split(':');
        var dfInfo = $('#idSelectDatafieldData').val().split(':');

        var objectData = {
            BuildingFkId: $scope.mBuildingList,
            ObjectFkId: objInfo[1],
            DataFieldFkId: dfInfo[1]
        };
        var req = $http.post('/api/SetupApi/SaveBuidingObjectData', objectData);
        req.then(function (msg) {
            $('#idSelectBuildings').select2("val", "").trigger("change");
            $('#idSelectObjectList').select2("val", "").trigger("change");
            $('#idSelectDatafieldData').select2("val", "").trigger("change");
            $('#object-data-field').DataTable().ajax.reload();
        },
        function () {
            alert('Sorry an error occured');
        });
    };

    function LoadObjectData() {
        $("#object-data").DataTable({
            ajax: {
                url: '/api/SetupApi/LoadObjectList',
                dataSrc: "data"
            },
            processing: true,
            serverSide: true,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
                { data: "ObjectId", title: "Object" },
                { data: "Name", title: "Name" }
            ]
        });
    }

    function LoadBuildingList() {
        var req = $http.get('/api/SetupApi/LoadBuildingList');
        req.then(function (msg) {
            $scope.BuildingList = msg.data;
        }, function () {
            alert('Sorry');
        });

        var req = $http.get('/api/SetupApi/LoadTypeList');
        req.then(function (msg) {
            $scope.objectList = msg.data;
        }, function () {
            alert('Sorry');
        });

        $http.get('/api/SetupApi/LoadFieldList').then(function (msg) {
            if (msg.data) {
                $scope.dataFieldList = msg.data;
            } else {
                $scope.dataFieldList = [];
            }
        }, function () {
            alert('Sorry');
        });

        angular.element("#idSelectBuildings").select2({
            allowClear: true,
            placeholder: "Select a Object"
        });
        angular.element("#idSelectObjectList").select2({
            placeholder: "Select a Object"
        });
        angular.element("#idSelectDatafieldData").select2({
            enable: false,
            allowClear: true,
            placeholder: "Select a DataField"
        });

        //angular.element("#idSelectObjectList").bind("change", function () {
        //    var objectId = angular.element("#idSelectObjectList").val();
        //    if (objectId) {
        //        objectId = objectId.trim();

        //    }
        //})
    }

    function LoadDataFieldData() {
        $("#data-field").DataTable({
            ajax: {
                url: '/api/SetupApi/LoadDataFieldList',
                dataSrc: "data"
            },
            processing: true,
            serverSide: true,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
                { data: "DataFieldId", title: "DataField" },
                { data: "Name", title: "Name" },
                { data: "Unit", title: "Unit" }
            ]
        });
    }

    function LoadBuildingObjectDataList() {
        $('#object-data-field').DataTable({
            ajax: {
                url: '/api/SetupApi/LoadBuildingObjectData',
                dataSrc: "data"
            },
            processing: true,
            serverSide: true,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
                { data: "BuildingName", title: "Building" },
                { data: "ObjectName", title: "Object" },
                { data: "DataFieldName", title: "DataField" },
                { data: "DataFieldUnit", title: "DataField Unit" }
            ]
        });
    }
    $rootScope.show = ready.show;
});