angular.module("fmccwebportal").controller("AlarmList", function ($scope, $http, $routeParams) {

   
    

    angular.element('#startDateTime').datetimepicker({ format: "YYYY-MM-DD hh:mm A" });

    angular.element('#endDateTime').datetimepicker({ format: "YYYY-MM-DD hh:mm A" });

    var formElm = {
        Block: $("#alertRuleSetupBlock"),
    }

    $http.get("/api/alertrule/block", { params: { siteId: $("#siteId").val() } }).then(function (res) {
        formElm.Block.select2({
            allowClear: true,
            data: res.data.model
        });
    });

    var alarmListTable = angular.element('#alarm-list').DataTable({
        ajax: {
            url: typeof $routeParams.siteId != 'undefined' ? '/api/alarm/loadalarmlist' : '/api/alarm/loadalarmlist?FMCCStatus=1',
            data: function (d, SETTINGS) {
                var st = moment(angular.element('#startDateTime').val(), "YYYY-MM-DD hh:mm A");
                var et = moment(angular.element('#endDateTime').val(), "YYYY-MM-DD hh:mm A");
                var blockId;
                if (typeof $routeParams.siteId != 'undefined')
                    blockId = $routeParams.siteId;
                else if (formElm.Block.val()) {
                    blockId = formElm.Block.val();
                } else {
                    blockId = '';
                }
                var result = $.extend({}, d, {
                    "startDate": (st == "Invalid date") ? "" : st.format("YYYY-MM-DD hh:mm A"),
                    "endDate": (et == "Invalid date") ? "" : et.format("YYYY-MM-DD hh:mm A"),
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
        ordering: true,
        paging: true,
        searching: false,
        pageLength: 10,
        columns: [
            { data: "SiteName" },
            {
                data: "Status",
                render: function (data, type, full, meta) {
                    if (data == 'alarm') {
                        return '<span class="label label-danger" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    } else if (data == 'active') {
                        return '<span class="label label-success" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    } else if (data == 'inactive') {
                        return '<span class="label label-warning" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    } else {
                        return '<span class="label label-primary" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    }
                }
            },
            {
                data: "PreviousStatus",
                render: function (data, type, full, meta) {
                    if (data == 'alarm') {
                        return '<span class="label label-danger" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    } else if (data == 'active') {
                        return '<span class="label label-success" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    } else if (data == 'inactive') {
                        return '<span class="label label-warning" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    } else {
                        return '<span class="label label-primary" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                    }
                }
            },
            { data: "ITQF" },
            { data: "ItemCategory" },
            { data: "AcknowledgeRequired" },
            {
                data: "TimeStamp",
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

    

    angular.element("#alarm-list tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = alarmListTable.row(this).data();
        var elm = angular.element(e.target);
        if (elm.hasClass("status-1")) {
            $http.post("/api/alarm/setacknowledged", rowData).then(function (res) {
                if (res.data.okay) {
                    elm.removeClass("label-primary").removeClass("status-1").addClass("label-success").addClass("status-2").text("acknowledge");
                } else {
                    console.log(res);
                }
            }, function (res) {

            });
        } else if (elm.hasClass("status-2")) {
            $http.post("/api/alarm/setundefined", rowData).then(function (res) {
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

angular.module('fmccwebportal').filter('date', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }

        var _date = $filter('date')(new Date(input), 'MMM dd yyyy');

        return _date.toUpperCase();

    };
});