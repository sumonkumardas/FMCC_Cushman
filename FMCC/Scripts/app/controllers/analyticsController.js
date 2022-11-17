angular.module("fmccwebportal").controller("analyticsController", function ($scope, $http, $timeout, $window, $document, Widget) {
    var chart = {
        draw: function (callback) {
            Highcharts.setOptions({
                colors: ['#00A65A', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263']
            });
            var config = {
                chart: {
                    zoomType: 'x',
                    type: 'line',
                    animation: {
                        duration: 1000
                    }
                },
                credits: {
                    enabled: false
                },
                lang: {
                    noData: "No data to display in this date range"
                },
                noData: {
                    style: {
                        fontWeight: 'normal',
                        fontSize: '18px',
                        color: '#707070'
                    }
                },
                xAxis: {
                    title: {
                        text: "Time"
                    },
                    type: 'datetime',
                    dateTimeLabelFormats: { day: '%e %b %H:%M' }
                },
                yAxis: {
                    title: {
                        text: "Value"
                    }
                },
                tooltip: {
                    headerFormat: '<b>Date:{point.x:%Y-%m-%d %H:%M}</b><br>',
                    pointFormat: '<b>Value: {point.y:.2f}</b>'
                },
                series: []
            };
            if (typeof callback == 'function') {
                callback(config);
            }
            config.elm && config.elm.highcharts(config);
            config.elm && config.elm.highcharts().setTitle({ text: config.chart.title.text });
        }
    }
    $scope.storage = {
        chartData: [],
        tableData: [],
    };
    $scope.analytics = {
        widget: {
            form: {
                option: {
                    hide: function (ev) {
                        angular.element(ev.target).closest(".box-tools").find(".option-form").removeClass("selected");
                    },
                    toggle: function (ev) {
                        var elm = angular.element(ev.target);
                        var container = elm.closest(".box-tools");
                        var form = container.find(".option-form");
                        var formelm = {
                            title: form.find(".title"),
                            block: form.find(".block"),
                            object: form.find(".object"),
                            datafield: form.find(".data-field"),
                            daterange: form.find(".date-range"),
                            displayType: form.find(".display-type"),
                            istable: form.find(".table-view"),
                        };

                        var blocks = [];
                        $.ajax({
                            method: "GET",
                            url: "/api/analytics/blocks?siteId="+$('#siteId').val(),
                            dataType: "json",
                            async: false,
                            success: function (result) {
                                if (result.okay) {
                                    blocks = result.model;
                                }
                            }
                        });
                        formelm.block.select2({
                            data: blocks,
                            allowClear: true
                        });
                        formelm.object.select2({
                            allowClear: true
                        });
                        formelm.datafield.select2({
                            allowClear: true
                        });
                        formelm.block.on("change", function () {
                            formelm.object.html('<option></option>').trigger("change");
                            formelm.datafield.html('<option></option>').trigger("change");
                            var block = $(this).val();
                            var model = { BlockId: block };
                            $.ajax({
                                type: "POST",
                                url: "/api/Object",
                                contentType: "application/json",
                                data: JSON.stringify(model),
                                dataType: "json",
                                success: function (res) {
                                    formelm.object.select2({
                                        data: res,
                                        allowClear: true
                                    });
                                },
                                error: function () { }
                            });
                        });
                        formelm.object.on("change", function () {
                            formelm.datafield.html('<option></option>').trigger("change");
                            var objectId = $(this).val();
                            var blockId = formelm.block.val();
                            var model = { BlockId: blockId, ObjectId: objectId };
                            if (model.BlockId && model.ObjectId) {
                                $.ajax({
                                    type: "POST",
                                    url: "/api/DataField",
                                    contentType: "application/json",
                                    data: JSON.stringify(model),
                                    dataType: "json",
                                    success: function (res) {
                                        formelm.datafield.select2({
                                            data: res,
                                            placeholder: 'Select Data Field',
                                        });
                                    },
                                    error: function () { }
                                });
                            }
                        });
                        formelm.displayType.select2({
                            allowClear: true
                        });
                        formelm.daterange.daterangepicker({
                            linkedCalendars: false,
                            locale: {
                                format: 'YYYY-MM-DD'
                            },
                            ranges: {
                                'Today': [
                                moment(),
                                moment()],
                                'Yesterday': [
                                moment().add(-1, 'days'),
                                moment().add(-1, 'days')],
                                'This Week': [
                                moment().startOf('isoweek').isoWeekday(1),
                                moment()],
                                'Last Week': [
                                moment().startOf('isoweek').add(-7, 'days').isoWeekday(1),
                                moment().startOf('isoweek').add(-7, 'days').isoWeekday(7)],
                                'This Month': [
                                moment().date(1),
                                moment()],
                                'Last Month': [
                                moment().subtract(1, 'months').date(1),
                                moment().date(1).subtract(1, 'days')]
                            },
                            separator: '-',
                        });
                        formelm.daterange.on("show.daterangepicker", function (ev, picker) {
                            picker.leftCalendar.month = moment();
                            picker.rightCalendar.month = moment();
                            console.log(picker)
                        });
                        formelm.istable.iCheck({
                            checkboxClass: 'icheckbox_square-blue',
                            radioClass: 'iradio_square-blue',
                            increaseArea: '20%'
                        });
                        var isActive = form.hasClass("selected");
                        if (isActive) {
                            form.removeClass("selected")
                        } else {
                            if (!container.find('button[data-widget="collapse"]').children().hasClass('fa-plus')) {
                                elm.closest(".box-tools").find(".config-form").removeClass("selected");
                                form.addClass("selected");
                            }
                        }
                    },
                    submit: function (ev, params) {
                        var elm = angular.element(ev.target);
                        elm.closest(".option-form").removeClass("selected");
                        if (params.title && params.block && params.object && params.field && params.range && params.type) {
                            var mask = elm.closest(".box").find(".mask").show();
                            $scope.analytics.widget.readData({
                                model: {
                                    blockId: params.block,
                                    objectId: params.object,
                                    dataFieldId: params.field,
                                    dateFlag: params.range
                                },
                                success: function (res) {
                                    var chartData, name, raw, len, type;
                                    chartData = [], tableData = [];
                                    raw = res.data;
                                    len = res.data.length;
                                    type = params.type;
                                    name = params.object + " " + params.field;

                                    for (var i = 0; i < len; i++) {
                                        tableData.push({
                                            block: params.block,
                                            object: params.object,
                                            field: params.field,
                                            timestamp: moment(raw[i].YY + '-' + raw[i].MM + '-' + raw[i].DD + ' ' + raw[i].hh + ':' + raw[i].mm + ':' + raw[i].ss, "D-M-Y hh:mm:ss").format("YYYY-MM-DD hh:mm A"),
                                            value: raw[i].value.toFixed(2)
                                        });
                                        chartData.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                    }

                                    $scope.storage.chartData = chartData;
                                    $scope.storage.tableData = tableData;

                                    chart.draw(function (config) {
                                        config.chart.title = { text: params.title };
                                        config.series.push({
                                            name: name,
                                            type: type,
                                            lineWidth: 1,
                                            data: chartData,
                                            marker: {
                                                enabled: false
                                            }
                                        });
                                        if (params.min && params.max) {
                                            config.yAxis.plotLines = [
                                            {
                                                width: 2,
                                                zIndex: 100,
                                                color: '#F39C12',
                                                value: params.min,
                                                dashStyle: "Solid",

                                            }, {
                                                width: 2,
                                                zIndex: 100,
                                                color: '#5537E8',
                                                value: params.max,
                                                dashStyle: "Solid",
                                            }];
                                        }
                                        config.elm = elm.closest(".box").find(".chart-elem");
                                        config.tooltip = {
                                            formatter: function () {
                                                var totip = '' +
                                                         '<b>  ' + this.series.name + '<b><br/>' +
                                                         '<span> time : ' + moment(this.point.x).utc().format("YYYY-MM-DD hh:mm A") + '</span><br/>' +
                                                         '<span> value : ' + this.point.y.toFixed(2) + '</span><br/>';
                                                return totip;
                                            }
                                        },
                                        config.exporting = {
                                            enabled: true
                                        }
                                    });
                                    mask.hide();
                                    if (false) {
                                        params.showTable = true;
                                        $scope.storage.tableData = tableData;
                                        var table = angular.element('<table class="table table-bordered table-condensed" style="width:100%;"></table>');
                                        elm.closest(".box").find(".my-highchart-table-data").html(table);
                                        var dataTable = table.DataTable({
                                            dom: 'Bfrtip',
                                            buttons: [{
                                                extend: 'copyHtml5',
                                                title: 'Table Data',
                                            }, {
                                                extend: 'excelHtml5',
                                                title: 'Table Data',
                                            }, {
                                                extend: 'csvHtml5',
                                                title: 'Table Data',
                                            }, {
                                                extend: 'pdfHtml5',
                                                title: 'Table Data',
                                            }],
                                            data: tableData,
                                            language: {
                                                paginate: {
                                                    next: "»",
                                                    previous: "«"
                                                },
                                            },
                                            processing: true,
                                            serverSide: false,
                                            ordering: false,
                                            paging: true,
                                            searching: false,
                                            pageLength: 10,
                                            columns: [
                                                { data: "block", title: "Block" },
                                                { data: "object", title: "Object" },
                                                { data: "field", title: "Data Field" },
                                                { data: "timestamp", title: "Time Stamp" },
                                                { data: "value", title: "Value" },
                                            ]
                                        });
                                    } else {
                                        elm.closest(".box").find(".my-highchart-table-data").html("");
                                    }
                                }
                            });

                        }
                    },
                },
                config: {
                    hide: function (ev) {
                        angular.element(ev.target).closest(".box-tools").find(".config-form").removeClass("selected");
                    },
                    toggle: function (ev) {
                        var elm = angular.element(ev.target);
                        var container = elm.closest(".box-tools");
                        var form = container.find(".config-form");
                        var formelm = {
                            title: form.find(".title"),
                            block: form.find(".block"),
                            object: form.find(".object"),
                            datafield: form.find(".data-field"),
                            daterange: form.find(".date-range"),
                            displayType: form.find(".display-type"),
                            istable: form.find(".table-view"),
                        };

                        var isActive = form.hasClass("selected");
                        if (isActive) {
                            form.removeClass("selected")
                        } else {
                            if (!container.find('button[data-widget="collapse"]').children().hasClass('fa-plus')) {
                                elm.closest(".box-tools").find(".option-form").removeClass("selected");
                                form.addClass("selected");
                            }
                        }
                    },
                    submit: function (ev, params) {
                        var elm = angular.element(ev.target);
                        elm.closest(".config-form").removeClass("selected");
                        if (params.title && params.block && params.object && params.field && params.range && params.type && params.min && params.max) {
                            var mask = elm.closest(".box").find(".mask").show();
                            var data,tdata, name, raw, len, type;
                            data = [],tdata=[];
                            type = params.type;
                            name = params.object + " " + params.field;
                            chart.draw(function (config) {

                                if (params.min && params.max) {

                                    var length = $scope.storage.chartData.length;
                                    for (var j = 0; j < length; j++) {
                                        var val = $scope.storage.chartData[j][1];
                                        if (!(val >= params.min && val <= params.max)) {
                                            data.push($scope.storage.chartData[j]);
                                            tdata.push($scope.storage.tableData[j]);
                                        } else {
                                            
                                        }
                                    }

                                    config.yAxis.plotLines = [
                                    {
                                        color: '#F39C12',
                                        dashStyle: "Solid",
                                        value: params.max,
                                        width: 2,
                                        zIndex: 100
                                    }, {
                                        color: '#5537E8',
                                        dashStyle: "Solid",
                                        value: params.min,
                                        width: 2,
                                        zIndex: 100
                                    }
                                    ];
                                    config.series.push({
                                        lineWidth: 1,
                                        name: name,
                                        data: $scope.storage.chartData,
                                        type: type,
                                        marker: {
                                            enabled: false
                                        }
                                    }, {
                                        color:'#3C8DBC',
                                        lineWidth: 0,
                                        name: name,
                                        data:data,
                                        type: "line",
                                        marker: {
                                            symbol:"circle",
                                            enabled: true,
                                            radius: 6
                                        },
                                        tooltip: {
                                            valueDecimals: 6
                                        },
                                        states: {
                                            hover: {
                                                lineWidthPlus: 0
                                            }
                                        }
                                    });
                                    config.chart.title = { text: params.title };
                                }
                                

                                config.elm = elm.closest(".box").find(".chart-elem");
                                config.tooltip = {
                                    formatter: function () {
                                        var totip = '' +
                                                 '<b>  ' + this.series.name + '<b><br/>' +
                                                 '<span> time : ' + moment(this.point.x).utc().format("YYYY-MM-DD hh:mm A") + '</span><br/>' +
                                                 '<span> value : ' + this.point.y.toFixed(2) + '</span><br/>';
                                        return totip;
                                    }
                                },
                                config.exporting = {
                                    enabled: true
                                }
                            });
                            mask.hide();

                            console.log(params.table);

                            if (params.table==1) {
                                params.showTable = true;
                                var table1 = angular.element('<table class="table table-bordered table-condensed" style="width:100%;"></table>');
                                elm.closest(".box").find(".my-highchart-table-data").html(table1);
                                var dataTable = table1.DataTable({
                                    dom: 'Bfrtip',
                                    buttons: [{
                                        extend: 'copyHtml5',
                                        title: 'Table Data',
                                    }, {
                                        extend: 'excelHtml5',
                                        title: 'Table Data',
                                    }, {
                                        extend: 'csvHtml5',
                                        title: 'Table Data',
                                    }, {
                                        extend: 'pdfHtml5',
                                        title: 'Table Data',
                                    }],
                                    data: tdata,
                                    language: {
                                        paginate: {
                                            next: "»",
                                            previous: "«"
                                        },
                                    },
                                    processing: true,
                                    serverSide: false,
                                    ordering: false,
                                    paging: true,
                                    searching: false,
                                    pageLength: 10,
                                    columns: [
                                        { data: "block", title: "Block" },
                                        { data: "object", title: "Object" },
                                        { data: "field", title: "Data Field" },
                                        { data: "timestamp", title: "Time Stamp" },
                                        { data: "value", title: "Value" },
                                    ]
                                });
                            }

                            if (params.table==2) {
                                
                                params.showTable = true;
                                var table2 = angular.element('<table class="table table-bordered table-condensed" style="width:100%;"></table>');
                                elm.closest(".box").find(".my-highchart-table-data").html(table2);
                                var dataTable = table2.DataTable({
                                    dom: 'Bfrtip',
                                    buttons: [{
                                        extend: 'copyHtml5',
                                        title: 'Table Data',
                                    }, {
                                        extend: 'excelHtml5',
                                        title: 'Table Data',
                                    }, {
                                        extend: 'csvHtml5',
                                        title: 'Table Data',
                                    }, {
                                        extend: 'pdfHtml5',
                                        title: 'Table Data',
                                    }],
                                    data: $scope.storage.tableData,
                                    language: {
                                        paginate: {
                                            next: "»",
                                            previous: "«"
                                        },
                                    },
                                    processing: true,
                                    serverSide: false,
                                    ordering: false,
                                    paging: true,
                                    searching: false,
                                    pageLength: 10,
                                    columns: [
                                        { data: "block", title: "Block" },
                                        { data: "object", title: "Object" },
                                        { data: "field", title: "Data Field" },
                                        { data: "timestamp", title: "Time Stamp" },
                                        { data: "value", title: "Value" },
                                    ]
                                });
                            }
                        }
                    }
                },
                hideAll: function (ev) {
                    angular.element(ev.target).closest(".box-tools").find("form").removeClass("selected");
                },
            },
            collection: [{
                min: null,
                max: null,
                title: null,
                block: null,
                object: null,
                field: null,
                range: null,
                type: null,
                table: 2,
                showTable: false
            }],
            create: function () {
                $scope.analytics.widget.collection.push({
                    min: null,
                    max: null,
                    title: null,
                    block: null,
                    object: null,
                    field: null,
                    range: null,
                    type: null,
                    table: false,
                    showTable: false
                });
                $timeout(function () {
                    var len = $scope.analytics.widget.collection.length;
                    if (len > 1) {
                        //$window.scrollBy(0, 676 + (580 * (len - 2)) - $window.scrollY);
                        $window.scrollBy(0, $document.height());
                    }
                });
            },
            readData: function (option) {
                Widget.ReadWidgetData(option);
            },
        },
    }
});


