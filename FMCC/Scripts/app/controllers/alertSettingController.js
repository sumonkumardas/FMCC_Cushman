angular.module("fmccwebportal").controller("alertSettingController", function ($scope, $http, $rootScope) {

    var table;
    var formElm = {
        Id: $("#alertAverageSetupId"),
        Minute: $("#alertAverageMinute"),
        Block: $("#alertRuleSetupBlock"),
        AlertAverageBlock: $("#alertAverageBlock")

    };
    $http.get("/api/readsuppress").then(function (res) {
         table= $("#suppress-data-table").DataTable({
            data: res.data.model,
            language: {
                search: "",
                searchplaceholder: "search",
                paginate: {
                    next: "»",
                    previous: "«"
                }
            },
            processing: true,
            serverside: false,
            ordering: true,
            paging: true,
            searching: true,
            pagelength: 10,
            columns: [
                { data: "Id", title: "#" },
                {
                    data: "BuildingId",
                    title: "Block"
                },
                {
                    data: "StartDate",
                    render: function (data) {
                        return moment(data, "DD-MM-YYYY hh:mm").format(commonDateFormat);
                    },
                    title: "From Date"
                },
                {
                    data: "EndDate",
                    render: function (data) {
                        return moment(data, "DD-MM-YYYY hh:mm").format(commonDateFormat);
                    },
                    title: "End Date"
                }
            ]
        });
    });

    var alertAverageTable = $("#alert-average-table").DataTable({
        ajax: {
            url: '/api/alertaverage/getalertaverage',
            dataSrc: "model",
            data: function (d) { }
        },
        language: {
            search: "",
            searchPlaceholder: "Search",
            paginate: {
                next: "»",
                previous: "«"
            }
        },
        processing: true,
        serverSide: false,
        ordering: true,
        paging: true,
        searching: true,
        pageLength: 10,
        columns: [{ data: "Id", title: "#" }, {
            data: "BuildingId",
            title: "Block"
        }, {
            data: "Minute",
            title: "Minute"
        } , {
            data:null,   
            title: "Action",
            render: function () {
                return "<a href='javascript:void(0)'>Select</a>";
            }
        }]
    });

    alertAverageTable.on("click", "tr", function (e) {
        //$scope.form.mode.edit = true;
        var rowElem = $(this);
        var rowData = alertAverageTable.row(this).data();
        formElm.Id.val(rowData.Id);

        formElm.AlertAverageBlock.val(rowData.BuildingFkId).trigger("change");
        formElm.Minute.val(rowData.Minute);
        

    });

    $("#fromdate").datetimepicker({
        format: "YYYY-MM-DD hh:mm A"
    });

    

    formElm.Block.select2({
        allowClear: true
    });

    $http.get("/api/alertrule/block", { params: { siteId: $("#siteId").val() } }).then(function (res) {
        formElm.Block.select2({
            allowClear: true,
            data: res.data.model
        });
        formElm.AlertAverageBlock.select2({
            allowClear: true,
            data: res.data.model
        });
    });

    //$http.post("/api/alertaverage/getalertaverage", {}).then(function (res) {

    //    formElm.Minute.val(res.data.model.Minute);
    //    formElm.AlertAverageBlock.val(res.data.model.BuildingFkId).trigger("change");
    //});

    $scope.validateAlertAverageSetupForm = function () {
        var model = {};
        if (!formElm.Minute.val()) {
            alert("Please enter minute");
        }
        else if (parseInt(formElm.Minute.val()) <= 0) {
            alert("Invalid minute");
        }
        else if (!formElm.AlertAverageBlock.val()) {
            alert("Please select a block");
        } else {
            model.Id = formElm.Id.val();
            model.Minute = formElm.Minute.val();
            model.BuildingFkId = formElm.AlertAverageBlock.val();
            model.BuildingId = $('select[id=alertAverageBlock] option:selected').text();
            
            return model;
        }
    };

    $scope.cancelAlertAverageSetup = function (model) {
        formElm.Id.empty(),
        formElm.Minute.val('');
        formElm.AlertAverageBlock.val('').trigger('change');
    };

    $scope.updateAlertAverageSetup = function (model) {
        var model = $scope.validateAlertAverageSetupForm();
        if (model) {
            $http.post("/api/alertaverage/update", model).then(function(res) {
                $scope.cancelAlertAverageSetup();
                $("#alert-average-table").DataTable().ajax.reload();
            });
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

    function refreshTable(tableId, urlData) {
        $.getJSON(urlData, null, function (json) {
            table = $(tableId).dataTable();
            oSettings = table.fnSettings();

            table.fnClearTable(this);

            for (var i = 0; i < json.model.length; i++) {
                table.oApi._fnAddData(oSettings, json.model[i]);
            }

            oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
            table.fnDraw();
        });
    }


    $("#todate").datetimepicker({
        format: "YYYY-MM-DD hh:mm A"
    });

    $scope.savesuppresseddata = function () {
        if (!$("#fromdate").val()) {
            alert("Please enter a start time");
        } else if (!$("#todate").val()) {
            alert("Please enter a end time");

        }
        else if (!formElm.Block.val()) {
            alert("Please select a block");
        } else {
            var model = {
                From_Date: $("#fromdate").val(),
                to_Date: $("#todate").val(),
                BuildingFkId: formElm.Block.val(),
                BuildingId: $('select[id=alertRuleSetupBlock] option:selected').text()
            }
            $http.post("/api/createsuppress", JSON.stringify(model)).then(function(res) {
                if (res.data.okay) {

                    //$("#suppress-data-table").ajax.url('/api/readsuppress').load();
                    //$('#suppress-data-table').DataTable().ajax.reload();
                    refreshTable('#suppress-data-table', '/api/readsuppress');
                    $("#fromdate").val();
                    $("#todate").val();
                    $("#alertRuleSetupBlock").val();
                }
            });
        }
    }
});
