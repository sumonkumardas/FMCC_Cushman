angular.module("fmccwebportal").controller("mydashboardController", function ($scope, $http, $window, $timeout, $routeParams, $filter, Widget) {

    var userId = $routeParams.userId;
    var menuId = $routeParams.menuId;

    var Local = {};
    Local.Widget = {};
    Local.IsValid = function (option) {
        var profile = option.find(".mProfile").val();
        if (profile) {
            switch (profile) {
                case 'ahu':
                    if (!option.find(".mTitle").val()) {
                        return false;
                    }
                    else if (!option.find(".mBlock").val()) {
                        return false;
                    }
                    else if (!option.find(".mObject").val()) {
                        return false;
                    }
                    else if (!option.find(".mRATemperature").val()) {
                        return false;
                    }
                    else if (!option.find(".mValveOutput").val()) {
                        return false;
                    }
                    else if (!option.find(".mThresholdRangeFrom").val()) {
                        return false;
                    }
                    else if (!option.find(".mThresholdRangeTo").val()) {
                        return false;
                    }
                    else if (!option.find(".mSetPoint").val()) {
                        return false;
                    }
                    else if (!option.find(".mDateRange").val()) {
                        return false;
                    }
                    else {
                        return true;
                    }
                case 'plain':
                    if (!option.find(".mTitle").val()) {
                        return false;
                    }
                    else if (!option.find(".mBlock").val()) {
                        return false;
                    }
                    else if (!option.find(".mObject").val()) {
                        return false;
                    }
                    else if (!option.find(".mDataField").val()) {
                        return false;
                    }
                    else if (!option.find(".mDateRange").val()) {
                        return false;
                    }
                    else if (!option.find(".mChartType").val()) {
                        return false;
                    }
                    else {
                        return true;
                    }
                case 'heatmap':
                    if (!option.find(".mTitle").val()) {
                        return false;
                    }
                    else if (!option.find(".mBlock").val()) {
                        return false;
                    }
                    else if (!option.find(".mObject").val()) {
                        return false;
                    }
                    else if (!option.find(".mDataField").val()) {
                        return false;
                    }
                    else if (!option.find(".mDateRange").val()) {
                        return false;
                    }
                    else {
                        return true;
                    }
                case 'temperature':
                    if (!option.find(".mTitle").val()) {
                        return false;
                    }
                    else if (!option.find(".mBlock").val()) {
                        return false;
                    }
                    else if (!option.find(".mObject").val()) {
                        return false;
                    }
                    else if (!option.find(".mDataField").val()) {
                        return false;
                    }
                    else if (!option.find(".mObjectToCompare").val()) {
                        return false;
                    }
                    else if (!option.find(".mDataFieldToCompare").val()) {
                        return false;
                    }
                    else if (!option.find(".mUnit").val()) {
                        return false;
                    }
                    else if (!option.find(".mDateRange").val()) {
                        return false;
                    }
                    else {
                        return true;
                    }
                case 'onoff':
                    if (!option.find(".mTitle").val()) {
                        return false;
                    }
                    else if (!option.find(".mBlock").val()) {
                        return false;
                    }
                    else if (!option.find(".mObject").val()) {
                        return false;
                    }
                    else if (!option.find(".mDataField").val()) {
                        return false;
                    }
                    else if (!option.find(".mDateRange").val()) {
                        return false;
                    }
                    else {
                        return true;
                    }
                default:
                    return false;
            }
        } else {
            return false;
        }
    };
    Local.Validate = function (option) {
        if (Local.IsValid(option)) {
            option.find(".chart-create").prop("disabled", false);
        } else {
            option.find(".chart-create").prop("disabled", true);
        }
    }
    Local.Run = function (option) {
        option.call(this);
    };
    Local.Bind = function (option) {
        $(".create-widget").bind("click", Local.Widget.Init);
    };
    Local.Widget.Read = function (option) {
        Widget.ReadWidget(option);
    };
    Local.Widget.Draw = function (callback) {
        Local.Widget.HiChart(callback);
    };
    Local.Widget.Init = function (option) {
        var el = {};
        var template = $($("#template").html());
        el.mask = template.find(".loading-mask");
        el.chart = template.find(".chart-element");
        el.generate = template.find(".chart-create");
        el.option = template.find(".chart-option");
        el.toggle = template.find(".chart-toggle");
        el.remove = template.find(".chart-remove");
        el.cancel = template.find(".chart-cancel");
        el.optionMenu = template.find(".option-menu");

        el.ahuProfile = template.find('.ahu-profile');
        el.plainProfile = template.find('.plain-profile');
        el.temperatureProfile = template.find('.temperature-profile');

        el.mId = template.find(".mId");
        el.mTitle = template.find(".mTitle");
        el.mProfile = template.find(".mProfile");
        el.mBlock = template.find(".mBlock");
        el.mUnit = template.find(".mUnit");
        el.mObject = template.find(".mObject");
        el.mDataField = template.find(".mDataField");
        el.mObjectToCompare = template.find(".mObjectToCompare");
        el.mDataFieldToCompare = template.find(".mDataFieldToCompare");
        el.mRATemperature = template.find(".mRATemperature");
        el.mValveOutput = template.find(".mValveOutput");
        el.mThresholdRangeFrom = template.find(".mThresholdRangeFrom");
        el.mThresholdRangeTo = template.find(".mThresholdRangeTo");
        el.mDateRange = template.find(".mDateRange");
        el.mChartType = template.find(".mChartType");
        el.mSetPoint = template.find(".mSetPoint");
        el.mNotInAhuProfile = template.find(".not-in-ahu-profile");

        el.mProfile.select2({
            placeholder: 'Please select a chart profile',
            allowClear: true
        });
        el.mBlock.select2({
            placeholder: 'Please select a block',
            allowClear: true
        });
        el.mUnit.select2({
            placeholder: 'Please select a unit',
            allowClear: true
        });
        el.mObject.select2({
            placeholder: 'Please select an object',
            allowClear: true
        });
        el.mDataField.select2({
            placeholder: 'Please select a data field',
            allowClear: true
        });
        el.mObjectToCompare.select2({
            placeholder: 'Please select an object to compare',
            allowClear: true
        });
        el.mDataFieldToCompare.select2({
            placeholder: 'Please select a data field to compare',
            allowClear: true
        });
        el.mRATemperature.select2({
            placeholder: 'Please select a data field',
            allowClear: true
        });
        el.mValveOutput.select2({
            placeholder: 'Please select another data field',
            allowClear: true
        });
        el.mDateRange.daterangepicker({
            linkedCalendars: false,
            locale: {
                format: 'YYYY-MM-DD'
            },
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
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
            separator: '-'
        });
        el.mChartType.select2({
            placeholder: 'Please select a chart type',
            allowClear: true
        });

        el.mTitle.on("input", function () {
            Local.Validate(el.optionMenu);
        });
        el.mDateRange.on("show.daterangepicker", function (ev, picker) {
            !picker.endDate && (picker.endDate = new Date());
            picker.rightCalendar.month = moment(picker.endDate);
        });
        el.mBlock.on("change", function () {
            var pro = el.mProfile.val();
            if (pro != 'onoff') {
                el.mObject.html('<option></option>').trigger("change");
                el.mDataField.html('<option></option>').trigger("change");
                el.mObjectToCompare.html('<option></option>').trigger("change");
                el.mDataFieldToCompare.html('<option></option>').trigger("change");
                var block = $(this).val();
                var unit = el.mUnit.val();
                var model = { BlockId: block, Unit: unit };
                var displayProfile = el.mProfile.val();
                if (displayProfile && displayProfile == 'temperature') {
                    if (block && unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/Object",
                            contentType: "application/json",
                            data: JSON.stringify({ BlockId: block, Unit: unit }),
                            dataType: "json",
                            success: function (res) {
                                el.mObject.select2({
                                    data: res,
                                    placeholder: 'Please select an object',
                                });
                                el.mObjectToCompare.select2({
                                    data: res,
                                    placeholder: 'Please select an object to compare',
                                });
                            },
                            error: function () { }
                        });
                    }
                } else {
                    if (block) {
                        $.ajax({
                            type: "POST",
                            url: "/api/Object",
                            contentType: "application/json",
                            data: JSON.stringify({ BlockId: block }),
                            dataType: "json",
                            success: function (res) {
                                el.mObject.select2({
                                    data: res,
                                    placeholder: 'Please select an object',
                                });
                                el.mObjectToCompare.select2({
                                    data: res,
                                    placeholder: 'Please select an object',
                                });
                            },
                            error: function () { }
                        });
                    }
                }
                Local.Validate(el.optionMenu);
            }
        });
        el.mUnit.on("change", function () {
            el.mObject.html('<option></option>').trigger("change");
            el.mDataField.html('<option></option>').trigger("change");
            el.mObjectToCompare.html('<option></option>').trigger("change");
            el.mDataFieldToCompare.html('<option></option>').trigger("change");
            var unit = $(this).val();
            var block = el.mBlock.val();
            var model = { BlockId: block, Unit: unit }
            if (model.BlockId && model.Unit) {
                $.ajax({
                    type: "POST",
                    url: "/api/Object",
                    contentType: "application/json",
                    data: JSON.stringify(model),
                    dataType: "json",
                    success: function (res) {
                        el.mObject.select2({
                            data: res,
                            placeholder: 'Please select an object',
                        });
                        el.mObjectToCompare.select2({
                            data: res,
                            placeholder: 'Please select an object to compare',
                        });
                    },
                    error: function () { }
                });
            }
            Local.Validate(el.optionMenu);
        });
        el.mObject.on("change", function () {
            el.mDataField.html('<option></option>').trigger("change");
            el.mDataFieldToCompare.html('<option></option>').trigger("change");
            el.mRATemperature.html('<option></option>').trigger("change");
            el.mValveOutput.html('<option></option>').trigger("change");
            var objectId = $(this).val();
            var blockId = el.mBlock.val();
            var unit = el.mUnit.val();
            var model = { BlockId: blockId, ObjectId: objectId, Unit: unit }
            var displayProfile = el.mProfile.val();
            if (displayProfile && displayProfile == "temperature") {
                if (model.BlockId && model.ObjectId && model.Unit) {
                    $.ajax({
                        type: "POST",
                        url: "/api/DataField",
                        contentType: "application/json",
                        data: JSON.stringify({ BlockId: blockId, ObjectId: objectId, Unit: unit }),
                        dataType: "json",
                        success: function (res) {
                            el.mDataField.select2({
                                data: res,
                                placeholder: 'Please select a data field',
                            });
                            el.mDataFieldToCompare.select2({
                                data: res,
                                placeholder: 'Please select a data field to compare',
                            });
                        },
                        error: function () { }
                    });
                }
            } else {
                if (model.BlockId && model.ObjectId) {
                    $.ajax({
                        type: "POST",
                        url: "/api/DataField",
                        contentType: "application/json",
                        data: JSON.stringify({ BlockId: blockId, ObjectId: objectId }),
                        dataType: "json",
                        success: function (res) {
                            el.mDataField.select2({
                                data: res,
                                placeholder: 'Please select a data field',
                            });
                            el.mDataFieldToCompare.select2({
                                data: res,
                                placeholder: 'Please select a data field to compare',
                            });
                            el.mRATemperature.select2({
                                data: res,
                                placeholder: 'Please select a RA Temperature',
                            });
                            el.mValveOutput.select2({
                                data: res,
                                placeholder: 'Please select a valve output',
                            });
                        },
                        error: function () { }
                    });
                }
            }
            Local.Validate(el.optionMenu);
        });
        el.mProfile.on("change", function () {
            var elm = $(this);
            var val = elm.val();
            switch (val) {
                case 'plain':
                    el.ahuProfile.hide();
                    el.plainProfile.show();
                    el.temperatureProfile.hide();
                    el.mNotInAhuProfile.show();
                    break;
                case 'temperature':
                    el.ahuProfile.hide();
                    el.plainProfile.hide();
                    el.mNotInAhuProfile.show();
                    el.temperatureProfile.show();
                    break;
                case 'heatmap':
                    el.ahuProfile.hide();
                    el.plainProfile.hide();
                    el.mNotInAhuProfile.show();
                    el.temperatureProfile.hide();
                    break;
                case 'ahu':
                    el.ahuProfile.show();
                    el.plainProfile.hide();
                    el.mNotInAhuProfile.hide();
                    el.temperatureProfile.hide();
                    break;
                case 'onoff':
                    el.ahuProfile.hide();
                    el.plainProfile.hide();
                    el.mNotInAhuProfile.show();
                    el.temperatureProfile.hide();
                    //el.mObject.html("<option></option>");
                    //el.mDataField.html("<option></option>");
                    $http.get("/api/setupapi/onoffobjectdatafield").then(function (res) {
                        var data = res.data.model;
                        //el.mObject.val(data.ObjectId).trigger("change");
                        //el.mDataField.val(data.DataFieldId).trigger("change");
                        //
                        //
                        el.mObject.select2({
                            data: [{ id: res.data.model.ObjectId, text: res.data.model.ObjectId }],
                            placeholder: 'Please select an object',
                            allowClear: true
                        });
                        el.mObject.val(res.data.model.ObjectId).trigger("change");
                        el.mDataField.select2({
                            data: [{ id: res.data.model.DataFieldId, text: res.data.model.DataFieldId }],
                            placeholder: 'Please select a data field',
                            allowClear: true
                        });
                        el.mDataField.val(res.data.model.DataFieldId).trigger("change");
                    });
                    break;
                default:
                    el.ahuProfile.hide();
                    el.plainProfile.show();
                    el.mNotInAhuProfile.show();
                    el.temperatureProfile.hide();
                    break;
            }
            Local.Validate(el.optionMenu);
        });
        el.mObjectToCompare.on("change", function () {
            el.mDataFieldToCompare.html('<option></option>').trigger("change");
            var objectId = $(this).val();
            var blockId = el.mBlock.val();
            var unit = el.mUnit.val();
            var model = { BlockId: blockId, ObjectId: objectId, Unit: unit }
            var displayProfile = el.mProfile.val();
            if (displayProfile && displayProfile == "temperature") {
                if (model.BlockId && model.ObjectId && model.Unit) {
                    $.ajax({
                        type: "POST",
                        url: "/api/DataField",
                        contentType: "application/json",
                        data: JSON.stringify(model),
                        dataType: "json",
                        success: function (res) {
                            el.mDataFieldToCompare.select2({
                                data: res,
                                placeholder: 'Select Data Field',
                            });
                        },
                        error: function () { }
                    });
                }
            } else {
                if (model.BlockId && model.ObjectId) {
                    $.ajax({
                        type: "POST",
                        url: "/api/DataField",
                        contentType: "application/json",
                        data: JSON.stringify(model),
                        dataType: "json",
                        success: function (res) {
                            el.mDataFieldToCompare.select2({
                                data: res,
                                placeholder: 'Select Data Field',
                            });
                        },
                        error: function () { }
                    });
                }
            }
            Local.Validate(el.optionMenu);
        });
        el.mDataField.on("change", function () {
            Local.Validate(el.optionMenu);
        });
        el.mChartType.on("change", function () {
            Local.Validate(el.optionMenu);
        });
        el.mDataFieldToCompare.on("change", function () {
            Local.Validate(el.optionMenu);
        });
        el.mThresholdRangeFrom.on('keyup', function () {
            if (isNaN(this.value)) {
                this.value = "";
            }
        });
        el.mThresholdRangeTo.on('keyup', function () {
            if (isNaN(this.value)) {
                this.value = "";
            }
        });
        el.mSetPoint.on('keyup', function () {
            if (isNaN(this.value)) {
                this.value = "";
            }
        });
        el.mDateRange.on("change", function () {
            Local.Validate(el.optionMenu);
        });
        el.option.on("click", function () {
            var collapsed = $(this).closest(".box-tools").find(".chart-toggle").hasClass("collapsed");
            if (!collapsed) {
                Local.Validate(el.optionMenu);
                $(this).closest(".box").find(".option-menu").toggleClass("active");
            }
        });
        el.toggle.on("click", function () {
            var elm = $(this);
            var collapsed = elm.hasClass("collapsed");
            if (collapsed) {
                elm.removeClass("collapsed").html('<i class="fa fa-minus"></i>');
                elm.closest(".box").find(".box-body").slideDown("slow");
            } else {
                template.find(".option-menu").hasClass("active") && template.find(".option-menu").removeClass("active");
                elm.addClass("collapsed").html('<i class="fa fa-plus"></i>');
                elm.closest(".box").find(".box-body").slideUp("slow");
            }

        });
        el.remove.on("click", function () {
            $(this).closest(".box").remove();
            if (el.mId.val()) {
                Local.Widget.Remove({
                    model: {
                        id: el.mId.val()
                    },
                    success: function (removeResponse) {
                        console.log('removed!');
                    }
                });
            }
        });
        el.generate.on("click", function () {

            var mDateFlag = "";
            var model = {
                mId: el.mId.val(),
                mTitle: el.mTitle.val(),
                mBlock: el.mBlock.val(),
                mDateFlag: mDateFlag,
                mDateRange: el.mDateRange.val(),
                mChartType: el.mChartType.val(),
                mProfile: el.mProfile.val(),

                //ahu profile
                mRATemperature: el.mRATemperature.val(),
                mValveOutput: el.mValveOutput.val(),
                mSetPoint: el.mSetPoint.val(),
                mThresholdRangeFrom: el.mThresholdRangeFrom.val(),
                mThresholdRangeTo: el.mThresholdRangeTo.val(),

                //temperature profile
                mUnit: el.mUnit.val(),
                mObject: el.mObject.val(),
                mObjectToCompare: el.mObjectToCompare.val(),
                mDataField: el.mDataField.val(),
                mDataFieldToCompare: el.mDataFieldToCompare.val(),
            };

            var range = model.mDateRange;
            var title = model.mTitle;
            range = range ? range.trim() : range;
            var ranges = range.split('-');
            ranges[0] = ranges[0] && ranges[1] && ranges[2] ? ranges[0].trim() + "-" + ranges[1].trim() + "-" + ranges[2].trim() : moment().format("YYYY-MM-DD")
            ranges[1] = ranges[3] && ranges[4] && ranges[5] ? ranges[3].trim() + "-" + ranges[4].trim() + "-" + ranges[5].trim() : moment().format("YYYY-MM-DD")

            var today = [
              moment().format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD")];
            var yesterday = [
              moment().add(-1, 'days').format("YYYY-MM-DD"),
              moment().add(-1, 'days').format("YYYY-MM-DD")];
            var thisweek = [
              moment().startOf('isoweek').isoWeekday(1).format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD")];
            var lastweek = [
              moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("YYYY-MM-DD"),
              moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("YYYY-MM-DD")];
            var thismonth = [
              moment().date(1).format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD")];
            var lastmonth = [
              moment().subtract(1, 'months').date(1).format("YYYY-MM-DD"),
              moment().date(1).subtract(1, 'days').format("YYYY-MM-DD")];

            if (ranges[0] == today[0] && ranges[1] == today[1]) {
                model.mDateFlag = "today";
            } else if (ranges[0] == yesterday[0] && ranges[1] == yesterday[1]) {
                model.mDateFlag = "yesterday";
            } else if (ranges[0] == thisweek[0] && ranges[1] == thisweek[1]) {
                model.mDateFlag = "thisweek";
            } else if (ranges[0] == lastweek[0] && ranges[1] == lastweek[1]) {
                model.mDateFlag = "lastweek";
            } else if (ranges[0] == thismonth[0] && ranges[1] == thismonth[1]) {
                model.mDateFlag = "thismonth";
            } else if (ranges[0] == lastmonth[0] && ranges[1] == lastmonth[1]) {
                model.mDateFlag = "lastmonth";
            } else {
                model.mDateFlag = "custom";
            }
            if (model.mProfile) {
                which(
                    model.mProfile == 'plain',
                    function () {
                        if (!model.mTitle) {
                            alert("Please Enter a Title");
                            return;
                        } else if (!model.mProfile) {
                            alert("Please select a display type.");
                            return;
                        } else if (!model.mBlock) {
                            alert("Please select a block.");
                            return;
                        } else if (!model.mObject) {
                            alert("Please select an object.");
                            return;
                        } else if (!model.mDataField) {
                            alert("Please select a data field.");
                            return;
                        } else if (!model.mDateRange) {
                            alert("please select a date range.");
                            return;
                        } else if (!model.mChartType) {
                            alert("Please select a chart type.");
                            return;
                        } else {
                            el.mask.show();
                            el.optionMenu.removeClass("active");
                            Local.Widget.Reading({
                                model: {
                                    blockId: model.mBlock,
                                    objectId: model.mObject,
                                    dateFlag: el.mDateRange.val(),
                                    dataFieldId: model.mDataField,
                                },
                                success: function (res) {
                                    var data, name, raw, len, type;

                                    data = [];
                                    raw = res.data;
                                    len = raw.length;
                                    type = model.mChartType;
                                    name = model.mObject + " " + model.mDataField;

                                    for (var i = 0; i < len; i++) {
                                        data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                    }

                                    if (model.mDateFlag != "custom") {
                                        which(
                                        model.mId,
                                        function () {
                                            Local.Widget.Update({
                                                model: {
                                                    id: model.mId,
                                                    blockId: model.mBlock,
                                                    objectId: model.mObject,
                                                    dateFlag: model.mDateFlag,
                                                    chartType: model.mChartType,
                                                    chartTitle: model.mTitle,
                                                    dataFieldId: model.mDataField,
                                                    displayProfile: model.mProfile,
                                                },
                                                success: function (updateResponse) {
                                                    console.log('updated!');
                                                }
                                            });
                                        },
                                        function () {
                                            Local.Widget.Create({
                                                model: {
                                                    id: model.mId,
                                                    order: template.index() + 1,
                                                    menuId: menuId,
                                                    menuFkId: menuId,
                                                    blockId: model.mBlock,
                                                    objectId: model.mObject,
                                                    dateFlag: model.mDateFlag,
                                                    chartType: model.mChartType,
                                                    chartTitle: model.mTitle,
                                                    dataFieldId: model.mDataField,
                                                    displayProfile: model.mProfile,
                                                },
                                                success: function (createResponse) {
                                                    if (createResponse.data.id) {
                                                        console.log('created!');
                                                        el.mId.val(createResponse.data.id);
                                                    } else {
                                                        alert('create error!');
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    el.mask.hide();
                                    Local.Widget.Draw(function (config) {
                                        config.chart.title = { text: title };
                                        config.series.push({
                                            name: name,
                                            data: data
                                        });
                                        config.chart.type = type;
                                        config.elm = el.chart;
                                        config.tooltip = {
                                            formatter: function () {
                                                var totip = '' +
                                                         '<b>  ' + this.series.name + '<b><br/>' +
                                                         '<span> time : ' + moment(this.point.x).utc().format("YYYY-MM-DD hh:mm A") + '</span><br/>' +
                                                         '<span> value : ' + this.point.y.toFixed(2) + '</span><br/>';
                                                return totip;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    function () {
                        which(
                          model.mProfile == 'heatmap',
                          function () {
                              if (!model.mTitle) {
                                  alert("Please Enter a Title");
                                  return;
                              } else if (!model.mProfile) {
                                  alert("Please select a display type.");
                                  return;
                              } else if (!model.mBlock) {
                                  alert("Please select a block.");
                                  return;
                              } else if (!model.mObject) {
                                  alert("Please select an object.");
                                  return;
                              } else if (!model.mDataField) {
                                  alert("Please select a data field.");
                                  return;
                              } else if (!model.mDateRange) {
                                  alert("please select a date range.");
                                  return;
                              } else {
                                  el.mask.show();
                                  el.optionMenu.removeClass("active");
                                  Local.Widget.HeatMapReading({
                                      model: {
                                          blockId: model.mBlock,
                                          objectId: model.mObject,
                                          dateFlag: model.mDateRange,
                                          dataFieldId: model.mDataField,
                                      },
                                      success: function (res) {
                                          var raw, len, xcat, ycat, series;
                                          xcat = [];
                                          ycat = [];
                                          series = [];
                                          raw = res.data;
                                          len = raw.length;
                                          series.push({
                                              data: [],
                                              dataLabels: {
                                                  enabled: false,
                                                  color: '#000000'
                                              },
                                              name: model.mObject + " " + model.mDataField
                                          });

                                          for (var i = 0; i < len ; i++) {
                                              xcat.push(moment(i, "hh").format("hh:mm A"));
                                              ycat.push(moment(raw[i].yc, "DD-MM-YYYY").format("YYYY-MM-DD"));
                                              series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                          }
                                          if (model.mDateFlag != "custom") {
                                              which(
                                              model.mId,
                                              function () {
                                                  Local.Widget.Update({
                                                      model: {
                                                          id: model.mId,
                                                          blockId: model.mBlock,
                                                          objectId: model.mObject,
                                                          dateFlag: model.mDateFlag,
                                                          chartTitle: model.mTitle,
                                                          dataFieldId: model.mDataField,
                                                          displayProfile: model.mProfile,
                                                      },
                                                      success: function (updateResponse) {
                                                          console.log('updated!');
                                                      }
                                                  });
                                              },
                                              function () {
                                                  Local.Widget.Create({
                                                      model: {
                                                          id: model.id,
                                                          order: template.index() + 1,
                                                          menuId: menuId,
                                                          menuFkId: menuId,
                                                          blockId: model.mBlock,
                                                          objectId: model.mObject,
                                                          dateFlag: model.mDateFlag,
                                                          chartType: model.mChartType,
                                                          chartTitle: model.mTitle,
                                                          dataFieldId: model.mDataField,
                                                          displayProfile: model.mProfile,
                                                      },
                                                      success: function (createResponse) {
                                                          if (createResponse.data.id) {
                                                              console.log('created!');
                                                              el.mId.val(createResponse.data.id);
                                                          } else {
                                                              alert('create error!');
                                                          }
                                                      }
                                                  });
                                              });
                                          }
                                          el.mask.hide();
                                          Local.Widget.Draw(function (config) {
                                              config.xAxis = {
                                                  title: {
                                                      text: "Hour"
                                                  },
                                                  tickInterval: 1,
                                                  categories: xcat
                                              };
                                              config.yAxis = {
                                                  title: {
                                                      text: "Date"
                                                  },
                                                  categories: ycat
                                              };
                                              config.chart = {
                                                  title: { text: title },
                                                  type: 'heatmap',
                                                  marginTop: 40,
                                                  marginBottom: 80,
                                                  plotBorderWidth: 0
                                              };
                                              config.legend = {
                                                  align: 'right',
                                                  layout: 'vertical',
                                                  margin: 0,
                                                  verticalAlign: 'top',
                                                  y: 25,
                                                  symbolHeight: 280
                                              };
                                              config.tooltip = {
                                                  formatter: function () {
                                                      return '<b> ' + this.series.name + ' </b><br/>' +
                                                               '<span> time : ' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</span><br>' +
                                                               '<span>value : ' + this.point.value.toFixed(2) + ' \"C </span>';
                                                  }
                                              };
                                              config.series = series;
                                              config.colorAxis = {
                                                  min: 0,
                                                  minColor: '#FDF7B9',
                                                  maxColor: '#C4463A'
                                              };
                                              config.elm = el.chart;
                                          });
                                      }
                                  });
                              }
                          },
                          function () {
                              which(
                                  model.mProfile == 'ahu',
                                  function () {
                                      if (!model.mTitle) {
                                          alert("Please Enter a Title");
                                          return;
                                      } else if (!model.mProfile) {
                                          alert("Please select a display type.");
                                          return;
                                      } else if (!model.mBlock) {
                                          alert("Please select a block.");
                                          return;
                                      } else if (!model.mObject) {
                                          alert("Please select an object.");
                                          return;
                                      } else if (!model.mRATemperature) {
                                          alert("Please select ra temperature.");
                                          return;
                                      } else if (!model.mValveOutput) {
                                          alert("Please select valve output.");
                                          return;
                                      } else if (!model.mDateRange) {
                                          alert("please select a date range.");
                                          return;
                                      } else {
                                          el.mask.show();
                                          el.optionMenu.removeClass("active");
                                          Local.Widget.ahuProfileReading({
                                              model: {
                                                  blockId: model.mBlock,
                                                  objectId: model.mObject,
                                                  dateFlag: model.mDateRange,
                                                  raTemperature: model.mRATemperature,
                                                  valveOutput: model.mValveOutput,
                                              },
                                              success: function (res) {
                                                  var raw = [],
                                                      name = '',
                                                      series = [],
                                                      VOTotalCount = 0,
                                                      VOCount = 0,
                                                      RATTotalCount = 0,
                                                      RATCount = 0;

                                                  series[0] = {};
                                                  series[0].type = "column";
                                                  series[0].name = model.mValveOutput;
                                                  series[0].data = [];
                                                  raw = res.data.s2;
                                                  VOTotalCount = raw.length;
                                                  for (var i = 0; i < VOTotalCount; i++) {
                                                      var vovalue = raw[i].value;
                                                      if (vovalue < model.mThresholdRangeFrom || vovalue > model.mThresholdRangeTo) {
                                                          VOCount = VOCount + 1;
                                                      }
                                                      series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), vovalue]);
                                                  }

                                                  series[1] = {};
                                                  series[1].type = "line";
                                                  series[1].color = "#00C0EF";
                                                  series[1].marker = {
                                                      enabled: true,
                                                      symbol: "circle",
                                                      radius: 6,
                                                  };
                                                  series[1].name = model.mRATemperature;
                                                  series[1].data = [];
                                                  raw = res.data.s1;
                                                  RATTotalCount = raw.length;
                                                  for (var i = 0; i < RATTotalCount; i++) {
                                                      var ravalue = raw[i].value;
                                                      if (ravalue > model.mSetPoint) {
                                                          RATCount = RATCount + 1;
                                                      }
                                                      series[1].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), ravalue]);
                                                  }

                                                  series[2] = {};
                                                  series[2].type = "line";
                                                  series[2].data = [];
                                                  series[2].color = "#F39C12";
                                                  series[2].name = "temperature set point";

                                                  if (model.mDateFlag != "custom") {
                                                      which(
                                                      model.mId,
                                                      function () {
                                                          Local.Widget.Update({
                                                              model: {
                                                                  id: model.mId,
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateFlag,
                                                                  chartTitle: model.mTitle,
                                                                  displayProfile: model.mProfile,
                                                                  RATemperature: model.mRATemperature,
                                                                  ValveOutput: model.mValveOutput,
                                                                  ThresholdRangeFrom: model.mThresholdRangeFrom,
                                                                  ThresholdRangeTo: model.mThresholdRangeTo,
                                                                  TemperatureSetPoint: model.mSetPoint
                                                              },
                                                              success: function (updateResponse) {
                                                                  console.log('updated!');
                                                              }
                                                          });
                                                      },
                                                      function () {
                                                          Local.Widget.Create({
                                                              model: {
                                                                  id: model.mId,
                                                                  order: template.index() + 1,
                                                                  menuId: menuId,
                                                                  menuFkId: menuId,
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateFlag,
                                                                  chartType: model.mChartType,
                                                                  chartTitle: model.mTitle,
                                                                  displayProfile: model.mProfile,
                                                                  RATemperature: model.mRATemperature,
                                                                  ValveOutput: model.mValveOutput,
                                                                  ThresholdRangeFrom: model.mThresholdRangeFrom,
                                                                  ThresholdRangeTo: model.mThresholdRangeTo,
                                                                  TemperatureSetPoint: model.mSetPoint
                                                              },
                                                              success: function (createResponse) {
                                                                  if (createResponse.data.id) {
                                                                      console.log('created!');
                                                                      el.mId.val(createResponse.data.id);
                                                                  } else {
                                                                      alert('create error!');
                                                                  }
                                                              }
                                                          });
                                                      });
                                                  }
                                                  el.mask.hide();
                                                  Local.Widget.Draw(function (config) {
                                                      delete config.yAxis.min;
                                                      config.series = series;
                                                      config.chart.title = { text: title };
                                                      config.chart.spacingBottom = 50;
                                                      config.chart.events = {
                                                          load: function () {
                                                              var RATPer = "..", VOPer = "..";
                                                              if (RATCount > 0 && RATTotalCount > 0) {
                                                                  RATPer = ((RATCount * 100) / RATTotalCount).toFixed(2);
                                                              }
                                                              if (VOCount > 0 && VOTotalCount > 0) {
                                                                  VOPer = ((VOCount * 100) / VOTotalCount).toFixed(2);
                                                              }

                                                              var label = this.renderer
                                                                  .label("RA Tempareture above set point (%) = " + RATPer + " <br/>Valve Output out of thresold (%) = " + VOPer)
                                                                  .css({
                                                                      display: 'inline-block',
                                                                      color: '#222',
                                                                      fontSize: '12px',
                                                                      fontWeight: 'bold',
                                                                      marginBottom: "20px",
                                                                  })
                                                                  .attr({
                                                                      'stroke': 'silver',
                                                                      'stroke-width': 0,
                                                                      'r': 3,
                                                                      'padding': 10
                                                                  })
                                                                  .add();
                                                              label.align(Highcharts.extend(label.getBBox(), {
                                                                  align: 'left',
                                                                  x: 0,
                                                                  verticalAlign: 'bottom',
                                                                  y: 40
                                                              }), null, 'spacingBox');

                                                          }
                                                      };
                                                      config.elm = el.chart;
                                                      config.plotOptions = {
                                                          line: {
                                                              dataLabels: {
                                                                  enabled: false
                                                              },
                                                              marker: {
                                                                  enabled: false
                                                              }
                                                          }
                                                      };
                                                      config.tooltip = {
                                                          formatter: function () {
                                                              return '<b>' + this.series.name + '</b><br><b>time : ' + moment(this.x).utc().format("YYYY-MM-DD hh:mm A") + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                          }
                                                      };
                                                      config.yAxis.plotLines = [{
                                                          value: model.mSetPoint,
                                                          width: 2,
                                                          color: '#F39C12',
                                                          zIndex: 5
                                                      }];
                                                  });
                                              }
                                          });
                                      }
                                  },
                                  function () {
                                      which(
                                          model.mProfile == 'onoff',
                                          function () {
                                              el.mask.show();
                                              el.optionMenu.removeClass("active");
                                              $http.post("/api/widgetdata/onoffprofiledata", {
                                                  blockId: model.mBlock,
                                                  objectId: model.mObject,
                                                  dateFlag: model.mDateRange,
                                                  dataFieldId: model.mDataField,
                                              }).then(function (res) {
                                                  var len, xcat, ycat, series, seriesData;
                                                  xcat = [];
                                                  ycat = [];
                                                  series = [];
                                                  len = res.data.length;
                                                  seriesData = [];

                                                  for (var i = 0; i < len ; i++) {
                                                      xcat.push(moment(i, "hh").format("hh:mm A"));
                                                      ycat.push(moment(res.data[i].yc, "DD-MM-YYYY").format("YYYY-MM-DD"));
                                                      seriesData.push([res.data[i].y, res.data[i].x, res.data[i].p]);
                                                  }
                                                  console.log(seriesData);
                                                  series.push({
                                                      data: seriesData,
                                                      dataLabels: {
                                                          enabled: false,
                                                          color: '#000000'
                                                      },
                                                      name: model.mObject + " " + model.mDataField
                                                  });
                                                  console.log(series);

                                                  if (model.mDateFlag != "custom") {
                                                      which(
                                                      model.mId,
                                                      function () {
                                                          Local.Widget.Update({
                                                              model: {
                                                                  id: model.mId,
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateFlag,
                                                                  chartTitle: model.mTitle,
                                                                  dataFieldId: model.mDataField,
                                                                  displayProfile: model.mProfile,
                                                              },
                                                              success: function (updateResponse) {
                                                                  console.log('updated!');
                                                              }
                                                          });
                                                      },
                                                      function () {
                                                          Local.Widget.Create({
                                                              model: {
                                                                  id: model.id,
                                                                  order: template.index() + 1,
                                                                  menuId: menuId,
                                                                  menuFkId: menuId,
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateFlag,
                                                                  chartType: model.mChartType,
                                                                  chartTitle: model.mTitle,
                                                                  dataFieldId: model.mDataField,
                                                                  displayProfile: model.mProfile,
                                                              },
                                                              success: function (createResponse) {
                                                                  if (createResponse.data.id) {
                                                                      console.log('created!');
                                                                      el.mId.val(createResponse.data.id);
                                                                  } else {
                                                                      alert('create error!');
                                                                  }
                                                              }
                                                          });
                                                      });
                                                  }
                                                  el.mask.hide();
                                                  Local.Widget.Draw(function (config) {
                                                      console.log(config);
                                                      config.xAxis = {
                                                          title: {
                                                              text: "Hour"
                                                          },
                                                          tickInterval: 1,
                                                          categories: xcat
                                                      };
                                                      config.yAxis = {
                                                          title: {
                                                              text: "Date"
                                                          },
                                                          categories: ycat
                                                      };
                                                      config.chart = {
                                                          title: { text: title },
                                                          type: 'heatmap',
                                                          marginTop: 30,
                                                          marginBottom: 50,
                                                          plotBorderWidth: 1
                                                      };
                                                      config.legend = {
                                                          align: 'right',
                                                          layout: 'vertical',
                                                          margin: 0,
                                                          verticalAlign: 'top',
                                                          y: 25,
                                                          symbolHeight: 280
                                                      };
                                                      config.tooltip = {
                                                          formatter: function () {
                                                              return '<b> ' + this.series.name + ' </b><br/>' +
                                                                       '<span> time : ' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</span><br>' +
                                                                       '<span>value : ' + this.point.value.toFixed(2) + ' \"C </span>';
                                                          }
                                                      };
                                                      config.series = series;
                                                      config.colorAxis = {
                                                          min: 0,
                                                          minColor: '#FDF7B9',
                                                          maxColor: '#C4463A'
                                                      };
                                                      config.elm = el.chart;

                                                      console.log(el.chart)
                                                  });
                                              });
                                          },
                                          function () {
                                              if (!model.mTitle) {
                                                  alert("Please Enter a Title");
                                                  return;
                                              }
                                              else if (!model.mProfile) {
                                                  alert("Please select a display type.");
                                                  return;
                                              } else if (!model.mBlock) {
                                                  alert("Please select a block.");
                                                  return;
                                              } else if (!model.mUnit) {
                                                  alert("Please select a unit.");
                                                  return;
                                              } else if (!model.mObject) {
                                                  alert("Please select an object.");
                                                  return;
                                              } else if (!model.mObjectToCompare) {
                                                  alert("Please select an object to compare.");
                                                  return;
                                              } else if (!model.mDataField) {
                                                  alert("Please select a data field.");
                                                  return;
                                              } else if (!model.mDataFieldToCompare) {
                                                  alert("Please select a data field to compare.");
                                                  return;
                                              } else if (!model.mDateRange) {
                                                  alert("please select a date range.");
                                                  return;
                                              } else {
                                                  el.mask.show();
                                                  el.optionMenu.removeClass("active");
                                                  Local.Widget.TemperatureProfileReading({
                                                      model: {
                                                          blockId: model.mBlock,
                                                          objectId: model.mObject,
                                                          dateFlag: model.mDateRange,
                                                          dataFieldId: model.mDataField,
                                                          objectToCompareId: model.mObjectToCompare,
                                                          dataFieldToCompareId: model.mDataFieldToCompare,
                                                      },
                                                      success: function (res) {
                                                          var series = [],
                                                            name = '',
                                                            raw = [];
                                                          series[0] = {};
                                                          series[0].name = model.mObject + " " + model.mDataField;
                                                          series[0].data = [];
                                                          raw = res.data.s1;
                                                          for (var i = 0; i < raw.length; i++) {
                                                              series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                          }
                                                          series[1] = {};
                                                          series[1].name = model.mObjectToCompare + " " + model.mDataFieldToCompare;
                                                          series[1].data = [];
                                                          raw = res.data.s2;
                                                          for (var i = 0; i < raw.length; i++) {
                                                              series[1].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                          }
                                                          series[2] = {};
                                                          series[2].dashStyle = 'shortdash';
                                                          series[2].name = "delta";
                                                          series[2].data = [];
                                                          raw = res.data.s3;
                                                          for (var i = 0; i < raw.length; i++) {
                                                              series[2].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                          }
                                                          if (model.mDateFlag != "custom") {
                                                              which(
                                                              model.mId,
                                                              function () {
                                                                  Local.Widget.Update({
                                                                      model: {
                                                                          id: model.mId,
                                                                          blockId: model.mBlock,
                                                                          objectId: model.mObject,
                                                                          dateFlag: model.mDateFlag,
                                                                          chartTitle: model.mTitle,
                                                                          dataFieldId: model.mDataField,
                                                                          displayProfile: model.mProfile,
                                                                          objectToCompareId: model.mObjectToCompare,
                                                                          dataFieldToCompareId: model.mDataFieldToCompare,
                                                                      },
                                                                      success: function (updateResponse) {
                                                                          console.log('updated!');
                                                                      }
                                                                  });
                                                              },
                                                              function () {
                                                                  Local.Widget.Create({
                                                                      model: {
                                                                          id: model.mId,
                                                                          order: template.index() + 1,
                                                                          menuId: menuId,
                                                                          menuFkId: menuId,
                                                                          blockId: model.mBlock,
                                                                          objectId: model.mObject,
                                                                          dateFlag: model.mDateFlag,
                                                                          chartType: model.mChartType,
                                                                          chartTitle: model.mTitle,
                                                                          dataFieldId: model.mDataField,
                                                                          displayProfile: model.mProfile,
                                                                          objectToCompareId: model.mObjectToCompare,
                                                                          dataFieldToCompareId: model.mDataFieldToCompare,
                                                                      },
                                                                      success: function (createResponse) {
                                                                          if (createResponse.data.id) {
                                                                              console.log('created!');
                                                                              el.mId.val(createResponse.data.id);
                                                                          } else {
                                                                              alert('create error!');
                                                                          }
                                                                      }
                                                                  });
                                                              });
                                                          }
                                                          el.mask.hide();
                                                          Local.Widget.Draw(function (config) {
                                                              delete config.yAxis.min;
                                                              config.series = series;
                                                              config.chart.type = 'line';
                                                              config.chart.title = { text: title };
                                                              config.elm = el.chart;
                                                              config.plotOptions = {
                                                                  line: {
                                                                      dataLabels: {
                                                                          enabled: false
                                                                      },
                                                                      marker: {
                                                                          enabled: false
                                                                      }
                                                                  }
                                                              };
                                                              config.tooltip = {
                                                                  formatter: function () {
                                                                      return '<b>' + this.series.name + '</b><br><b>time : ' + moment(this.x).utc().format("YYYY-MM-DD hh:mm A") + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                                  }
                                                              };
                                                          });
                                                      }
                                                  });
                                              }
                                          });
                                  });
                          });
                    });
            } else {
                alert("Please select a display profile.")
            }
        });
        el.cancel.on("click", function () {
            el.option.trigger("click");
        });
        $(".container").append(template);
        $timeout(function () {
            var count = $(".container").children().length;
            if (count > 1) {
                $window.scrollBy(0, 676 + (580 * (count - 2)) - $window.scrollY)
            }
        });
    };

    Local.Widget.Render = function (option) {
        option.data.forEach(function (widgetPreset) {
            var el = {};
            var template = $($("#template").html());
            el.mask = template.find(".loading-mask");
            el.chart = template.find(".chart-element");
            el.generate = template.find(".chart-create");
            el.option = template.find(".chart-option");
            el.toggle = template.find(".chart-toggle");
            el.remove = template.find(".chart-remove");
            el.cancel = template.find(".chart-cancel");
            el.optionMenu = template.find(".option-menu");

            el.ahuProfile = template.find('.ahu-profile');
            el.plainProfile = template.find('.plain-profile');
            el.temperatureProfile = template.find('.temperature-profile');

            el.mId = template.find(".mId");
            el.mTitle = template.find(".mTitle");
            el.mProfile = template.find(".mProfile");
            el.mBlock = template.find(".mBlock");
            el.mUnit = template.find(".mUnit");
            el.mObject = template.find(".mObject");
            el.mDataField = template.find(".mDataField");
            el.mObjectToCompare = template.find(".mObjectToCompare");
            el.mDataFieldToCompare = template.find(".mDataFieldToCompare");
            el.mRATemperature = template.find(".mRATemperature");
            el.mValveOutput = template.find(".mValveOutput");
            el.mThresholdRangeFrom = template.find(".mThresholdRangeFrom");
            el.mThresholdRangeTo = template.find(".mThresholdRangeTo");
            el.mDateRange = template.find(".mDateRange");
            el.mChartType = template.find(".mChartType");
            el.mSetPoint = template.find(".mSetPoint");
            el.mNotInAhuProfile = template.find(".not-in-ahu-profile");

            el.mProfile.select2({
                placeholder: 'Please select a chart profile',
                allowClear: true
            });
            el.mBlock.select2({
                placeholder: 'Please select a block',
                allowClear: true
            });
            el.mUnit.select2({
                placeholder: 'Please select a unit',
                allowClear: true
            });
            el.mObject.select2({
                placeholder: 'Please select an object',
                allowClear: true
            });
            el.mDataField.select2({
                placeholder: 'Please select a data field',
                allowClear: true
            });
            el.mObjectToCompare.select2({
                placeholder: 'Please select an object to compare',
                allowClear: true
            });
            el.mDataFieldToCompare.select2({
                placeholder: 'Please select a data field to compare',
                allowClear: true
            });
            el.mRATemperature.select2({
                placeholder: 'Please select a data field',
                allowClear: true
            });
            el.mValveOutput.select2({
                placeholder: 'Please select another data field',
                allowClear: true
            });
            el.mDateRange.daterangepicker({
                linkedCalendars: false,
                locale: {
                    format: 'YYYY-MM-DD'
                },
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD"),
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
                separator: '-'
            });
            el.mChartType.select2({
                placeholder: 'Please select a chart type',
                allowClear: true
            });

            el.mTitle.on("input", function () {
                Local.Validate(el.optionMenu);
            });
            el.mDateRange.on("show.daterangepicker", function (ev, picker) {
                !picker.endDate && (picker.endDate = new Date());
                picker.rightCalendar.month = moment(picker.endDate);
            });
            el.mBlock.on("change", function () {
                el.mObject.html('<option></option>').trigger("change");
                el.mDataField.html('<option></option>').trigger("change");
                el.mObjectToCompare.html('<option></option>').trigger("change");
                el.mDataFieldToCompare.html('<option></option>').trigger("change");
                var block = $(this).val();
                var unit = el.mUnit.val();
                var model = { BlockId: block, Unit: unit };
                var displayProfile = el.mProfile.val();
                if (displayProfile && displayProfile == 'temperature') {
                    if (block && unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/Object",
                            contentType: "application/json",
                            data: JSON.stringify({ BlockId: block, Unit: unit }),
                            dataType: "json",
                            success: function (res) {
                                el.mObject.select2({
                                    data: res,
                                    placeholder: 'Please select an object',
                                });
                                el.mObjectToCompare.select2({
                                    data: res,
                                    placeholder: 'Please select an object to compare',
                                });
                                el.mObject.val(widgetPreset.objectId).trigger("change");
                                el.mObjectToCompare.val(widgetPreset.objectToCompareId).trigger("change");
                            },
                            error: function () { }
                        });
                    }
                } else {
                    if (block) {
                        $.ajax({
                            type: "POST",
                            url: "/api/Object",
                            contentType: "application/json",
                            data: JSON.stringify({ BlockId: block }),
                            dataType: "json",
                            success: function (res) {
                                el.mObject.select2({
                                    data: res,
                                    placeholder: 'Please select an object',
                                });
                                el.mObjectToCompare.select2({
                                    data: res,
                                    placeholder: 'Please select an object',
                                });
                                el.mObject.val(widgetPreset.objectId).trigger("change");
                                el.mObjectToCompare.val(widgetPreset.objectToCompareId).trigger("change");
                            },
                            error: function () { }
                        });
                    }
                }
                Local.Validate(el.optionMenu);
            });
            el.mUnit.on("change", function () {
                el.mObject.html('<option></option>').trigger("change");
                el.mDataField.html('<option></option>').trigger("change");
                el.mObjectToCompare.html('<option></option>').trigger("change");
                el.mDataFieldToCompare.html('<option></option>').trigger("change");
                var unit = $(this).val();
                var block = el.mBlock.val();
                var model = { BlockId: block, Unit: unit }
                if (model.BlockId && model.Unit) {
                    $.ajax({
                        type: "POST",
                        url: "/api/Object",
                        contentType: "application/json",
                        data: JSON.stringify(model),
                        dataType: "json",
                        success: function (res) {
                            el.mObject.select2({
                                data: res,
                                placeholder: 'Please select an object',
                            });
                            el.mObjectToCompare.select2({
                                data: res,
                                placeholder: 'Please select an object to compare',
                            });
                            el.mObject.val(widgetPreset.objectId).trigger("change");
                            el.mObjectToCompare.val(widgetPreset.objectToCompareId).trigger("change");
                        },
                        error: function () { }
                    });
                }
                Local.Validate(el.optionMenu);
            });
            el.mObject.on("change", function () {
                el.mDataField.html('<option></option>').trigger("change");
                el.mDataFieldToCompare.html('<option></option>').trigger("change");
                el.mRATemperature.html('<option></option>').trigger("change");
                el.mValveOutput.html('<option></option>').trigger("change");
                var objectId = $(this).val();
                var blockId = el.mBlock.val();
                var unit = el.mUnit.val();
                var model = { BlockId: blockId, ObjectId: objectId, Unit: unit }
                var displayProfile = el.mProfile.val();
                if (displayProfile && displayProfile == "temperature") {
                    if (model.BlockId && model.ObjectId && model.Unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/DataField",
                            contentType: "application/json",
                            data: JSON.stringify({ BlockId: blockId, ObjectId: objectId, Unit: unit }),
                            dataType: "json",
                            success: function (res) {
                                el.mDataField.select2({
                                    data: res,
                                    placeholder: 'Please select a data field',
                                });
                                el.mDataFieldToCompare.select2({
                                    data: res,
                                    placeholder: 'Please select a data field to compare',
                                });
                                el.mDataField.val(widgetPreset.dataFieldId).trigger("change");
                                el.mDataFieldToCompare.val(widgetPreset.dataFieldToCompareId).trigger("change");
                            },
                            error: function () { }
                        });
                    }
                } else {
                    if (model.BlockId && model.ObjectId) {
                        $.ajax({
                            type: "POST",
                            url: "/api/DataField",
                            contentType: "application/json",
                            data: JSON.stringify({ BlockId: blockId, ObjectId: objectId }),
                            dataType: "json",
                            success: function (res) {
                                el.mDataField.select2({
                                    data: res,
                                    placeholder: 'Please select a data field',
                                });
                                el.mDataFieldToCompare.select2({
                                    data: res,
                                    placeholder: 'Please select a data field to compare',
                                });
                                el.mRATemperature.select2({
                                    data: res,
                                    placeholder: 'Please select a ra temperature',
                                });
                                el.mValveOutput.select2({
                                    data: res,
                                    placeholder: 'Please select a valve output',
                                });
                                el.mDataField.val(widgetPreset.dataFieldId).trigger("change");
                                el.mDataFieldToCompare.val(widgetPreset.dataFieldToCompareId).trigger("change");
                                el.mRATemperature.val(widgetPreset.RATemperature).trigger("change");
                                el.mValveOutput.val(widgetPreset.ValveOutput).trigger("change");
                            },
                            error: function () { }
                        });
                    }
                }
                Local.Validate(el.optionMenu);
            });
            el.mProfile.on("change", function () {
                var elm = $(this);
                var val = elm.val();
                switch (val) {
                    case 'plain':
                        el.ahuProfile.hide();
                        el.plainProfile.show();
                        el.temperatureProfile.hide();
                        el.mNotInAhuProfile.show();
                        break;
                    case 'temperature':
                        el.ahuProfile.hide();
                        el.plainProfile.hide();
                        el.mNotInAhuProfile.show();
                        el.temperatureProfile.show();
                        break;
                    case 'heatmap':
                        el.ahuProfile.hide();
                        el.plainProfile.hide();
                        el.mNotInAhuProfile.show();
                        el.temperatureProfile.hide();
                        break;
                    case 'ahu':
                        el.ahuProfile.show();
                        el.plainProfile.hide();
                        el.mNotInAhuProfile.hide();
                        el.temperatureProfile.hide();
                        break;
                    case 'onoff':
                        el.ahuProfile.hide();
                        el.plainProfile.hide();
                        el.mNotInAhuProfile.show();
                        el.temperatureProfile.hide();
                        $http.get("/api/setupapi/onoffobjectdatafield").then(function (res) {
                            var data = res.data.model;
                            el.mObject.val(data.ObjectId).trigger("change");
                            el.mDataField.val(data.DataFieldId).trigger("change");
                        });
                        break;
                    default:
                        el.ahuProfile.hide();
                        el.plainProfile.show();
                        el.mNotInAhuProfile.show();
                        el.temperatureProfile.hide();
                        break;
                }
                Local.Validate(el.optionMenu);
            });
            el.mObjectToCompare.on("change", function () {
                el.mDataFieldToCompare.html('<option></option>').trigger("change");
                var objectId = $(this).val();
                var blockId = el.mBlock.val();
                var unit = el.mUnit.val();
                var model = { BlockId: blockId, ObjectId: objectId, Unit: unit }
                var displayProfile = el.mProfile.val();
                if (displayProfile && displayProfile == "temperature") {
                    if (model.BlockId && model.ObjectId && model.Unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/DataField",
                            contentType: "application/json",
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                el.mDataFieldToCompare.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                            },
                            error: function () { }
                        });
                    }
                } else {
                    if (model.BlockId && model.ObjectId) {
                        $.ajax({
                            type: "POST",
                            url: "/api/DataField",
                            contentType: "application/json",
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                el.mDataFieldToCompare.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                            },
                            error: function () { }
                        });
                    }
                }
                Local.Validate(el.optionMenu);
            });
            el.mDataField.on("change", function () {
                Local.Validate(el.optionMenu);
            });
            el.mChartType.on("change", function () {
                Local.Validate(el.optionMenu);
            });
            el.mDataFieldToCompare.on("change", function () {
                Local.Validate(el.optionMenu);
            });
            el.mThresholdRangeFrom.on('keyup', function () {
                if (isNaN(this.value)) {
                    this.value = "";
                }
            });
            el.mThresholdRangeTo.on('keyup', function () {
                if (isNaN(this.value)) {
                    this.value = "";
                }
            });
            el.mSetPoint.on('keyup', function () {
                if (isNaN(this.value)) {
                    this.value = "";
                }
            });
            el.mDateRange.on("change", function () {
                Local.Validate(el.optionMenu);
            });
            el.option.on("click", function () {
                var collapsed = $(this).closest(".box-tools").find(".chart-toggle").hasClass("collapsed");
                if (!collapsed) {
                    Local.Validate(el.optionMenu);
                    $(this).closest(".box").find(".option-menu").toggleClass("active");
                }
            });
            el.toggle.on("click", function () {
                var elm = $(this);
                var collapsed = elm.hasClass("collapsed");
                if (collapsed) {
                    elm.removeClass("collapsed").html('<i class="fa fa-minus"></i>');
                    elm.closest(".box").find(".box-body").slideDown("slow");
                } else {
                    template.find(".option-menu").hasClass("active") && template.find(".option-menu").removeClass("active");
                    elm.addClass("collapsed").html('<i class="fa fa-plus"></i>');
                    elm.closest(".box").find(".box-body").slideUp("slow");
                }

            });
            el.remove.on("click", function () {
                $(this).closest(".box").remove();
                if (el.mId.val()) {
                    Local.Widget.Remove({
                        model: {
                            id: el.mId.val()
                        },
                        success: function (removeResponse) {
                            console.log('removed!');
                        }
                    });
                }
            });
            el.generate.on("click", function (e, triggered) {
                console.log(triggered)
                if (triggered) {
                    $timeout(function () {
                        var mDateFlag = "";
                        var model = {
                            mId: el.mId.val(),
                            mTitle: el.mTitle.val(),
                            mBlock: el.mBlock.val(),
                            mDateFlag: mDateFlag,
                            mDateRange: el.mDateRange.val(),
                            mChartType: el.mChartType.val(),
                            mProfile: el.mProfile.val(),

                            //ahu profile
                            mRATemperature: el.mRATemperature.val(),
                            mValveOutput: el.mValveOutput.val(),
                            mSetPoint: el.mSetPoint.val(),
                            mThresholdRangeFrom: el.mThresholdRangeFrom.val(),
                            mThresholdRangeTo: el.mThresholdRangeTo.val(),

                            //temperature profile
                            mUnit: el.mUnit.val(),
                            mObject: el.mObject.val(),
                            mObjectToCompare: el.mObjectToCompare.val(),
                            mDataField: el.mDataField.val(),
                            mDataFieldToCompare: el.mDataFieldToCompare.val(),
                        };

                        var range = model.mDateRange;
                        var title = model.mTitle;
                        range = range ? range.trim() : range;
                        var ranges = range.split('-');
                        ranges[0] = ranges[0] && ranges[1] && ranges[2] ? ranges[0].trim() + "-" + ranges[1].trim() + "-" + ranges[2].trim() : moment().format("YYYY-MM-DD")
                        ranges[1] = ranges[3] && ranges[4] && ranges[5] ? ranges[3].trim() + "-" + ranges[4].trim() + "-" + ranges[5].trim() : moment().format("YYYY-MM-DD")

                        var today = [
                          moment().format("YYYY-MM-DD"),
                          moment().format("YYYY-MM-DD")];
                        var yesterday = [
                          moment().add(-1, 'days').format("YYYY-MM-DD"),
                          moment().add(-1, 'days').format("YYYY-MM-DD")];
                        var thisweek = [
                          moment().startOf('isoweek').isoWeekday(1).format("YYYY-MM-DD"),
                          moment().format("YYYY-MM-DD")];
                        var lastweek = [
                          moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("YYYY-MM-DD"),
                          moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("YYYY-MM-DD")];
                        var thismonth = [
                          moment().date(1).format("YYYY-MM-DD"),
                          moment().format("YYYY-MM-DD")];
                        var lastmonth = [
                          moment().subtract(1, 'months').date(1).format("YYYY-MM-DD"),
                          moment().date(1).subtract(1, 'days').format("YYYY-MM-DD")];

                        if (ranges[0] == today[0] && ranges[1] == today[1]) {
                            model.mDateFlag = "today";
                        } else if (ranges[0] == yesterday[0] && ranges[1] == yesterday[1]) {
                            model.mDateFlag = "yesterday";
                        } else if (ranges[0] == thisweek[0] && ranges[1] == thisweek[1]) {
                            model.mDateFlag = "thisweek";
                        } else if (ranges[0] == lastweek[0] && ranges[1] == lastweek[1]) {
                            model.mDateFlag = "lastweek";
                        } else if (ranges[0] == thismonth[0] && ranges[1] == thismonth[1]) {
                            model.mDateFlag = "thismonth";
                        } else if (ranges[0] == lastmonth[0] && ranges[1] == lastmonth[1]) {
                            model.mDateFlag = "lastmonth";
                        } else {
                            model.mDateFlag = "custom";
                        }

                        if (model.mProfile) {
                            which(
                                model.mProfile == 'plain',
                                function () {
                                    if (!model.mTitle) {
                                        alert("Please Enter a Title");
                                        return;
                                    } else if (!model.mProfile) {
                                        alert("Please select a display type.");
                                        return;
                                    } else if (!model.mBlock) {
                                        alert("Please select a block.");
                                        return;
                                    } else if (!model.mObject) {
                                        alert("Please select an object.");
                                        return;
                                    } else if (!model.mDataField) {
                                        alert("Please select a data field.");
                                        return;
                                    } else if (!model.mDateRange) {
                                        alert("please select a date range.");
                                        return;
                                    } else if (!model.mChartType) {
                                        alert("Please select a chart type.");
                                        return;
                                    } else {
                                        el.mask.show();
                                        el.optionMenu.removeClass("active");
                                        Local.Widget.Reading({
                                            model: {
                                                blockId: model.mBlock,
                                                objectId: model.mObject,
                                                dateFlag: el.mDateRange.val(),
                                                dataFieldId: model.mDataField,
                                            },
                                            success: function (res) {
                                                var data, name, raw, len, type;

                                                data = [];
                                                raw = res.data;
                                                len = raw.length;
                                                type = model.mChartType;
                                                name = model.mObject + " " + model.mDataField;

                                                for (var i = 0; i < len; i++) {
                                                    data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                }

                                                if (model.mDateFlag != "custom") {
                                                    Local.Widget.Update({
                                                        model: {
                                                            id: model.mId,
                                                            blockId: model.mBlock,
                                                            objectId: model.mObject,
                                                            dateFlag: model.mDateFlag,
                                                            chartType: model.mChartType,
                                                            chartTitle: model.mTitle,
                                                            dataFieldId: model.mDataField,
                                                            displayProfile: model.mProfile,
                                                        },
                                                        success: function (updateResponse) {
                                                            console.log('updated!');
                                                        }
                                                    });
                                                }
                                                el.mask.hide();
                                                Local.Widget.Draw(function (config) {
                                                    config.chart.title = { text: title };
                                                    config.series.push({
                                                        name: name,
                                                        data: data
                                                    });
                                                    config.chart.type = type;
                                                    config.elm = el.chart;
                                                    config.tooltip = {
                                                        formatter: function () {
                                                            var totip = '' +
                                                                     '<b>  ' + this.series.name + '<b><br/>' +
                                                                     '<span> time : ' + moment(this.point.x).utc().format("YYYY-MM-DD hh:mm A") + '</span><br/>' +
                                                                     '<span> value : ' + this.point.y.toFixed(2) + '</span><br/>';
                                                            return totip;
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                },
                                function () {
                                    which(
                                      model.mProfile == 'heatmap',
                                      function () {
                                          if (!model.mTitle) {
                                              alert("Please Enter a Title");
                                              return;
                                          } else if (!model.mProfile) {
                                              alert("Please select a display type.");
                                              return;
                                          } else if (!model.mBlock) {
                                              alert("Please select a block.");
                                              return;
                                          } else if (!model.mObject) {
                                              alert("Please select an object.");
                                              return;
                                          } else if (!model.mDataField) {
                                              alert("Please select a data field.");
                                              return;
                                          } else if (!model.mDateRange) {
                                              alert("please select a date range.");
                                              return;
                                          } else {
                                              el.mask.show();
                                              el.optionMenu.removeClass("active");
                                              Local.Widget.HeatMapReading({
                                                  model: {
                                                      blockId: model.mBlock,
                                                      objectId: model.mObject,
                                                      dateFlag: model.mDateRange,
                                                      dataFieldId: model.mDataField,
                                                  },
                                                  success: function (res) {
                                                      var raw, len, xcat, ycat, series;
                                                      xcat = [];
                                                      ycat = [];
                                                      series = [];
                                                      raw = res.data;
                                                      len = raw.length;
                                                      series.push({
                                                          data: [],
                                                          dataLabels: {
                                                              enabled: false,
                                                              color: '#000000'
                                                          },
                                                          name: model.mObject + " " + model.mDataField
                                                      });

                                                      for (var i = 0; i < len ; i++) {
                                                          xcat.push(moment(i, "hh").format("hh:mm A"));
                                                          ycat.push(moment(raw[i].yc, "DD-MM-YYYY").format("YYYY-MM-DD"));
                                                          series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                                      }
                                                      if (model.mDateFlag != "custom") {
                                                          Local.Widget.Update({
                                                              model: {
                                                                  id: model.mId,
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateFlag,
                                                                  chartTitle: model.mTitle,
                                                                  dataFieldId: model.mDataField,
                                                                  displayProfile: model.mProfile,
                                                              },
                                                              success: function (updateResponse) {
                                                                  console.log('updated!');
                                                              }
                                                          });
                                                      }
                                                      el.mask.hide();
                                                      Local.Widget.Draw(function (config) {
                                                          config.xAxis = {
                                                              title: {
                                                                  text: "Hour"
                                                              },
                                                              tickInterval: 1,
                                                              categories: xcat
                                                          };
                                                          config.yAxis = {
                                                              title: {
                                                                  text: "Date"
                                                              },
                                                              categories: ycat
                                                          };
                                                          config.chart = {
                                                              title: { text: title },
                                                              type: 'heatmap',
                                                              marginTop: 40,
                                                              marginBottom: 80,
                                                              plotBorderWidth: 0
                                                          };
                                                          config.legend = {
                                                              align: 'right',
                                                              layout: 'vertical',
                                                              margin: 0,
                                                              verticalAlign: 'top',
                                                              y: 25,
                                                              symbolHeight: 280
                                                          };
                                                          config.tooltip = {
                                                              formatter: function () {
                                                                  return '<b> ' + this.series.name + ' </b><br/>' +
                                                                           '<span> time : ' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</span><br>' +
                                                                           '<span>value : ' + this.point.value.toFixed(2) + ' \"C </span>';
                                                              }
                                                          };
                                                          config.series = series;
                                                          config.colorAxis = {
                                                              min: 0,
                                                              minColor: '#FDF7B9',
                                                              maxColor: '#C4463A'
                                                          };
                                                          config.elm = el.chart;
                                                      });
                                                  }
                                              });
                                          }
                                      },
                                      function () {
                                          which(
                                              model.mProfile == 'ahu',
                                              function () {
                                                  if (!model.mTitle) {
                                                      alert("Please Enter a Title");
                                                      return;
                                                  } else if (!model.mProfile) {
                                                      alert("Please select a display type.");
                                                      return;
                                                  } else if (!model.mBlock) {
                                                      alert("Please select a block.");
                                                      return;
                                                  } else if (!model.mObject) {
                                                      alert("Please select an object.");
                                                      return;
                                                  } else if (!model.mRATemperature) {
                                                      alert("Please select ra temperature.");
                                                      return;
                                                  } else if (!model.mValveOutput) {
                                                      alert("Please select valve output");
                                                      return;
                                                  } else if (!model.mDateRange) {
                                                      alert("please select a date range.");
                                                      return;
                                                  } else {
                                                      el.mask.show();
                                                      el.optionMenu.removeClass("active");
                                                      Local.Widget.ahuProfileReading({
                                                          model: {
                                                              blockId: model.mBlock,
                                                              objectId: model.mObject,
                                                              dateFlag: model.mDateRange,
                                                              raTemperature: model.mRATemperature,
                                                              valveOutput: model.mValveOutput,
                                                          },
                                                          success: function (res) {
                                                              var raw = [],
                                                              name = '',
                                                              series = [],
                                                              VOTotalCount = 0,
                                                              VOCount = 0,
                                                              RATTotalCount = 0,
                                                              RATCount = 0;

                                                              series[0] = {};
                                                              series[0].type = "column";
                                                              series[0].name = model.mValveOutput;
                                                              series[0].data = [];
                                                              raw = res.data.s2;
                                                              VOTotalCount = raw.length;
                                                              for (var i = 0; i < VOTotalCount; i++) {
                                                                  var vovalue = raw[i].value;
                                                                  if (vovalue < model.mThresholdRangeFrom || vovalue > model.mThresholdRangeTo) {
                                                                      VOCount = VOCount + 1;
                                                                  }
                                                                  series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), vovalue]);
                                                              }

                                                              series[1] = {};
                                                              series[1].type = "line";
                                                              series[1].color = "#00C0EF";
                                                              series[1].marker = {
                                                                  enabled: true,
                                                                  symbol: "circle",
                                                                  radius: 6,
                                                              };
                                                              series[1].name = model.mRATemperature;
                                                              series[1].data = [];
                                                              raw = res.data.s1;
                                                              RATTotalCount = raw.length;
                                                              for (var i = 0; i < RATTotalCount; i++) {
                                                                  var ravalue = raw[i].value;
                                                                  if (ravalue > model.mSetPoint) {
                                                                      RATCount = RATCount + 1;
                                                                  }
                                                                  series[1].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), ravalue]);
                                                              }

                                                              series[2] = {};
                                                              series[2].type = "line";
                                                              series[2].data = [];
                                                              series[2].color = "#F39C12";
                                                              series[2].name = "temperature set point";

                                                              if (model.mDateFlag != "custom") {
                                                                  Local.Widget.Update({
                                                                      model: {
                                                                          id: model.mId,
                                                                          blockId: model.mBlock,
                                                                          objectId: model.mObject,
                                                                          dateFlag: model.mDateFlag,
                                                                          chartTitle: model.mTitle,
                                                                          displayProfile: model.mProfile,
                                                                          RATemperature: model.mRATemperature,
                                                                          ValveOutput: model.mValveOutput,
                                                                          ThresholdRangeFrom: model.mThresholdRangeFrom,
                                                                          ThresholdRangeTo: model.mThresholdRangeTo,
                                                                          TemperatureSetPoint: model.mSetPoint
                                                                      },
                                                                      success: function (updateResponse) {
                                                                          console.log('updated!');
                                                                      }
                                                                  });
                                                              }
                                                              el.mask.hide();
                                                              Local.Widget.Draw(function (config) {
                                                                  delete config.yAxis.min;
                                                                  config.series = series;
                                                                  config.chart.title = { text: title };
                                                                  config.chart.spacingBottom = 50;
                                                                  config.chart.events = {
                                                                      load: function () {
                                                                          var RATPer = "..", VOPer = "..";
                                                                          if (RATCount > 0 && RATTotalCount > 0) {
                                                                              RATPer = ((RATCount * 100) / RATTotalCount).toFixed(2);
                                                                          }
                                                                          if (VOCount > 0 && VOTotalCount > 0) {
                                                                              VOPer = ((VOCount * 100) / VOTotalCount).toFixed(2);
                                                                          }

                                                                          var label = this.renderer
                                                                              .label("RA Tempareture above set point (%) = " + RATPer + ".<br/>Valve Output out of thresold (%) = " + VOPer + ".")
                                                                              .css({
                                                                                  display: 'inline-block',
                                                                                  color: '#222',
                                                                                  fontSize: '12px',
                                                                                  fontWeight: 'bold',
                                                                                  marginBottom: "20px",
                                                                              })
                                                                              .attr({
                                                                                  'stroke': 'silver',
                                                                                  'stroke-width': 0,
                                                                                  'r': 3,
                                                                                  'padding': 10
                                                                              })
                                                                              .add();
                                                                          label.align(Highcharts.extend(label.getBBox(), {
                                                                              align: 'left',
                                                                              x: 0,
                                                                              verticalAlign: 'bottom',
                                                                              y: 40
                                                                          }), null, 'spacingBox');

                                                                      }
                                                                  }
                                                                  config.elm = el.chart;
                                                                  config.plotOptions = {
                                                                      line: {
                                                                          dataLabels: {
                                                                              enabled: false
                                                                          },
                                                                          marker: {
                                                                              enabled: false
                                                                          }
                                                                      }
                                                                  };
                                                                  config.tooltip = {
                                                                      formatter: function () {
                                                                          return '<b>' + this.series.name + '</b><br><b>time : ' + moment(this.x).utc().format("YYYY-MM-DD hh:mm A") + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                                      }
                                                                  };
                                                                  config.yAxis.plotLines = [{
                                                                      value: model.mSetPoint,
                                                                      width: 2,
                                                                      color: '#F39C12',
                                                                      zIndex: 5
                                                                  }];
                                                              });
                                                          }
                                                      });
                                                  }
                                              },
                                              function () {
                                                  which(
                                                      model.mProfile == 'onoff',
                                                      function () {
                                                          if (!model.mTitle) {
                                                              alert("Please Enter a Title");
                                                              return;
                                                          } else if (!model.mProfile) {
                                                              alert("Please select a display type.");
                                                              return;
                                                          } else if (!model.mBlock) {
                                                              alert("Please select a block.");
                                                              return;
                                                          } else if (!model.mObject) {
                                                              alert("Please select an object.");
                                                              return;
                                                          } else if (!model.mDataField) {
                                                              alert("Please select a data field.");
                                                              return;
                                                          } else if (!model.mDateRange) {
                                                              alert("please select a date range.");
                                                              return;
                                                          } else {
                                                              el.mask.show();
                                                              el.optionMenu.removeClass("active");
                                                              Local.Widget.HeatMapReading({
                                                                  model: {
                                                                      blockId: model.mBlock,
                                                                      objectId: model.mObject,
                                                                      dateFlag: model.mDateRange,
                                                                      dataFieldId: model.mDataField,
                                                                  },
                                                                  success: function (res) {
                                                                      var raw, len, xcat, ycat, series;
                                                                      xcat = [];
                                                                      ycat = [];
                                                                      series = [];
                                                                      raw = res.data;
                                                                      len = raw.length;
                                                                      series.push({
                                                                          data: [],
                                                                          dataLabels: {
                                                                              enabled: false,
                                                                              color: '#000000'
                                                                          },
                                                                          name: model.mObject + " " + model.mDataField
                                                                      });

                                                                      for (var i = 0; i < len ; i++) {
                                                                          xcat.push(moment(i, "hh").format("hh:mm A"));
                                                                          ycat.push(moment(raw[i].yc, "DD-MM-YYYY").format("YYYY-MM-DD"));
                                                                          series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                                                      }
                                                                      if (model.mDateFlag != "custom") {
                                                                          which(
                                                                          model.mId,
                                                                          function () {
                                                                              Local.Widget.Update({
                                                                                  model: {
                                                                                      id: model.mId,
                                                                                      blockId: model.mBlock,
                                                                                      objectId: model.mObject,
                                                                                      dateFlag: model.mDateFlag,
                                                                                      chartTitle: model.mTitle,
                                                                                      dataFieldId: model.mDataField,
                                                                                      displayProfile: model.mProfile,
                                                                                  },
                                                                                  success: function (updateResponse) {
                                                                                      console.log('updated!');
                                                                                  }
                                                                              });
                                                                          },
                                                                          function () {
                                                                              Local.Widget.Create({
                                                                                  model: {
                                                                                      id: model.id,
                                                                                      order: template.index() + 1,
                                                                                      menuId: menuId,
                                                                                      menuFkId: menuId,
                                                                                      blockId: model.mBlock,
                                                                                      objectId: model.mObject,
                                                                                      dateFlag: model.mDateFlag,
                                                                                      chartType: model.mChartType,
                                                                                      chartTitle: model.mTitle,
                                                                                      dataFieldId: model.mDataField,
                                                                                      displayProfile: model.mProfile,
                                                                                  },
                                                                                  success: function (createResponse) {
                                                                                      if (createResponse.data.id) {
                                                                                          console.log('created!');
                                                                                          el.mId.val(createResponse.data.id);
                                                                                      } else {
                                                                                          alert('create error!');
                                                                                      }
                                                                                  }
                                                                              });
                                                                          });
                                                                      }
                                                                      el.mask.hide();
                                                                      Local.Widget.Draw(function (config) {
                                                                          config.xAxis = {
                                                                              title: {
                                                                                  text: "Hour"
                                                                              },
                                                                              tickInterval: 1,
                                                                              categories: xcat
                                                                          };
                                                                          config.yAxis = {
                                                                              title: {
                                                                                  text: "Date"
                                                                              },
                                                                              categories: ycat
                                                                          };
                                                                          config.chart = {
                                                                              title: { text: title },
                                                                              type: 'heatmap',
                                                                              marginTop: 40,
                                                                              marginBottom: 80,
                                                                              plotBorderWidth: 0
                                                                          };
                                                                          config.legend = {
                                                                              align: 'right',
                                                                              layout: 'vertical',
                                                                              margin: 0,
                                                                              verticalAlign: 'top',
                                                                              y: 25,
                                                                              symbolHeight: 280
                                                                          };
                                                                          config.tooltip = {
                                                                              formatter: function () {
                                                                                  return '<b> ' + this.series.name + ' </b><br/>' +
                                                                                           '<span> time : ' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</span><br>' +
                                                                                           '<span>value : ' + this.point.value.toFixed(2) + ' \"C </span>';
                                                                              }
                                                                          };
                                                                          config.series = series;
                                                                          config.colorAxis = {
                                                                              
                                                                                  min: 0,
                                                                                  minColor: '#ed0909',
                                                                                  maxColor: '#08af13',
                                                                              labels: {
                                                                              step: 3,
                                                                              enabled: true,
                                                                              formatter: function () {
                                                                                  return (this.value >= 1 && this.value<2) ? "Off" : "On";
                                                                              }
                                                                          }
                                                                              
                                                                          };
                                                                          config.elm = el.chart;
                                                                      });
                                                                  }
                                                              });
                                                          }
                                                      },
                                                      function () {
                                                          if (!model.mTitle) {
                                                              alert("Please Enter a Title");
                                                              return;
                                                          }
                                                          else if (!model.mProfile) {
                                                              alert("Please select a display type.");
                                                              return;
                                                          } else if (!model.mBlock) {
                                                              alert("Please select a block.");
                                                              return;
                                                          } else if (!model.mUnit) {
                                                              alert("Please select a unit.");
                                                              return;
                                                          } else if (!model.mObject) {
                                                              alert("Please select an object.");
                                                              return;
                                                          } else if (!model.mObjectToCompare) {
                                                              alert("Please select an object to compare.");
                                                              return;
                                                          } else if (!model.mDataField) {
                                                              alert("Please select a data field.");
                                                              return;
                                                          } else if (!model.mDataFieldToCompare) {
                                                              alert("Please select a data field to compare.");
                                                              return;
                                                          } else if (!model.mDateRange) {
                                                              alert("please select a date range.");
                                                              return;
                                                          } else {
                                                              el.mask.show();
                                                              el.optionMenu.removeClass("active");
                                                              Local.Widget.TemperatureProfileReading({
                                                                  model: {
                                                                      blockId: model.mBlock,
                                                                      objectId: model.mObject,
                                                                      dateFlag: model.mDateRange,
                                                                      dataFieldId: model.mDataField,
                                                                      objectToCompareId: model.mObjectToCompare,
                                                                      dataFieldToCompareId: model.mDataFieldToCompare,
                                                                  },
                                                                  success: function (res) {
                                                                      var series = [],
                                                                        name = '',
                                                                        raw = [];
                                                                      series[0] = {};
                                                                      series[0].name = model.mObject + " " + model.mDataField;
                                                                      series[0].data = [];
                                                                      raw = res.data.s1;
                                                                      for (var i = 0; i < raw.length; i++) {
                                                                          series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                                      }
                                                                      series[1] = {};
                                                                      series[1].name = model.mObjectToCompare + " " + model.mDataFieldToCompare;
                                                                      series[1].data = [];
                                                                      raw = res.data.s2;
                                                                      for (var i = 0; i < raw.length; i++) {
                                                                          series[1].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                                      }
                                                                      series[2] = {};
                                                                      series[2].dashStyle = 'shortdash';
                                                                      series[2].name = "delta";
                                                                      series[2].data = [];
                                                                      raw = res.data.s3;
                                                                      for (var i = 0; i < raw.length; i++) {
                                                                          series[2].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                                      }
                                                                      if (model.mDateFlag != "custom") {
                                                                          which(
                                                                          model.mId,
                                                                          function () {
                                                                              Local.Widget.Update({
                                                                                  model: {
                                                                                      id: model.mId,
                                                                                      blockId: model.mBlock,
                                                                                      objectId: model.mObject,
                                                                                      dateFlag: model.mDateFlag,
                                                                                      chartTitle: model.mTitle,
                                                                                      dataFieldId: model.mDataField,
                                                                                      displayProfile: model.mProfile,
                                                                                      objectToCompareId: model.mObjectToCompare,
                                                                                      dataFieldToCompareId: model.mDataFieldToCompare,
                                                                                  },
                                                                                  success: function (updateResponse) {
                                                                                      console.log('updated!');
                                                                                  }
                                                                              });
                                                                          },
                                                                          function () {
                                                                              Local.Widget.Create({
                                                                                  model: {
                                                                                      id: model.mId,
                                                                                      order: template.index() + 1,
                                                                                      menuId: menuId,
                                                                                      menuFkId: menuId,
                                                                                      blockId: model.mBlock,
                                                                                      objectId: model.mObject,
                                                                                      dateFlag: model.mDateFlag,
                                                                                      chartType: model.mChartType,
                                                                                      chartTitle: model.mTitle,
                                                                                      dataFieldId: model.mDataField,
                                                                                      displayProfile: model.mProfile,
                                                                                      objectToCompareId: model.mObjectToCompare,
                                                                                      dataFieldToCompareId: model.mDataFieldToCompare,
                                                                                  },
                                                                                  success: function (createResponse) {
                                                                                      if (createResponse.data.id) {
                                                                                          console.log('created!');
                                                                                          el.mId.val(createResponse.data.id);
                                                                                      } else {
                                                                                          alert('create error!');
                                                                                      }
                                                                                  }
                                                                              });
                                                                          });
                                                                      }
                                                                      el.mask.hide();
                                                                      Local.Widget.Draw(function (config) {
                                                                          delete config.yAxis.min;
                                                                          config.series = series;
                                                                          config.chart.type = 'line';
                                                                          config.chart.title = { text: title };
                                                                          config.elm = el.chart;
                                                                          config.plotOptions = {
                                                                              line: {
                                                                                  dataLabels: {
                                                                                      enabled: false
                                                                                  },
                                                                                  marker: {
                                                                                      enabled: false
                                                                                  }
                                                                              }
                                                                          };
                                                                          config.tooltip = {
                                                                              formatter: function () {
                                                                                  return '<b>' + this.series.name + '</b><br><b>time : ' + moment(this.x).utc().format("YYYY-MM-DD hh:mm A") + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                                              }
                                                                          };
                                                                      });
                                                                  }
                                                              });
                                                          }
                                                      })
                                              })
                                      });
                                });
                        } else { alert("Please select a display profile.") }
                    }, 3000);
                } else {
                    var mDateFlag = "";
                    var model = {
                        mId: el.mId.val(),
                        mTitle: el.mTitle.val(),
                        mBlock: el.mBlock.val(),
                        mDateFlag: mDateFlag,
                        mDateRange: el.mDateRange.val(),
                        mChartType: el.mChartType.val(),
                        mProfile: el.mProfile.val(),

                        //ahu profile
                        mRATemperature: el.mRATemperature.val(),
                        mValveOutput: el.mValveOutput.val(),
                        mSetPoint: el.mSetPoint.val(),
                        mThresholdRangeFrom: el.mThresholdRangeFrom.val(),
                        mThresholdRangeTo: el.mThresholdRangeTo.val(),

                        //temperature profile
                        mUnit: el.mUnit.val(),
                        mObject: el.mObject.val(),
                        mObjectToCompare: el.mObjectToCompare.val(),
                        mDataField: el.mDataField.val(),
                        mDataFieldToCompare: el.mDataFieldToCompare.val(),
                    };

                    var range = model.mDateRange;
                    var title = model.mTitle;
                    range = range ? range.trim() : range;
                    var ranges = range.split('-');
                    ranges[0] = ranges[0] && ranges[1] && ranges[2] ? ranges[0].trim() + "-" + ranges[1].trim() + "-" + ranges[2].trim() : moment().format("YYYY-MM-DD")
                    ranges[1] = ranges[3] && ranges[4] && ranges[5] ? ranges[3].trim() + "-" + ranges[4].trim() + "-" + ranges[5].trim() : moment().format("YYYY-MM-DD")

                    var today = [
                      moment().format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")];
                    var yesterday = [
                      moment().add(-1, 'days').format("YYYY-MM-DD"),
                      moment().add(-1, 'days').format("YYYY-MM-DD")];
                    var thisweek = [
                      moment().startOf('isoweek').isoWeekday(1).format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")];
                    var lastweek = [
                      moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("YYYY-MM-DD"),
                      moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("YYYY-MM-DD")];
                    var thismonth = [
                      moment().date(1).format("YYYY-MM-DD"),
                      moment().format("YYYY-MM-DD")];
                    var lastmonth = [
                      moment().subtract(1, 'months').date(1).format("YYYY-MM-DD"),
                      moment().date(1).subtract(1, 'days').format("YYYY-MM-DD")];

                    if (ranges[0] == today[0] && ranges[1] == today[1]) {
                        model.mDateFlag = "today";
                    } else if (ranges[0] == yesterday[0] && ranges[1] == yesterday[1]) {
                        model.mDateFlag = "yesterday";
                    } else if (ranges[0] == thisweek[0] && ranges[1] == thisweek[1]) {
                        model.mDateFlag = "thisweek";
                    } else if (ranges[0] == lastweek[0] && ranges[1] == lastweek[1]) {
                        model.mDateFlag = "lastweek";
                    } else if (ranges[0] == thismonth[0] && ranges[1] == thismonth[1]) {
                        model.mDateFlag = "thismonth";
                    } else if (ranges[0] == lastmonth[0] && ranges[1] == lastmonth[1]) {
                        model.mDateFlag = "lastmonth";
                    } else {
                        model.mDateFlag = "custom";
                    }

                    if (model.mProfile) {
                        which(
                            model.mProfile == 'plain',
                            function () {
                                //if (!model.mTitle) {
                                //    alert("Please Enter a Title");
                                //    return;
                                //} else if (!model.mProfile) {
                                //    alert("Please select a display type.");
                                //    return;
                                //} else if (!model.mBlock) {
                                //    alert("Please select a block.");
                                //    return;
                                //} else if (!model.mObject) {
                                //    alert("Please select an object.");
                                //    return;
                                //} else if (!model.mDataField) {
                                //    alert("Please select a data field.");
                                //    return;
                                //} else if (!model.mDateRange) {
                                //    alert("please select a date range.");
                                //    return;
                                //} else if (!model.mChartType) {
                                //    alert("Please select a chart type.");
                                //    return;
                                //} else {
                                el.mask.show();
                                el.optionMenu.removeClass("active");
                                Local.Widget.Reading({
                                    model: {
                                        blockId: model.mBlock,
                                        objectId: model.mObject,
                                        dateFlag: el.mDateRange.val(),
                                        dataFieldId: model.mDataField,
                                    },
                                    success: function (res) {
                                        var data, name, raw, len, type;

                                        data = [];
                                        raw = res.data;
                                        len = raw.length;
                                        type = model.mChartType;
                                        name = model.mObject + " " + model.mDataField;

                                        for (var i = 0; i < len; i++) {
                                            data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                        }

                                        if (model.mDateFlag != "custom") {
                                            Local.Widget.Update({
                                                model: {
                                                    id: model.mId,
                                                    blockId: model.mBlock,
                                                    objectId: model.mObject,
                                                    dateFlag: model.mDateFlag,
                                                    chartType: model.mChartType,
                                                    chartTitle: model.mTitle,
                                                    dataFieldId: model.mDataField,
                                                    displayProfile: model.mProfile,
                                                },
                                                success: function (updateResponse) {
                                                    console.log('updated!');
                                                }
                                            });
                                        }
                                        el.mask.hide();
                                        Local.Widget.Draw(function (config) {
                                            config.chart.title = { text: title };
                                            config.series.push({
                                                name: name,
                                                data: data
                                            });
                                            config.chart.type = type;
                                            config.elm = el.chart;
                                            config.tooltip = {
                                                formatter: function () {
                                                    var totip = '' +
                                                             '<b>  ' + this.series.name + '<b><br/>' +
                                                             '<span> time : ' + moment(this.point.x).utc().format("YYYY-MM-DD hh:mm A") + '</span><br/>' +
                                                             '<span> value : ' + this.point.y.toFixed(2) + '</span><br/>';
                                                    return totip;
                                                }
                                            }
                                        });
                                    }
                                });
                                // }
                            },
                            function () {
                                which(
                                  model.mProfile == 'heatmap',
                                  function () {
                                      //if (!model.mTitle) {
                                      //    alert("Please Enter a Title");
                                      //    return;
                                      //} else if (!model.mProfile) {
                                      //    alert("Please select a display type.");
                                      //    return;
                                      //} else if (!model.mBlock) {
                                      //    alert("Please select a block.");
                                      //    return;
                                      //} else if (!model.mObject) {
                                      //    alert("Please select an object.");
                                      //    return;
                                      //} else if (!model.mDataField) {
                                      //    alert("Please select a data field.");
                                      //    return;
                                      //} else if (!model.mDateRange) {
                                      //    alert("please select a date range.");
                                      //    return;
                                      //} else {
                                      el.mask.show();
                                      el.optionMenu.removeClass("active");
                                      Local.Widget.HeatMapReading({
                                          model: {
                                              blockId: model.mBlock,
                                              objectId: model.mObject,
                                              dateFlag: model.mDateRange,
                                              dataFieldId: model.mDataField,
                                          },
                                          success: function (res) {
                                              var raw, len, xcat, ycat, series;
                                              xcat = [];
                                              ycat = [];
                                              series = [];
                                              raw = res.data;
                                              len = raw.length;
                                              series.push({
                                                  data: [],
                                                  dataLabels: {
                                                      enabled: false,
                                                      color: '#000000'
                                                  },
                                                  name: model.mObject + " " + model.mDataField
                                              });

                                              for (var i = 0; i < len ; i++) {
                                                  xcat.push(moment(i, "hh").format("hh:mm A"));
                                                  ycat.push(moment(raw[i].yc, "DD-MM-YYYY").format("YYYY-MM-DD"));
                                                  series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                              }
                                              if (model.mDateFlag != "custom") {
                                                  Local.Widget.Update({
                                                      model: {
                                                          id: model.mId,
                                                          blockId: model.mBlock,
                                                          objectId: model.mObject,
                                                          dateFlag: model.mDateFlag,
                                                          chartTitle: model.mTitle,
                                                          dataFieldId: model.mDataField,
                                                          displayProfile: model.mProfile,
                                                      },
                                                      success: function (updateResponse) {
                                                          console.log('updated!');
                                                      }
                                                  });
                                              }
                                              el.mask.hide();
                                              Local.Widget.Draw(function (config) {
                                                  config.xAxis = {
                                                      title: {
                                                          text: "Hour"
                                                      },
                                                      tickInterval: 1,
                                                      categories: xcat
                                                  };
                                                  config.yAxis = {
                                                      title: {
                                                          text: "Date"
                                                      },
                                                      categories: ycat
                                                  };
                                                  config.chart = {
                                                      title: { text: title },
                                                      type: 'heatmap',
                                                      marginTop: 40,
                                                      marginBottom: 80,
                                                      plotBorderWidth: 0
                                                  };
                                                  config.legend = {
                                                      align: 'right',
                                                      layout: 'vertical',
                                                      margin: 0,
                                                      verticalAlign: 'top',
                                                      y: 25,
                                                      symbolHeight: 280
                                                  };
                                                  config.tooltip = {
                                                      formatter: function () {
                                                          return '<b> ' + this.series.name + ' </b><br/>' +
                                                                   '<span> time : ' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</span><br>' +
                                                                   '<span>value : ' + this.point.value.toFixed(2) + ' \"C </span>';
                                                      }
                                                  };
                                                  config.series = series;
                                                  config.colorAxis = {
                                                      min: 0,
                                                      minColor: '#FDF7B9',
                                                      maxColor: '#C4463A'
                                                  };
                                                  config.elm = el.chart;
                                              });
                                          }
                                      });
                                      //}
                                  },
                                  function () {
                                      which(
                                          model.mProfile == 'ahu',
                                          function () {
                                              //if (!model.mTitle) {
                                              //    alert("Please Enter a Title");
                                              //    return;
                                              //} else if (!model.mProfile) {
                                              //    alert("Please select a display type.");
                                              //    return;
                                              //} else if (!model.mBlock) {
                                              //    alert("Please select a block.");
                                              //    return;
                                              //} else if (!model.mObject) {
                                              //    alert("Please select an object.");
                                              //    return;
                                              //} else if (!model.mRATemperature) {
                                              //    alert("Please select ra temperature.");
                                              //    return;
                                              //} else if (!model.mValveOutput) {
                                              //    alert("Please select valve output");
                                              //    return;
                                              //} else if (!model.mDateRange) {
                                              //    alert("please select a date range.");
                                              //    return;
                                              //} else {
                                              el.mask.show();
                                              el.optionMenu.removeClass("active");
                                              Local.Widget.ahuProfileReading({
                                                  model: {
                                                      blockId: model.mBlock,
                                                      objectId: model.mObject,
                                                      dateFlag: model.mDateRange,
                                                      raTemperature: model.mRATemperature,
                                                      valveOutput: model.mValveOutput,
                                                  },
                                                  success: function (res) {
                                                      var raw = [],
                                                  name = '',
                                                  series = [],
                                                  VOTotalCount = 0,
                                                  VOCount = 0,
                                                  RATTotalCount = 0,
                                                  RATCount = 0;

                                                      series[0] = {};
                                                      series[0].type = "column";
                                                      series[0].name = model.mValveOutput;
                                                      series[0].data = [];
                                                      raw = res.data.s2;
                                                      VOTotalCount = raw.length;
                                                      for (var i = 0; i < VOTotalCount; i++) {
                                                          var vovalue = raw[i].value;
                                                          if (vovalue < model.mThresholdRangeFrom || vovalue > model.mThresholdRangeTo) {
                                                              VOCount = VOCount + 1;
                                                          }
                                                          series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), vovalue]);
                                                      }

                                                      series[1] = {};
                                                      series[1].type = "line";
                                                      series[1].color = "#00C0EF";
                                                      series[1].marker = {
                                                          enabled: true,
                                                          symbol: "circle",
                                                          radius: 6,
                                                      };
                                                      series[1].name = model.mRATemperature;
                                                      series[1].data = [];
                                                      raw = res.data.s1;
                                                      RATTotalCount = raw.length;
                                                      for (var i = 0; i < RATTotalCount; i++) {
                                                          var ravalue = raw[i].value;
                                                          if (ravalue > model.mSetPoint) {
                                                              RATCount = RATCount + 1;
                                                          }
                                                          series[1].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), ravalue]);
                                                      }

                                                      series[2] = {};
                                                      series[2].type = "line";
                                                      series[2].data = [];
                                                      series[2].color = "#F39C12";
                                                      series[2].name = "temperature set point";


                                                      if (model.mDateFlag != "custom") {
                                                          Local.Widget.Update({
                                                              model: {
                                                                  id: model.mId,
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateFlag,
                                                                  chartTitle: model.mTitle,
                                                                  displayProfile: model.mProfile,
                                                                  RATemperature: model.mRATemperature,
                                                                  ValveOutput: model.mValveOutput,
                                                                  ThresholdRangeFrom: model.mThresholdRangeFrom,
                                                                  ThresholdRangeTo: model.mThresholdRangeTo,
                                                                  TemperatureSetPoint: model.mSetPoint
                                                              },
                                                              success: function (updateResponse) {
                                                                  console.log('updated!');
                                                              }
                                                          });
                                                      }
                                                      el.mask.hide();
                                                      Local.Widget.Draw(function (config) {
                                                          delete config.yAxis.min;
                                                          config.series = series;
                                                          config.chart.title = { text: title };
                                                          config.chart.spacingBottom = 50;
                                                          config.chart.events = {
                                                              load: function () {
                                                                  var RATPer = "..", VOPer = "..";
                                                                  if (RATCount > 0 && RATTotalCount > 0) {
                                                                      RATPer = ((RATCount * 100) / RATTotalCount).toFixed(2);
                                                                  }
                                                                  if (VOCount > 0 && VOTotalCount > 0) {
                                                                      VOPer = ((VOCount * 100) / VOTotalCount).toFixed(2);
                                                                  }

                                                                  var label = this.renderer
                                                                      .label("RA Tempareture above set point (%) = " + RATPer + ".<br/>Valve Output out of thresold (%) = " + VOPer + ".")
                                                                      .css({
                                                                          display: 'inline-block',
                                                                          color: '#222',
                                                                          fontSize: '12px',
                                                                          fontWeight: 'bold',
                                                                          marginBottom: "20px",
                                                                      })
                                                                      .attr({
                                                                          'stroke': 'silver',
                                                                          'stroke-width': 0,
                                                                          'r': 3,
                                                                          'padding': 10
                                                                      })
                                                                      .add();
                                                                  label.align(Highcharts.extend(label.getBBox(), {
                                                                      align: 'left',
                                                                      x: 0,
                                                                      verticalAlign: 'bottom',
                                                                      y: 40
                                                                  }), null, 'spacingBox');

                                                              }
                                                          };
                                                          config.elm = el.chart;
                                                          config.plotOptions = {
                                                              line: {
                                                                  dataLabels: {
                                                                      enabled: false
                                                                  },
                                                                  marker: {
                                                                      enabled: false
                                                                  }
                                                              }
                                                          };
                                                          config.tooltip = {
                                                              formatter: function () {
                                                                  return '<b>' + this.series.name + '</b><br><b>time : ' + moment(this.x).utc().format("YYYY-MM-DD hh:mm A") + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                              }
                                                          };
                                                          config.yAxis.plotLines = [{
                                                              value: model.mSetPoint,
                                                              width: 2,
                                                              color: '#F39C12',
                                                              zIndex: 5
                                                          }];
                                                      });
                                                  }
                                              });
                                              //}
                                          },
                                          function () {
                                              which(
                                                  model.mProfile == 'onoff',
                                                  function () {
                                                      if (!model.mTitle) {
                                                          alert("Please Enter a Title");
                                                          return;
                                                      } else if (!model.mProfile) {
                                                          alert("Please select a display type.");
                                                          return;
                                                      } else if (!model.mBlock) {
                                                          alert("Please select a block.");
                                                          return;
                                                      } else if (!model.mObject) {
                                                          alert("Please select an object.");
                                                          return;
                                                      } else if (!model.mDataField) {
                                                          alert("Please select a data field.");
                                                          return;
                                                      } else if (!model.mDateRange) {
                                                          alert("please select a date range.");
                                                          return;
                                                      } else {
                                                          el.mask.show();
                                                          el.optionMenu.removeClass("active");
                                                          Local.Widget.HeatMapReading({
                                                              model: {
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateRange,
                                                                  dataFieldId: model.mDataField,
                                                              },
                                                              success: function (res) {
                                                                  var raw, len, xcat, ycat, series;
                                                                  xcat = [];
                                                                  ycat = [];
                                                                  series = [];
                                                                  raw = res.data;
                                                                  len = raw.length;
                                                                  series.push({
                                                                      data: [],
                                                                      dataLabels: {
                                                                          enabled: false,
                                                                          color: '#000000'
                                                                      },
                                                                      name: model.mObject + " " + model.mDataField
                                                                  });

                                                                  for (var i = 0; i < len ; i++) {
                                                                      xcat.push(moment(i, "hh").format("hh:mm A"));
                                                                      ycat.push(moment(raw[i].yc, "DD-MM-YYYY").format("YYYY-MM-DD"));
                                                                      series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                                                  }
                                                                  if (model.mDateFlag != "custom") {
                                                                      which(
                                                                      model.mId,
                                                                      function () {
                                                                          Local.Widget.Update({
                                                                              model: {
                                                                                  id: model.mId,
                                                                                  blockId: model.mBlock,
                                                                                  objectId: model.mObject,
                                                                                  dateFlag: model.mDateFlag,
                                                                                  chartTitle: model.mTitle,
                                                                                  dataFieldId: model.mDataField,
                                                                                  displayProfile: model.mProfile,
                                                                              },
                                                                              success: function (updateResponse) {
                                                                                  console.log('updated!');
                                                                              }
                                                                          });
                                                                      },
                                                                      function () {
                                                                          Local.Widget.Create({
                                                                              model: {
                                                                                  id: model.id,
                                                                                  order: template.index() + 1,
                                                                                  menuId: menuId,
                                                                                  menuFkId: menuId,
                                                                                  blockId: model.mBlock,
                                                                                  objectId: model.mObject,
                                                                                  dateFlag: model.mDateFlag,
                                                                                  chartType: model.mChartType,
                                                                                  chartTitle: model.mTitle,
                                                                                  dataFieldId: model.mDataField,
                                                                                  displayProfile: model.mProfile,
                                                                              },
                                                                              success: function (createResponse) {
                                                                                  if (createResponse.data.id) {
                                                                                      console.log('created!');
                                                                                      el.mId.val(createResponse.data.id);
                                                                                  } else {
                                                                                      alert('create error!');
                                                                                  }
                                                                              }
                                                                          });
                                                                      });
                                                                  }
                                                                  el.mask.hide();
                                                                  Local.Widget.Draw(function (config) {
                                                                      config.xAxis = {
                                                                          title: {
                                                                              text: "Hour"
                                                                          },
                                                                          tickInterval: 1,
                                                                          categories: xcat
                                                                      };
                                                                      config.yAxis = {
                                                                          title: {
                                                                              text: "Date"
                                                                          },
                                                                          categories: ycat
                                                                      };
                                                                      config.chart = {
                                                                          title: { text: title },
                                                                          type: 'heatmap',
                                                                          marginTop: 40,
                                                                          marginBottom: 80,
                                                                          plotBorderWidth: 0
                                                                      };
                                                                      config.legend = {
                                                                          align: 'right',
                                                                          layout: 'vertical',
                                                                          margin: 0,
                                                                          verticalAlign: 'top',
                                                                          y: 25,
                                                                          symbolHeight: 280
                                                                      };
                                                                      config.tooltip = {
                                                                          formatter: function () {
                                                                              return '<b> ' + this.series.name + ' </b><br/>' +
                                                                                       '<span> time : ' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</span><br>' +
                                                                                       '<span>value : ' + this.point.value.toFixed(2) + ' \"C </span>';
                                                                          }
                                                                      };
                                                                      config.series = series;
                                                                      config.colorAxis = {
                                                                          min: 0,
                                                                          minColor: '#FDF7B9',
                                                                          maxColor: '#C4463A'
                                                                      };
                                                                      config.elm = el.chart;
                                                                  });
                                                              }
                                                          });
                                                      }
                                                  },
                                                  function () {
                                                      if (!model.mTitle) {
                                                          alert("Please Enter a Title");
                                                          return;
                                                      }
                                                      else if (!model.mProfile) {
                                                          alert("Please select a display type.");
                                                          return;
                                                      } else if (!model.mBlock) {
                                                          alert("Please select a block.");
                                                          return;
                                                      } else if (!model.mUnit) {
                                                          alert("Please select a unit.");
                                                          return;
                                                      } else if (!model.mObject) {
                                                          alert("Please select an object.");
                                                          return;
                                                      } else if (!model.mObjectToCompare) {
                                                          alert("Please select an object to compare.");
                                                          return;
                                                      } else if (!model.mDataField) {
                                                          alert("Please select a data field.");
                                                          return;
                                                      } else if (!model.mDataFieldToCompare) {
                                                          alert("Please select a data field to compare.");
                                                          return;
                                                      } else if (!model.mDateRange) {
                                                          alert("please select a date range.");
                                                          return;
                                                      } else {
                                                          el.mask.show();
                                                          el.optionMenu.removeClass("active");
                                                          Local.Widget.TemperatureProfileReading({
                                                              model: {
                                                                  blockId: model.mBlock,
                                                                  objectId: model.mObject,
                                                                  dateFlag: model.mDateRange,
                                                                  dataFieldId: model.mDataField,
                                                                  objectToCompareId: model.mObjectToCompare,
                                                                  dataFieldToCompareId: model.mDataFieldToCompare,
                                                              },
                                                              success: function (res) {
                                                                  var series = [],
                                                                    name = '',
                                                                    raw = [];
                                                                  series[0] = {};
                                                                  series[0].name = model.mObject + " " + model.mDataField;
                                                                  series[0].data = [];
                                                                  raw = res.data.s1;
                                                                  for (var i = 0; i < raw.length; i++) {
                                                                      series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                                  }
                                                                  series[1] = {};
                                                                  series[1].name = model.mObjectToCompare + " " + model.mDataFieldToCompare;
                                                                  series[1].data = [];
                                                                  raw = res.data.s2;
                                                                  for (var i = 0; i < raw.length; i++) {
                                                                      series[1].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                                  }
                                                                  series[2] = {};
                                                                  series[2].dashStyle = 'shortdash';
                                                                  series[2].name = "delta";
                                                                  series[2].data = [];
                                                                  raw = res.data.s3;
                                                                  for (var i = 0; i < raw.length; i++) {
                                                                      series[2].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                                                  }
                                                                  if (model.mDateFlag != "custom") {
                                                                      which(
                                                                      model.mId,
                                                                      function () {
                                                                          Local.Widget.Update({
                                                                              model: {
                                                                                  id: model.mId,
                                                                                  blockId: model.mBlock,
                                                                                  objectId: model.mObject,
                                                                                  dateFlag: model.mDateFlag,
                                                                                  chartTitle: model.mTitle,
                                                                                  dataFieldId: model.mDataField,
                                                                                  displayProfile: model.mProfile,
                                                                                  objectToCompareId: model.mObjectToCompare,
                                                                                  dataFieldToCompareId: model.mDataFieldToCompare,
                                                                              },
                                                                              success: function (updateResponse) {
                                                                                  console.log('updated!');
                                                                              }
                                                                          });
                                                                      },
                                                                      function () {
                                                                          Local.Widget.Create({
                                                                              model: {
                                                                                  id: model.mId,
                                                                                  order: template.index() + 1,
                                                                                  menuId: menuId,
                                                                                  menuFkId: menuId,
                                                                                  blockId: model.mBlock,
                                                                                  objectId: model.mObject,
                                                                                  dateFlag: model.mDateFlag,
                                                                                  chartType: model.mChartType,
                                                                                  chartTitle: model.mTitle,
                                                                                  dataFieldId: model.mDataField,
                                                                                  displayProfile: model.mProfile,
                                                                                  objectToCompareId: model.mObjectToCompare,
                                                                                  dataFieldToCompareId: model.mDataFieldToCompare,
                                                                              },
                                                                              success: function (createResponse) {
                                                                                  if (createResponse.data.id) {
                                                                                      console.log('created!');
                                                                                      el.mId.val(createResponse.data.id);
                                                                                  } else {
                                                                                      alert('create error!');
                                                                                  }
                                                                              }
                                                                          });
                                                                      });
                                                                  }
                                                                  el.mask.hide();
                                                                  Local.Widget.Draw(function (config) {
                                                                      delete config.yAxis.min;
                                                                      config.series = series;
                                                                      config.chart.type = 'line';
                                                                      config.chart.title = { text: title };
                                                                      config.elm = el.chart;
                                                                      config.plotOptions = {
                                                                          line: {
                                                                              dataLabels: {
                                                                                  enabled: false
                                                                              },
                                                                              marker: {
                                                                                  enabled: false
                                                                              }
                                                                          }
                                                                      };
                                                                      config.tooltip = {
                                                                          formatter: function () {
                                                                              return '<b>' + this.series.name + '</b><br><b>time : ' + moment(this.x).utc().format("YYYY-MM-DD hh:mm A") + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                                          }
                                                                      };
                                                                  });
                                                              }
                                                          });
                                                      }
                                                  })
                                          })
                                  });
                            });
                    } else { alert("Please select a display profile.") }
                }
            });
            el.cancel.on("click", function () {
                el.option.trigger("click");
            });
            el.mId.val(widgetPreset.id);
            el.mTitle.val(widgetPreset.chartTitle);
            el.mBlock.val(widgetPreset.blockId).trigger("change");
            el.mThresholdRangeFrom.val(widgetPreset.ThresholdRangeFrom).trigger("change");
            el.mThresholdRangeTo.val(widgetPreset.ThresholdRangeTo).trigger("change");
            el.mSetPoint.val(widgetPreset.TemperatureSetPoint).trigger("change");
            el.mChartType.val(widgetPreset.chartType).trigger("change");
            el.mUnit.val(widgetPreset.unit).trigger("change");
            el.mProfile.val(widgetPreset.displayProfile).trigger("change");

            var dateFlagValue = [];
            var today = [
              moment().format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD")];
            var yesterday = [
              moment().add(-1, 'days').format("YYYY-MM-DD"),
              moment().add(-1, 'days').format("YYYY-MM-DD")];
            var thisweek = [
              moment().startOf('isoweek').isoWeekday(1).format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD")];
            var lastweek = [
              moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("YYYY-MM-DD"),
              moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("YYYY-MM-DD")];
            var thismonth = [
              moment().date(1).format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD")];
            var lastmonth = [
              moment().subtract(1, 'months').date(1).format("YYYY-MM-DD"),
              moment().date(1).subtract(1, 'days').format("YYYY-MM-DD")];
            switch (widgetPreset.dateFlag) {
                case "today":
                    dateFlagValue = today;
                    break;
                case "yesterday":
                    dateFlagValue = yesterday;
                    break;
                case "thisweek":
                    dateFlagValue = thisweek;
                    break;
                case "lastweek":
                    dateFlagValue = lastweek;
                    break;
                case "thismonth":
                    dateFlagValue = thismonth;
                    break;
                case "lastmonth":
                    dateFlagValue = lastmonth;
                    break;
                default:
                    dateFlagValue = today;
                    break;
            }
            el.mDateRange.data('daterangepicker').setStartDate(dateFlagValue[0]);
            el.mDateRange.data('daterangepicker').setEndDate(dateFlagValue[1]);
            $(".container").append(template);
            el.generate.trigger("click", true);
        });
        $timeout(function () {
            $window.scrollBy(0, 0);
        });
    };
    Local.Widget.Create = function (option) {
        Widget.CreateWidget(option);
    };
    Local.Widget.Update = function (option) {
        Widget.UpdateWidget(option);
    };
    Local.Widget.Remove = function (option) {
        Widget.RemoveWidget(option);
    };
    Local.Widget.HiChart = function (callback) {
        var config = {
            chart: {
                zoomType: 'x',
                type: 'line',
                animation: {
                    duration: 1000
                },
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
                    text: null
                },
                type: 'datetime',
                startOnTick: false,
                //tickInterval: 60 * 60 * 1000,
                dateTimeLabelFormats: { day: '%e %b %H:%M' }
            },
            yAxis: {
                title: {
                    text: null
                },
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
        config.elm.highcharts(config);
        config.elm.highcharts().setTitle({ text: config.chart.title.text });
    };
    Local.Widget.Reading = function (option) {
        Widget.ReadWidgetData(option);
    };

    Local.Widget.HeatMapReading = function (option) {
        Widget.ReadWidgetHeatMapData(option);
    };
    Local.Widget.TemperatureProfileReading = function (option) {
        Widget.ReadWidgetTemperatureProfileData(option);
    };
    Local.Widget.ahuProfileReading = function (option) {
        Widget.ReadWidgetAhuProfileData(option);
    };
    Local.Run(function () {
        Local.Bind({
        });
        Local.Widget.Read({
            userId: userId,
            menuId: menuId,
            success: Local.Widget.Render
        });
        Highcharts.setOptions({
            colors: ['#00A65A', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263']
        });
    });
    function which(check, winner, looser) {
        if (check) {
            return winner();
        } else {
            return looser();
        }
    }
});


//el.chart.highcharts({
//    chart: {
//        type: 'heatmap',
//        marginTop: 40,
//        marginBottom: 80,
//        plotBorderWidth: 1
//    },

//    title: {
//        text: 'Sales per employee per weekday'
//    },

//    xAxis: {
//        categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
//    },

//    yAxis: {
//        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//        title: null
//    },

//    colorAxis: {
//        min: 0,
//        minColor: '#FFFFFF',
//        maxColor: Highcharts.getOptions().colors[0]
//    },

//    legend: {
//        align: 'right',
//        layout: 'vertical',
//        margin: 0,
//        verticalAlign: 'top',
//        y: 25,
//        symbolHeight: 280
//    },

//    tooltip: {
//        formatter: function () {
//            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
//                this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
//        }
//    },

//    series: [{
//        name: 'Sales per employee',
//        borderWidth: 1,
//        data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
//        dataLabels: {
//            enabled: true,
//            color: '#000000'
//        }
//    }]

//});
