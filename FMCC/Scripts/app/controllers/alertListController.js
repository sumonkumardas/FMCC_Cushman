angular.module("fmccwebportal").controller("alertList", function ($scope, $http, $routeParams) {

    angular.element('#startDateTime').datetimepicker({ format: "YYYY-MM-DD hh:mm A" });

    angular.element('#endDateTime').datetimepicker({ format: "YYYY-MM-DD hh:mm A" });

    if (typeof $routeParams.siteId != 'undefined') {
        
    }
    var formElm = {
        AlertRule: $("#alertRule"),
        Block: $("#alertRuleSetupBlock"),
    }
    formElm.AlertRule.select2({
        allowClear: true,
        placeholder: "Please select a Rule"
    });

    $http.get("/api/alertrule/block", { params: { siteId: $("#siteId").val() } }).then(function (res) {
        formElm.Block.select2({
            allowClear: true,
            data: res.data.model
        });
    });

    $http.get("/api/alert/readallRuleForCombo").then(function (res) {
        formElm.AlertRule.select2({
            allowClear: true,
            data: res.data.model
        });
    });

    var alarmListTable = angular.element('#alert-list').DataTable({
        ajax: {
            url: '/api/alert/loadalertlist',
            data: function (d, SETTINGS) {
                var st = moment(angular.element('#startDateTime').val(), "YYYY-MM-DD hh:mm A");
                var et = moment(angular.element('#endDateTime').val(), "YYYY-MM-DD hh:mm A");
                var blockId;
                if (typeof $routeParams.siteId != 'undefined')
                    blockId = $routeParams.siteId;
                else if(formElm.Block.val()) {
                    blockId = formElm.Block.val();
                } else {
                    blockId = '';
                }
                var result = $.extend({}, d, {
                    "startDate": (st == "Invalid date")?"":st.format("YYYY-MM-DD hh:mm A"),
                    "endDate": (et == "Invalid date") ? "" : et.format("YYYY-MM-DD hh:mm A"),
                    "alertRule": formElm.AlertRule.val(),
                    "siteId": $('#siteId').val(),
                    "blockId": blockId
                });
                return result;

            }
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
        {data:"Id"},
            { data: "Block" },
            {
                data: "Type",
                render: function (data) {
                    if (data == 1) {
                        return 'Total Power Consumption';
                    }
                    else if (data == 2) {
                        return 'Total Water Consumption';

                    } else if (data == 3) {
                        return 'Over Cooled';
                    }
                    else if (data == 4) {
                        return 'Equipment Histogram';
                    }
                    else if (data == 5) {
                        return 'Single Point';
                    }
                }
            },
            { data: "CurrentValue" },
            { data: "ReferenceValue" },
            { data: "Saverity" },
            
            {
                data: "FromDate",
                title:"Timestamp",
                render: function (data) {
                    return moment(data, moment.ISO_8601).format(commonDateFormat)
                }
            },
            
            {
                data: "FMCCStatus",
                render: function (data, type, full, meta) {
                    if (data == 1) {
                        data = 'new';
                        return '<span class="label label-primary status-1" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    } else if (data == 2) {
                        data = 'acknowledge';
                        return '<span class="label label-success status-2" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    } else if (data == 3) {
                        data = 'suppress';
                        return '<span class="label label-warning status-3" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    } else {
                        return '<span class="label label-primary status-3" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    }
                }
            },
        ]
    });

    angular.element("#alert-list tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = alarmListTable.row(this).data();
        var elm = angular.element(e.target);
        if (elm.hasClass("status-1")) {
            $http.post("/api/alert/setacknowledged", rowData).then(function (res) {
                if (res.data.okay) {
                    elm.removeClass("label-primary").removeClass("status-1").addClass("label-success").addClass("status-2").text("acknowledge");
                } else {
                    console.log(res);
                }
            }, function (res) {

            });
        } else if (elm.hasClass("status-2")) {
            $http.post("/api/alert/setundefined", rowData).then(function (res) {
                if (res.data.okay) {
                    elm.removeClass("label-success").removeClass("status-2").addClass("label-primary").addClass("status-1").text("new");
                } else {
                    console.log(res);
                }
            }, function (res) {
                console.log(res);
            });
        }
    });

    $scope.search = function () {
        alarmListTable.ajax.reload();  
    }

});