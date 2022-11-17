angular.module("fmccwebportal").controller("AlarmSetup", function ($scope, $http, $rootScope) {
    //angular.element("#inputItqf").select2({
    //    allowClear: true,
    //    placeholder: "Please select a itqf"
    //});

    var itqfReplacementTable;
    var alarmSupressTable;
    var itqfDataTable;
    var formElm = {
        Id: 0,
        ItqfText: $("#inputItqf"),
        ItqfInputText: $("#inputItqfName"),
        ItqfReplacementText: $("#inputReplacementItqfName"),
        ItqfBlock:$("#alertRuleSetupBlock")

    };
    angular.element("#alertRuleSetupBlock").select2({
        allowClear: true,
        placeholder: "Please select a block"
    });

    angular.element("#inputItqf2").select2({
        allowClear: true,
        placeholder: "Please select a itqf"
    });
    angular.element("#fromdate").datetimepicker({ format: "YYYY-MM-DD hh:mm A" });
    angular.element("#todate").datetimepicker({ format: "YYYY-MM-DD hh:mm A" });

    LoadBuildingList();

    LoadBuildingForwardAlarmList();

    LoadBuildingForwardAlarmSuppressList();

    LoadItqfReplacementList();

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
        if (!$("#inputItqf").val()) {
            alert("Please enter a itqf ");
            return;
        }

        if (!formElm.ItqfBlock.val()) {
            alert("Please select a Block ");
            return;
        }
        var forwardData = {
            StatusName: $("#inputItqf").val(),
            BuildingFkId: formElm.ItqfBlock.val(),
            BuildingName: $("#alertRuleSetupBlock option:selected").text(),
            Id: formElm.Id
        };

        $http.post('/api/alarm/SetBuildingForwardAlarms', forwardData).then(function (msg) {
            $("#inputItqf").val("");//.trigger("change");
            formElm.ItqfBlock.val("").trigger("change");
            formElm.Id = 0;
            $('#alarm-status').DataTable().ajax.reload();
        }, function () {
            alert('Sorry an error occured');
        });
    };
    $scope.DeleteBuidingAlarmData = function () {
        if (!$("#inputItqf").val()) {
            alert("Please enter a itqf ");
            return;
        }
        var forwardData = {
            StatusName: $("#inputItqf").val(),
            Id: formElm.Id
        };

        $http.post('/api/alarm/DeleteBuildingForwardAlarms', forwardData).then(function (msg) {
            $("#inputItqf").val("");//.trigger("change");
            formElm.Id = 0;
            $('#alarm-status').DataTable().ajax.reload();
        }, function () {
            alert('Sorry an error occured');
        });
    };

    $scope.SaveBuidingAlarmSuppressData = function () {
        if (!$("#inputItqf2").val()) {
            alert("Please select a itqf ");
            return;
        }

        var start = angular.element("#fromdate");
        var end = angular.element("#todate");


        var forwardData = {
            Itqf: $("#inputItqf2").val(),
            StartDateTime: moment(start.val(), "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD hh:mm A"),
            EndDateTime: moment(end.val(), "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD hh:mm A"),
        };

        $http.post('/api/alarm/setbuildingforwardalarmsuppress', forwardData).then(function (msg) {
            $("#inputItqf2").val("").trigger("change");
            start.val("");
            end.val("");
            $('#alarm-suppress').DataTable().ajax.reload();

        }, function () {
            alert('Sorry an error occured');
        });
    };

    $scope.DeleteBuidingAlarmSuppressData = function () {
        if (!$("#inputItqf2").val()) {
            alert("Please select a itqf ");
            return;
        }

        var start = angular.element("#fromdate");
        var end = angular.element("#todate");


        var forwardData = {
            Itqf: $("#inputItqf2").val(),
            StartDateTime: moment(start.val(), "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD hh:mm A"),
            EndDateTime: moment(end.val(), "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD hh:mm A"),
        };

        $http.post('/api/alarm/deletebuildingforwardalarmsuppress', forwardData).then(function (msg) {
            if (msg.data.okay) {
                alert('Supressed external alarms deleted.');
            }

        }, function () {
            alert('Sorry an error occured');
        });
    };

    $scope.SaveItqfNameReplacement = function () {
        if (!$("#inputItqfName").val()) {
            alert("Please enter a itqf ");
            return;
        }

        if (!$("#inputReplacementItqfName").val()) {
            alert("Please enter a replacement name ");
            return;
        }
        var isItqfExists = false;

        var model = {
            Itqf: $("#inputItqfName").val(),
            ReplacementName: $("#inputReplacementItqfName").val(),
            Id: formElm.Id
        };

        $http.post('/api/alarm/setitqfreplacement', model).then(function (msg) {
            $("#inputItqfName").val("");//.trigger("change");
            $("#inputReplacementItqfName").val("");
            formElm.Id = 0;
            $('#itqf-replacement').DataTable().ajax.reload();
        }, function () {
            alert('Sorry an error occured');
        });

        //$http.post("/api/alarm/checkitqfexists", model).then(function (msg) {
        //    //if (msg.data.okay) {
                
        //    //} else {
        //    //    alert("Please enter a valid itqf");
        //    //}
        //}, function () {
        //});
    };

    $scope.DeleteItqfNameReplacement = function () {
        if (!$("#inputItqfName").val()) {
            alert("Please enter a itqf ");
            return;
        }

        if (!$("#inputReplacementItqfName").val()) {
            alert("Please enter a replacement name ");
            return;
        }
        var isItqfExists = false;

        var model = {
            Itqf: $("#inputItqfName").val(),
            ReplacementName: $("#inputReplacementItqfName").val(),
            Id: formElm.Id
        };

        $http.post('/api/alarm/deleteitqfreplacement', model).then(function (msg) {
            $("#inputItqfName").val("");//.trigger("change");
            $("#inputReplacementItqfName").val("");
            formElm.Id = 0;
            $('#itqf-replacement').DataTable().ajax.reload();
        }, function () {
            alert('Sorry an error occured');
        });

        //$http.post("/api/alarm/checkitqfexists", model).then(function (msg) {
        //    //if (msg.data.okay) {

        //    //} else {
        //    //    alert("Please enter a valid itqf");
        //    //}
        //}, function () {
        //});
    };
    function LoadBuildingList() {
        $http.get('/api/alarm/loadbuildinglist').then(function (msg) {
            $("#inputBuildingId").select2({
                allowClear: true,
                data: msg.data,
                placeholder: "Please select a block"
            });
        }, function () {
            alert('Sorry');
        });

        $http.get("/api/alertrule/block", { params: { siteId: $("#siteId").val() } }).then(function (res) {
            formElm.ItqfBlock.select2({
                allowClear: true,
                data: res.data.model
            });
        });
    }

    function LoadBuildingForwardAlarmList() {
        var count = 0;
        itqfDataTable = $('#alarm-status').DataTable({
            ajax: {
                url: '/api/alarm/loadalarmforwardlist',
                dataSrc: "model"
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
            serverSide: false,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
            { data: "Id", title: "No." },
            {
                data: "StatusName",
                title: "Itqf"
            },
            {
                data: "BuildingName",
                title: "Block"
            },
            {
                data:null,   
                title: "Action",
                render: function () {
                    return "<a href='javascript:void(0)'>Select</a>";
                }
            }

            ]
        });
    }

    function LoadItqfReplacementList() {
        itqfReplacementTable = $('#itqf-replacement').DataTable({
            ajax: {
                url: '/api/alarm/loaditqfreplacementlist',
                dataSrc: "model"
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
            serverSide: false,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
            { data: "Id", title: "No." },
            {
                data: "Itqf",
                title: "Itqf"
            },
            {
                data: "ReplacementName",
                title: "Replacement"
            },
            {
                data: null,
                title: "Action",
                render: function () {
                    return "<a href='javascript:void(0)'>Select</a>";
                }
            }
            ]
        });
    }
    
    itqfReplacementTable.on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = itqfReplacementTable.row(this).data();

        formElm.Id = (rowData.Id);
        formElm.ItqfInputText.val(rowData.Itqf);
        formElm.ItqfReplacementText.val(rowData.ReplacementName);


    });

    itqfDataTable.on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = itqfDataTable.row(this).data();
        
        formElm.Id = (rowData.Id);
        formElm.ItqfText.val(rowData.StatusName);
        formElm.ItqfBlock.each(function () {
            if ($(this).text() == rowData.BuildingName) {
                formElm.ItqfText.val($(this).val());
            }
        });
        formElm.ItqfBlock.val(rowData.BuildingFkId).trigger("change");


    });

    function LoadBuildingForwardAlarmSuppressList() {
        alarmSupressTable = $('#alarm-suppress').DataTable({
            ajax: {
                url: '/api/alarm/loadbuildingforwardalarmsuppresslist',
                dataSrc: "model"
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
            serverSide: false,
            ordering: true,
            paging: true,
            searching: true,
            pageLength: 10,
            columns: [
            { data: "Id", title: "No." },
            {
                data: "Itqf",
                title: "Itqf"
            },
            {
                data: "StartDateTime",
                title: "Start Date",
                render: function (data) {
                    return moment(data, moment.ISO_8601).format(commonDateFormat)
                }
            },
            {
                data: "EndDateTime",
                title: "End Date",
                render: function (data) {
                    return moment(data, moment.ISO_8601).format(commonDateFormat)
                }
            },
            {
                data: null,
                title: "Action",
                render: function () {
                    return "<a href='javascript:void(0)'>Select</a>";
                }
            }
            ]
        });
    }

    alarmSupressTable.on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = alarmSupressTable.row(this).data();
        $("#inputItqf2").val(rowData.Itqf).trigger("change");
        $("#fromdate").val(moment(rowData.StartDateTime, moment.ISO_8601).format(commonDateFormat));
        $("#todate").val(moment(rowData.EndDateTime, moment.ISO_8601).format(commonDateFormat));

    });

    $http.get("/api/alarm/loadalarmitqflist").then(function (msg) {
        if (msg.data.okay) {
            var data = [];
            var dbdata = msg.data.model;
            var count = dbdata.length;
            for (var i = 0; i < count; i++) {
                data.push({ id: dbdata[i].trim(), text: dbdata[i].trim() })
            }
            //$("#inputItqf").select2({
            //    data: data,
            //    allowClear: true,
            //    placeholder: "Please select a itqf"
            //});
            $("#inputItqf2").select2({
                data: data,
                allowClear: true,
                placeholder: "Please select a itqf"
            });
        } else {
            console.log(msg);
        }
    }, function () {
        alert('Sorry');
    });
});