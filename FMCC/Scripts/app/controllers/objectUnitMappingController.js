angular.module("fmccwebportal").controller('objectUnitMappingController', function ($scope, $http) {

    var input = {
        power: $("#pUnitId"),
        water: $("#wUnitId"),
        temp: $("#tUnitId")
    }

    var table = {
        power: $("#ptable").DataTable({
            ajax: {
                url: '/api/setupapi/loadpowerdatafieldunitlist',
                dataSrc: "data"
            },
            language: {
                search: "",
                searchPlaceholder: "Search",
                paginate: {
                    next: "»",
                    previous: "«"
                },
            },
            processing: true,
            serverSide: true,
            ordering: false,
            paging: true,
            searching: false,
            pageLength: 10,
            columns: [
                { data: "ObjectDataField", title: "Object Data Field" },
                { data: "UnitName", title: "Unit Name" }
            ]
        }),
        water: $("#wtable").DataTable({
            ajax: {
                url: '/api/setupapi/loadwaterdatafieldunitlist',
                dataSrc: "data"
            },
            language: {
                search: "",
                searchPlaceholder: "Search",
                paginate: {
                    next: "»",
                    previous: "«"
                },
            },
            processing: true,
            serverSide: true,
            ordering: false,
            paging: true,
            searching: false,
            pageLength: 10,
            columns: [
                { data: "ObjectDataField", title: "Object Data Field" },
                { data: "UnitName", title: "Unit Name" }
            ]
        }),
        temp: $("#ttable").DataTable({
            ajax: {
                url: '/api/setupapi/loadtempdatafieldunitlist',
                dataSrc: "data"
            },
            language: {
                search: "",
                searchPlaceholder: "Search",
                paginate: {
                    next: "»",
                    previous: "«"
                },
            },
            processing: true,
            serverSide: true,
            ordering: false,
            paging: true,
            searching: false,
            pageLength: 10,
            columns: [
                { data: "ObjectDataField", title: "Object Data Field" },
                { data: "UnitName", title: "Unit Name" }
            ]
        })
    }

    input.power.select2({
        allowClear: true,
        placeholder: "Select a Unit Name"
    });

    input.temp.select2({
        allowClear: true,
        placeholder: "Select a Unit Name"
    });

    input.water.select2({
        allowClear: true,
        placeholder: "Select a Unit Name"
    });

    $scope.submitOverallPowerConsumptionUnit = function () {
        if (!input.power.val()) {
            alert("Please select a unit name.")
        } else {

            $http.post("/api/setupapi/submitobjectdatafieldunit", { ObjectDataField: "OverallPowerConsumption", UnitId: input.power.val() }).then(function (response) {
                if (response.data.okay) {
                    table.power.ajax.reload();                    
                    input.power.val("").trigger("change");
                } else {
                    console.log(response);
                }
            }, function (error) {
                console.log(error);
            })
        }
    }

    $scope.submitOverallWaterConsumptionUnit = function () {
        if (!input.water.val()) {
            alert("Please select a unit name.")
        } else {
            $http.post("/api/setupapi/submitobjectdatafieldunit", { ObjectDataField: "OverallWaterConsumption", UnitId: input.water.val() }).then(function (response) {
                if (response.data.okay) {
                    table.water.ajax.reload();
                    input.water.val("").trigger("change");
                } else {
                    console.log(response);
                }
            }, function (error) {
                console.log(error);
            })
        }
    }

    $scope.submitTemperatureUnit = function () {
        if (!input.temp.val()) {
            alert("Please select a unit name.");
        } else {
            $http.post("/api/setupapi/submitobjectdatafieldunit", { ObjectDataField: "Temperature", UnitId: input.temp.val() }).then(function (response) {
                if (response.data.okay) {
                    table.temp.ajax.reload();
                    input.temp.val("").trigger("change");
                } else {
                    console.log(response);
                }
            }, function (error) {
                console.log(error);
            })
        }
    }

    $http.get("/api/setupapi/loaddatafieldunitlist").then(function (response) {
        if (response.data.okay) {
            input.power.select2({
                allowClear: true,
                data: response.data.model,
                placeholder: "Select a unit name."
            });

            input.water.select2({
                allowClear: true,
                data: response.data.model,
                placeholder: "Select a unit name"
            });

            input.temp.select2({
                allowClear: true,
                data: response.data.model,
                placeholder: "Select a unit name"
            });


        } else {
            console.log(response);
        }
    }, function (error) {
        console.log(error);
    });
});