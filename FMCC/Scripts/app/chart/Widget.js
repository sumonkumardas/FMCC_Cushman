angular.module("fmcc")
    .controller("Widget", function ($scope, $routeParams, $filter, Widget, $rootScope, ready) {
       

        var userId = $routeParams.userId;
        var menuId = $routeParams.menuId;

        var Local = {};
        Local.Widget = {};
        Local.Run = function (option) {
            option.call(this);
        };
        Local.Bind = function (option) {
            angular.element(".create-widget").bind("click", Local.Widget.Init);
        };
        Local.Widget.Read = function (option) {
            Widget.ReadWidget(option);
        };
        Local.Widget.Draw = function (callback) {
            Local.Widget.HiChart(callback);
        };
        Local.Widget.Init = function (option) {

            var input = {},
              preset = {
                  displayProfile: 'plain'
              },
              template = $($("#template").html());


            input.MaskElm = template.find(".mask");
            input.ChartElm = template.find(".chart");
            input.tempElm = template.find(".temp-form");
            input.typeElm = template.find(".chart-form");
            input.CreateElm = template.find(".chart-create");
            input.OptionElm = template.find(".chart-option");
            input.ToggleElm = template.find(".chart-toggle");
            input.RemoveElm = template.find(".chart-remove");
            input.OptionMenu = template.find(".option-menu");

            input.Block = template.find(".block");
            input.Unit = template.find(".temp-unit");
            input.Widget = template.find(".widget");
            input.Object = template.find(".object");
            input.DateFlag = template.find(".date-flag");
            input.Display = template.find(".display-as");
            input.ChartType = template.find(".chart-type");
            input.DataField = template.find(".data-field");
            input.tempObject = template.find(".temp-object");
            input.tempDataField = template.find(".temp-data-field");


            input.Block.select2({
                placeholder: 'Select Block',
                allowClear: true
            });
            input.Unit.select2({
                placeholder: 'Select Unit',
                allowClear: true
            });
            input.Object.select2({
                placeholder: 'Select Object',
                allowClear: true
            });

            input.Display.select2({
                placeholder: 'Select Chart Type',
                allowClear: true
            });
            input.DataField.select2({
                placeholder: 'Select Data Field',
                allowClear: true
            });
            input.ChartType.select2({
                placeholder: 'Select Chart Type',
                allowClear: true
            });
            input.tempObject.select2({
                placeholder: 'Select Object',
                allowClear: true
            });
            input.tempDataField.select2({
                placeholder: 'Select Data Field',
                allowClear: true
            });
            input.DateFlag.daterangepicker({
                locale: {
                    format: 'DD/MM/YYYY'
                },
                startDate: moment().format("DD/MM/YYYY"),
                endDate: moment().format("DD/MM/YYYY"),
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
                }
            });

            input.Block.on("change", function () {
                input.Object.html('<option></option>').trigger("change");
                input.DataField.html('<option></option>').trigger("change");
                input.tempObject.html('<option></option>').trigger("change");
                input.tempDataField.html('<option></option>').trigger("change");
                var block = $(this).val();
                var unit = input.Unit.val();
                var model = { BlockId: block, Unit: unit };
                var displayProfile = input.Display.val();
                if (displayProfile && displayProfile == 'temperature') {
                    if (block && unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/Object",
                            contentType: "application/json",
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                input.Object.select2({
                                    data: res,
                                    placeholder: 'Select Object',
                                });
                                input.tempObject.select2({
                                    data: res,
                                    placeholder: 'Select Object',
                                });
                                input.Object.select2("val", [preset.objectId, preset.objectId]);
                                input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
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
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                input.Object.select2({
                                    data: res,
                                    placeholder: 'Select Object',
                                });
                                input.tempObject.select2({
                                    data: res,
                                    placeholder: 'Select Object',
                                });
                                input.Object.select2("val", [preset.objectId, preset.objectId]);
                                input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
                            },
                            error: function () { }
                        });
                    }
                }
            });
            input.Object.on("change", function () {
                input.DataField.html('<option></option>').trigger("change");
                input.tempDataField.html('<option></option>').trigger("change");
                var objectId = $(this).val();
                var blockId = input.Block.val();
                var unit = input.Unit.val();
                var model = { BlockId: blockId, ObjectId: objectId, Unit: unit }
                var displayProfile = input.Display.val();
                if (displayProfile && displayProfile == "temperature") {
                    if (model.BlockId && model.ObjectId && model.Unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/DataField",
                            contentType: "application/json",
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                input.DataField.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                                input.tempDataField.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                                input.DataField.select2("val", [preset.dataFieldId, preset.dataFieldId]);
                                input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
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
                                input.DataField.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                                input.tempDataField.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                                input.DataField.select2("val", [preset.dataFieldId, preset.dataFieldId]);
                                input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
                            },
                            error: function () { }
                        });
                    }
                }
            });
            input.Unit.on("change", function () {
                input.Object.html('<option></option>').trigger("change");
                input.DataField.html('<option></option>').trigger("change");
                input.tempObject.html('<option></option>').trigger("change");
                input.tempDataField.html('<option></option>').trigger("change");
                var unit = $(this).val();
                var block = input.Block.val();
                var model = { BlockId: block, Unit: unit }
                if (model.BlockId && model.Unit) {
                    $.ajax({
                        type: "POST",
                        url: "/api/Object",
                        contentType: "application/json",
                        data: JSON.stringify(model),
                        dataType: "json",
                        success: function (res) {
                            input.Object.select2({
                                data: res,
                                placeholder: 'Select Object',
                            });
                            input.tempObject.select2({
                                data: res,
                                placeholder: 'Select Object',
                            });
                            input.Object.select2("val", [preset.objectId, preset.objectId]);
                            input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
                        },
                        error: function () { }
                    });
                }
            });
            input.Display.on("change", function () {
                var elm = angular.element(this);
                //input.DataField.html('<option></option>').trigger("change");
                var val = elm.val();
                switch (val) {
                    case 'plain':
                        input.Unit.val("");
                        template.find(".temp-form").hide();
                        template.find('.chart-form').show();
                        break;
                    case 'temperature':
                        template.find(".temp-form").show();
                        template.find('.chart-form').hide();
                        break;
                    case 'heatmap':
                        input.Unit.val("");
                        template.find(".temp-form").hide();
                        template.find('.chart-form').hide();
                        break;
                    default:
                        input.Unit.val("");
                        template.find(".temp-form").hide();
                        template.find('.chart-form').show();
                        break;
                }
            });
            input.tempObject.on("change", function () {
                input.tempDataField.html('<option></option>').trigger("change");
                var objectId = $(this).val();
                var blockId = input.Block.val();
                var unit = input.Unit.val();
                var model = { BlockId: blockId, ObjectId: objectId, Unit: unit }
                var displayProfile = input.Display.val();
                if (displayProfile && displayProfile == "temperature") {
                    if (model.BlockId && model.ObjectId && model.Unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/DataField",
                            contentType: "application/json",
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                input.tempDataField.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                                input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
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
                                input.tempDataField.select2({
                                    data: res,
                                    placeholder: 'Select Data Field',
                                });
                                input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
                            },
                            error: function () { }
                        });
                    }
                }
            });

            input.OptionElm.bind("click", function () {
                var collapsed = $(this).closest(".box-tools").find(".chart-toggle").hasClass("collapsed");
                if (!collapsed) {
                    $(this).closest(".btn-group").find(".option-menu").toggleClass("active");
                }
            });
            input.ToggleElm.bind("click", function () {
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
            input.RemoveElm.bind("click", function () {
                $(this).closest(".box").remove();
                Local.Widget.Remove({
                    model: {
                        id: input.Widget.val()
                    },
                    success: function (removeResponse) {
                        console.log('removed!');
                    }
                });
            });
            input.CreateElm.bind("click", function () {

                var dateFlag;

                var range = input.DateFlag.val();
                range = range ? range.trim() : range;
                var ranges = range.split('-');
                ranges[0] = ranges[0] ? ranges[0].trim() : moment().format("DD/MM/YYYY")
                ranges[1] = ranges[1] ? ranges[1].trim() : moment().format("DD/MM/YYYY")

                var today = [
                  moment().format("DD/MM/YYYY"),
                  moment().format("DD/MM/YYYY")];
                var yesterday = [
                  moment().add(-1, 'days').format("DD/MM/YYYY"),
                  moment().add(-1, 'days').format("DD/MM/YYYY")];
                var thisweek = [
                  moment().startOf('isoweek').isoWeekday(1).format("DD/MM/YYYY"),
                  moment().format("DD/MM/YYYY")];
                var lastweek = [
                  moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("DD/MM/YYYY"),
                  moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("DD/MM/YYYY")];
                var thismonth = [
                  moment().date(1).format("DD/MM/YYYY"),
                  moment().format("DD/MM/YYYY")];
                var lastmonth = [
                  moment().subtract(1, 'months').date(1).format("DD/MM/YYYY"),
                  moment().date(1).subtract(1, 'days').format("DD/MM/YYYY")];


                if (ranges[0] == today[0] && ranges[1] == today[1]) {
                    dateFlag = "today";
                } else if (ranges[0] == yesterday[0] && ranges[1] == yesterday[1]) {
                    dateFlag = "yesterday";
                } else if (ranges[0] == thisweek[0] && ranges[1] == thisweek[1]) {
                    dateFlag = "thisweek";
                } else if (ranges[0] == lastweek[0] && ranges[1] == lastweek[1]) {
                    dateFlag = "lastweek";
                } else if (ranges[0] == thismonth[0] && ranges[1] == thismonth[1]) {
                    dateFlag = "thismonth";
                } else if (ranges[0] == lastmonth[0] && ranges[1] == lastmonth[1]) {
                    dateFlag = "lastmonth";
                } else {
                    dateFlag = "custom";
                }
                var model = {
                    id: input.Widget.val(),
                    unit: input.Unit.val(),
                    blockId: input.Block.val(),
                    objectId: input.Object.val(),
                    dateFlag: dateFlag,
                    chartType: input.ChartType.val(),
                    dataFieldId: input.DataField.val(),
                    displayProfile: input.Display.val(),
                    objectToCompareId: input.tempObject.val(),
                    dataFieldToCompareId: input.tempDataField.val(),
                };
                //model.displayProfile && model.blockId && model.unit && model.objectId && model.dataFieldId && model.dateFlag && model.chartType
                model.displayProfile = model.displayProfile ? model.displayProfile : 'plain';

                which(
                   model.displayProfile == 'plain',
                   function () {
                       if (model.displayProfile && model.blockId && model.objectId && model.dataFieldId && model.dateFlag && model.chartType) {
                           input.MaskElm.show();
                           input.OptionMenu.removeClass("active");
                           Local.Widget.Reading({
                               model: {
                                   blockId: model.blockId,
                                   objectId: model.objectId,
                                   dateFlag: input.DateFlag.val(),
                                   dataFieldId: model.dataFieldId,
                               },
                               success: function (res) {
                                   var data, name, raw, len, type;

                                   data = [];
                                   raw = res.data;
                                   len = raw.length;
                                   type = model.chartType;
                                   name = model.objectId + " " + model.dataFieldId;

                                   for (var i = 0; i < len; i++) {
                                       data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                   }

                                   if (dateFlag != "custom") {
                                       which(
                                       model.id,
                                       function () {
                                           Local.Widget.Update({
                                               model: {
                                                   id: model.id,
                                                   blockId: model.blockId,
                                                   objectId: model.objectId,
                                                   dateFlag: model.dateFlag,
                                                   chartType: model.chartType,
                                                   dataFieldId: model.dataFieldId,
                                                   displayProfile: model.displayProfile,
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
                                                   blockId: model.blockId,
                                                   objectId: model.objectId,
                                                   dateFlag: model.dateFlag,
                                                   chartType: model.chartType,
                                                   dataFieldId: model.dataFieldId,
                                                   displayProfile: model.displayProfile,
                                               },
                                               success: function (createResponse) {
                                                   if (createResponse.data.id) {
                                                       console.log('created!');
                                                       input.Widget.val(createResponse.data.id);
                                                   } else {
                                                       alert('create error!');
                                                   }
                                               }
                                           });
                                       });
                                   }
                                   input.MaskElm.hide();
                                   Local.Widget.Draw(function (config) {
                                       config.series.push({
                                           name: name,
                                           data: data
                                       });
                                       config.chart.type = type;
                                       config.elm = input.ChartElm;
                                       config.tooltip = {
                                           formatter: function () {
                                               var totip = '' +
                                                        '<b>  ' + this.series.name + '<b><br/>' +
                                                        '<span> time : ' + moment(new Date(this.point.x)).format("DD-MM-YYYY HH:mm") + '</span><br/>' +
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
                         model.displayProfile == 'heatmap',
                         function () {
                             if (model.displayProfile && model.blockId && model.objectId && model.dataFieldId && model.dateFlag) {
                                 input.MaskElm.show();
                                 input.OptionMenu.removeClass("active");
                                 Local.Widget.HeatMapReading({
                                     model: {
                                         blockId: model.blockId,
                                         objectId: model.objectId,
                                         dateFlag: input.DateFlag.val(),
                                         dataFieldId: model.dataFieldId,
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
                                             name: model.objectId + " " + model.dataFieldId
                                         });

                                         for (var i = 0; i < len ; i++) {
                                             var str = (i.toString()).length == 1 ? '0' + (i.toString()) + ':00' : i.toString() + ':00';
                                             xcat.push(str);
                                             ycat.push(raw[i].yc);
                                             series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                         }
                                         if (dateFlag != "custom") {
                                             which(
                                             model.id,
                                             function () {
                                                 Local.Widget.Update({
                                                     model: {
                                                         id: model.id,
                                                         blockId: model.blockId,
                                                         objectId: model.objectId,
                                                         dateFlag: model.dateFlag,
                                                         dataFieldId: model.dataFieldId,
                                                         displayProfile: model.displayProfile,
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
                                                         blockId: model.blockId,
                                                         objectId: model.objectId,
                                                         dateFlag: model.dateFlag,
                                                         chartType: model.chartType,
                                                         dataFieldId: model.dataFieldId,
                                                         displayProfile: model.displayProfile,
                                                     },
                                                     success: function (createResponse) {
                                                         if (createResponse.data.id) {
                                                             console.log('created!');
                                                             input.Widget.val(createResponse.data.id);
                                                         } else {
                                                             alert('create error!');
                                                         }
                                                     }
                                                 });
                                             });
                                         }
                                         input.MaskElm.hide();
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

                                                     //'<b>' + this.series.yAxis.categories[this.point.y] + ' ' + this.series.xAxis.categories[this.point.x] + '</b><br><b>' +
                                                     //'value: ' + this.point.value.toFixed(2) + '</b><br><b></b>';
                                                 }
                                             };
                                             config.series = series;
                                             config.colorAxis = {
                                                 min: 0,
                                                 minColor: '#FDF7B9',
                                                 maxColor: '#C4463A'
                                             };
                                             config.elm = input.ChartElm;
                                         });
                                     }
                                 });
                             }
                         },
                         function () {
                             if (model.displayProfile && model.blockId && model.unit && model.objectId && model.dataFieldId && model.objectToCompareId && model.dataFieldToCompareId && model.dateFlag) {
                                 input.MaskElm.show();
                                 input.OptionMenu.removeClass("active");
                                 Local.Widget.TemperatureProfileReading({
                                     model: {
                                         blockId: model.blockId,
                                         objectId: model.objectId,
                                         dateFlag: model.dateFlag == "custom" ? input.DateFlag.val() : model.dateFlag,
                                         dataFieldId: model.dataFieldId,
                                         objectToCompareId: model.objectToCompareId,
                                         dataFieldToCompareId: model.dataFieldToCompareId,
                                     },
                                     success: function (res) {
                                         var series = [],
                                           name = '',
                                           raw = [];
                                         series[0] = {};
                                         series[0].name = model.objectId + " " + model.dataFieldId;
                                         series[0].data = [];
                                         raw = res.data.s1;
                                         for (var i = 0; i < raw.length; i++) {
                                             series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                         }
                                         series[1] = {};
                                         series[1].name = model.objectToCompareId + " " + model.dataFieldToCompareId;
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
                                         if (dateFlag != "custom") {
                                             which(
                                             model.id,
                                             function () {
                                                 Local.Widget.Update({
                                                     model: {
                                                         id: model.id,
                                                         blockId: model.blockId,
                                                         objectId: model.objectId,
                                                         dateFlag: model.dateFlag,
                                                         dataFieldId: model.dataFieldId,
                                                         displayProfile: model.displayProfile,
                                                         objectToCompareId: model.objectToCompareId,
                                                         dataFieldToCompareId: model.dataFieldToCompareId,
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
                                                         blockId: model.blockId,
                                                         objectId: model.objectId,
                                                         dateFlag: model.dateFlag,
                                                         chartType: model.chartType,
                                                         dataFieldId: model.dataFieldId,
                                                         displayProfile: model.displayProfile,
                                                         objectToCompareId: model.objectToCompareId,
                                                         dataFieldToCompareId: model.dataFieldToCompareId,
                                                     },
                                                     success: function (createResponse) {
                                                         if (createResponse.data.id) {
                                                             console.log('created!');
                                                             input.Widget.val(createResponse.data.id);
                                                         } else {
                                                             alert('create error!');
                                                         }
                                                     }
                                                 });
                                             });
                                         }
                                         input.MaskElm.hide();
                                         Local.Widget.Draw(function (config) {
                                             delete config.yAxis.min;
                                             config.series = series;
                                             config.chart.type = 'line';
                                             config.elm = input.ChartElm;
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
                                                     return '<b>' + this.series.name + '</b><br><b>time : ' + new Date(this.x).getDate() + "-" + (new Date(this.x).getMonth() + 1) + "-" + new Date(this.x).getFullYear() + " " + new Date(this.x).getHours() + ":" + new Date(this.x).getMinutes() + '</b><br><b>value : ' + this.y.toFixed(3) + ' "C</b>';
                                                 }
                                             };
                                         });
                                     }
                                 });
                             }
                         });
                   });
            });

            input.tempElm.hide();
            input.typeElm.show();
            angular.element(".container").append(template);
        };
        Local.Widget.Render = function (option) {

            var container = angular.element(".container");
            option.data.forEach(function (preset) {

                var input = {}, template = $($("#template").html());
                input.MaskElm = template.find(".mask");
                input.ChartElm = template.find(".chart");
                input.tempElm = template.find(".temp-form");
                input.typeElm = template.find(".chart-form");
                input.CreateElm = template.find(".chart-create");
                input.OptionElm = template.find(".chart-option");
                input.ToggleElm = template.find(".chart-toggle");
                input.RemoveElm = template.find(".chart-remove");
                input.OptionMenu = template.find(".option-menu");

                input.Block = template.find(".block");
                input.Unit = template.find(".temp-unit");
                input.Widget = template.find(".widget");
                input.Object = template.find(".object");
                input.DateFlag = template.find(".date-flag");
                input.Display = template.find(".display-as");
                input.ChartType = template.find(".chart-type");
                input.DataField = template.find(".data-field");
                input.tempObject = template.find(".temp-object");
                input.tempDataField = template.find(".temp-data-field");


                input.Block.select2({
                    placeholder: 'Select Block',
                    allowClear: true
                });
                input.Unit.select2({
                    placeholder: 'Select Unit',
                    allowClear: true
                });
                input.Object.select2({
                    placeholder: 'Select Object',
                    allowClear: true
                });
                input.Display.select2({
                    placeholder: 'Select Display As',
                    allowClear: true
                });
                input.DataField.select2({
                    placeholder: 'Select Data Field',
                    allowClear: true
                });
                input.ChartType.select2({
                    placeholder: 'Select Chart Type',
                    allowClear: true
                });
                input.tempObject.select2({
                    placeholder: 'Select Object',
                    allowClear: true
                });
                input.tempDataField.select2({
                    placeholder: 'Select Data Field',
                    allowClear: true
                });
                input.DateFlag.daterangepicker({
                    locale: {
                        format: 'DD/MM/YYYY'
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
                    }
                });

                input.Block.on("change", function () {
                    input.Object.html('<option></option>').trigger("change");
                    input.DataField.html('<option></option>').trigger("change");
                    input.tempObject.html('<option></option>').trigger("change");
                    input.tempDataField.html('<option></option>').trigger("change");
                    var block = $(this).val();
                    var unit = input.Unit.val();
                    var model = { BlockId: block, Unit: unit };
                    var displayProfile = input.Display.val();
                    if (displayProfile && displayProfile == "temperature") {
                        if (block && unit) {
                            $.ajax({
                                type: "POST",
                                url: "/api/Object",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify(model),
                                success: function (res) {
                                    input.Object.select2({
                                        data: res,
                                        placeholder: 'Select Object',
                                    });
                                    input.tempObject.select2({
                                        data: res,
                                        placeholder: 'Select Object',
                                    });
                                    input.Object.select2("val", [preset.objectId, preset.objectId]);
                                    input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
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
                                dataType: "json",
                                data: JSON.stringify(model),
                                success: function (res) {
                                    input.Object.select2({
                                        data: res,
                                        placeholder: 'Select Object',
                                    });
                                    input.tempObject.select2({
                                        data: res,
                                        placeholder: 'Select Object',
                                    });
                                    input.Object.select2("val", [preset.objectId, preset.objectId]);
                                    input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
                                },
                                error: function () { }
                            });
                        }
                    }

                });
                input.Object.on("change", function () {
                    input.DataField.html('<option></option>').trigger("change");
                    input.tempDataField.html('<option></option>').trigger("change");
                    var objectId = $(this).val();
                    var blockId = input.Block.val();
                    var unit = input.Unit.val();
                    var model = { BlockId: blockId, ObjectId: objectId, Unit: unit };
                    var displayProfile = input.Display.val();
                    if (displayProfile && displayProfile == "temperature") {
                        if (model.BlockId && model.ObjectId && model.Unit) {
                            $.ajax({
                                type: "POST",
                                url: "/api/DataField",
                                contentType: "application/json",
                                data: JSON.stringify(model),
                                dataType: "json",
                                success: function (res) {
                                    input.DataField.select2({
                                        data: res,
                                        placeholder: 'Select Data Field',
                                    });
                                    input.tempDataField.select2({
                                        data: res,
                                        placeholder: 'Select Data Field',
                                    });
                                    input.DataField.select2("val", [preset.dataFieldId, preset.dataFieldId]);
                                    input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
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
                                    input.DataField.select2({
                                        data: res,
                                        placeholder: 'Select Data Field',
                                    });
                                    input.tempDataField.select2({
                                        data: res,
                                        placeholder: 'Select Data Field',
                                    });
                                    input.DataField.select2("val", [preset.dataFieldId, preset.dataFieldId]);
                                    input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
                                },
                                error: function () { }
                            });
                        }
                    }
                });
                input.Unit.on("change", function () {
                    input.Object.html('<option></option>').trigger("change");
                    input.DataField.html('<option></option>').trigger("change");
                    input.tempObject.html('<option></option>').trigger("change");
                    input.tempDataField.html('<option></option>').trigger("change");
                    var unit = $(this).val();
                    var block = input.Block.val();
                    var model = { BlockId: block, Unit: unit }
                    if (model.BlockId && model.Unit) {
                        $.ajax({
                            type: "POST",
                            url: "/api/Object",
                            contentType: "application/json",
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                input.Object.select2({
                                    data: res,
                                    placeholder: 'Select Object',
                                });
                                input.tempObject.select2({
                                    data: res,
                                    placeholder: 'Select Object',
                                });
                                input.Object.select2("val", [preset.objectId, preset.objectId]);
                                input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
                            },
                            error: function () { }
                        });
                    }
                });
                input.Display.on("change", function () {
                    var elm = angular.element(this);
                    //input.DataField.html('<option></option>').trigger("change");
                    var val = elm.val();
                    switch (val) {
                        case 'plain':
                            input.Unit.val("");
                            template.find(".temp-form").hide();
                            template.find('.chart-form').show();
                            break;
                        case 'temperature':

                            template.find(".temp-form").show();
                            template.find('.chart-form').hide();
                            break;
                        case 'heatmap':
                            input.Unit.val("");
                            template.find(".temp-form").hide();
                            template.find('.chart-form').hide();
                            break;
                        default:
                            input.Unit.val("");
                            template.find(".temp-form").hide();
                            template.find('.chart-form').show();
                            break;
                    }
                });
                input.tempObject.on("change", function () {
                    input.tempDataField.html('<option></option>').trigger("change");
                    var objectId = $(this).val();
                    var blockId = input.Block.val();
                    var unit = input.Unit.val();
                    var model = { BlockId: blockId, ObjectId: objectId, Unit: unit };
                    var displayProfile = input.Display.val();
                    if (displayProfile && displayProfile == "temperature") {
                        if (model.BlockId && model.ObjectId && model.Unit) {
                            $.ajax({
                                type: "POST",
                                url: "/api/DataField",
                                contentType: "application/json",
                                data: JSON.stringify(model),
                                dataType: "json",
                                success: function (res) {
                                    input.tempDataField.select2({
                                        data: res,
                                        placeholder: 'Select Data Field',
                                    });
                                    input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
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
                                    input.tempDataField.select2({
                                        data: res,
                                        placeholder: 'Select Data Field',
                                    });
                                    input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
                                },
                                error: function () { }
                            });
                        }
                    }
                });

                input.OptionElm.bind("click", function () {
                    var collapsed = $(this).closest(".box-tools").find(".chart-toggle").hasClass("collapsed");
                    if (!collapsed) {
                        $(this).closest(".btn-group").find(".option-menu").toggleClass("active");
                    }
                });
                input.ToggleElm.bind("click", function () {
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
                input.RemoveElm.bind("click", function () {
                    $(this).closest(".box").remove();
                    Local.Widget.Remove({
                        model: {
                            id: input.Widget.val()
                        },
                        success: function (removeResponse) {
                            console.log('removed!');
                        }
                    });
                });
                input.CreateElm.bind("click", function (event, edata) {
                    which(
                      edata,
                      function () {
                          which(
                            edata.preset.displayProfile == 'plain',
                            function () {
                                input.MaskElm.show();
                                input.OptionMenu.removeClass("active");
                                Local.Widget.Reading({
                                    model: {
                                        blockId: edata.preset.blockId,
                                        objectId: edata.preset.objectId,
                                        dateFlag: edata.preset.dateFlag,
                                        dataFieldId: edata.preset.dataFieldId,
                                    },
                                    success: function (res) {
                                        var data, name, raw, len, type;

                                        data = [];
                                        raw = res.data;
                                        len = raw.length;
                                        type = edata.preset.chartType;
                                        name = edata.preset.objectId + " " + edata.preset.dataFieldId;

                                        for (var i = 0; i < len; i++) {
                                            data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                        }

                                        input.MaskElm.hide();
                                        Local.Widget.Draw(function (config) {
                                            config.series.push({
                                                name: name,
                                                data: data
                                            });
                                            config.chart.type = type;
                                            config.elm = input.ChartElm;
                                            config.tooltip = {
                                                formatter: function () {
                                                    var totip = '' +
                                                        '<b>  ' + this.series.name + '<b><br/>' +
                                                        '<span> time : ' + moment(new Date(this.point.x)).format("DD-MM-YYYY HH:mm") + '</span><br/>' +
                                                        '<span> value : ' + this.point.y.toFixed(2) + '</span><br/>';
                                                    return totip;
                                                }
                                            };
                                        });
                                    }
                                });
                            },
                            function () {
                                which(
                                  edata.preset.displayProfile == 'heatmap',
                                  function () {
                                      input.MaskElm.show();
                                      input.OptionMenu.removeClass("active");
                                      Local.Widget.HeatMapReading({
                                          model: {
                                              blockId: edata.preset.blockId,
                                              objectId: edata.preset.objectId,
                                              dateFlag: edata.preset.dateFlag,
                                              dataFieldId: edata.preset.dataFieldId,
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
                                                  name: edata.preset.objectId + " " + edata.preset.dataFieldId
                                              });

                                              for (var i = 0; i < len ; i++) {
                                                  var str = (i.toString()).length == 1 ? '0' + (i.toString()) + ':00' : i.toString() + ':00';
                                                  xcat.push(str);
                                                  ycat.push(raw[i].yc);
                                                  series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                              }
                                              input.MaskElm.hide();
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
                                                  config.elm = input.ChartElm;
                                              });
                                          }
                                      });
                                  },
                                  function () {
                                      input.MaskElm.show();
                                      input.OptionMenu.removeClass("active");
                                      Local.Widget.TemperatureProfileReading({
                                          model: {
                                              blockId: edata.preset.blockId,
                                              objectId: edata.preset.objectId,
                                              dateFlag: edata.preset.dateFlag,
                                              dataFieldId: edata.preset.dataFieldId,
                                              objectToCompareId: edata.preset.objectToCompareId,
                                              dataFieldToCompareId: edata.preset.dataFieldToCompareId,
                                          },
                                          success: function (res) {
                                              var series = [],
                                                name = '',
                                                raw = [];
                                              series[0] = {};
                                              series[0].name = edata.preset.objectId + " " + edata.preset.dataFieldId;
                                              series[0].data = [];
                                              raw = res.data.s1;
                                              for (var i = 0; i < raw.length; i++) {
                                                  series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                              }
                                              series[1] = {};
                                              series[1].name = edata.preset.objectToCompareId + " " + edata.preset.dataFieldToCompareId;;
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

                                              input.MaskElm.hide();
                                              Local.Widget.Draw(function (config) {
                                                  config.series = series;
                                                  config.chart.type = 'line';
                                                  config.elm = input.ChartElm;
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
                                                          return '<b>' + this.series.name + '</b><br><span>time : ' + new Date(this.x).getDate() + "-" + (new Date(this.x).getMonth() + 1) + "-" + new Date(this.x).getFullYear() + " " + new Date(this.x).getHours() + ":" + new Date(this.x).getMinutes() + '</span><br><span>value : ' + this.y.toFixed(3) + ' "C</span>';
                                                      }
                                                  };
                                              });
                                          }
                                      });
                                  });
                            });
                      },
                      function () {
                          var dateFlag;

                          var range = input.DateFlag.val();
                          range = range ? range.trim() : range;
                          var ranges = range.split('-');
                          ranges[0] = ranges[0] ? ranges[0].trim() : moment().format("DD/MM/YYYY");
                          ranges[1] = ranges[1] ? ranges[1].trim() : moment().format("DD/MM/YYYY");

                          var today = [
                            moment().format("DD/MM/YYYY"),
                            moment().format("DD/MM/YYYY")];
                          var yesterday = [
                            moment().add(-1, 'days').format("DD/MM/YYYY"),
                            moment().add(-1, 'days').format("DD/MM/YYYY")];
                          var thisweek = [
                            moment().startOf('isoweek').isoWeekday(1).format("DD/MM/YYYY"),
                            moment().format("DD/MM/YYYY")];
                          var lastweek = [
                            moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("DD/MM/YYYY"),
                            moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("DD/MM/YYYY")];
                          var thismonth = [
                            moment().date(1).format("DD/MM/YYYY"),
                            moment().format("DD/MM/YYYY")];
                          var lastmonth = [
                            moment().subtract(1, 'months').date(1).format("DD/MM/YYYY"),
                            moment().date(1).subtract(1, 'days').format("DD/MM/YYYY")];

                          if (ranges[0] == today[0] && ranges[1] == today[1]) {
                              dateFlag = "today";
                          } else if (ranges[0] == yesterday[0] && ranges[1] == yesterday[1]) {
                              dateFlag = "yesterday";
                          } else if (ranges[0] == thisweek[0] && ranges[1] == thisweek[1]) {
                              dateFlag = "thisweek";
                          } else if (ranges[0] == lastweek[0] && ranges[1] == lastweek[1]) {
                              dateFlag = "lastweek";
                          } else if (ranges[0] == thismonth[0] && ranges[1] == thismonth[1]) {
                              dateFlag = "thismonth";
                          } else if (ranges[0] == lastmonth[0] && ranges[1] == lastmonth[1]) {
                              dateFlag = "lastmonth";
                          } else {
                              dateFlag = "custom";
                          }

                          var model = {
                              id: preset.id,
                              unit: input.Unit.val(),
                              blockId: input.Block.val(),
                              objectId: input.Object.val(),
                              dateFlag: dateFlag,
                              chartType: input.ChartType.val(),
                              dataFieldId: input.DataField.val(),
                              displayProfile: input.Display.val(),
                              objectToCompareId: input.tempObject.val(),
                              dataFieldToCompareId: input.tempDataField.val(),
                          };


                          model.displayProfile = model.displayProfile ? model.displayProfile : 'plain';
                          which(
                            model.displayProfile == 'plain',
                            function () {
                                input.MaskElm.show();
                                input.OptionMenu.removeClass("active");
                                Local.Widget.Reading({
                                    model: {
                                        blockId: model.blockId,
                                        objectId: model.objectId,
                                        dateFlag: model.dateFlag == "custom" ? input.DateFlag.val() : dateFlag,
                                        dataFieldId: model.dataFieldId,
                                    },
                                    success: function (res) {
                                        var data, name, raw, len, type;
                                        data = [];
                                        raw = res.data;
                                        len = raw.length;
                                        type = model.chartType;
                                        name = model.objectId + " " + model.dataFieldId;

                                        for (var i = 0; i < len; i++) {
                                            data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                        }

                                        input.MaskElm.hide();
                                        if (dateFlag != "custom") {
                                            if (model.displayProfile && model.blockId && model.objectId && model.dataFieldId && model.chartType && dateFlag) {
                                                Local.Widget.Update({
                                                    model: {
                                                        id: model.id,
                                                        blockId: model.blockId,
                                                        objectId: model.objectId,
                                                        dateFlag: dateFlag,
                                                        chartType: model.chartType,
                                                        dataFieldId: model.dataFieldId,
                                                        displayProfile: model.displayProfile,
                                                    },
                                                    success: function (updateResponse) {
                                                        console.log('updated!');
                                                    }
                                                });
                                            }
                                        }
                                        Local.Widget.Draw(function (config) {
                                            config.series.push({
                                                name: name,
                                                data: data
                                            });
                                            config.chart.type = type;
                                            config.elm = input.ChartElm;
                                        });
                                    }
                                });
                            },
                            function () {
                                which(
                                  model.displayProfile == 'heatmap',
                                  function () {
                                      input.MaskElm.show();
                                      input.OptionMenu.removeClass("active");
                                      Local.Widget.HeatMapReading({
                                          model: {
                                              blockId: model.blockId,
                                              objectId: model.objectId,
                                              dateFlag: input.DateFlag.val(),
                                              dataFieldId: model.dataFieldId,
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
                                                  name: model.objectId + " " + model.dataFieldId
                                              });

                                              for (var i = 0; i < len ; i++) {
                                                  var str = (i.toString()).length == 1 ? '0' + (i.toString()) + ':00' : i.toString() + ':00';
                                                  xcat.push(str);
                                                  ycat.push(raw[i].yc);
                                                  series[0].data.push([raw[i].x, raw[i].y, raw[i].p]);
                                              }

                                              input.MaskElm.hide();
                                              if (dateFlag != "custom") {
                                                  if (model.displayProfile && model.blockId && model.objectId && model.dataFieldId && dateFlag) {
                                                      Local.Widget.Update({
                                                          model: {
                                                              id: model.id,
                                                              blockId: model.blockId,
                                                              objectId: model.objectId,
                                                              dateFlag: model.dateFlag,
                                                              dataFieldId: model.dataFieldId,
                                                              displayProfile: model.displayProfile,
                                                          },
                                                          success: function (updateResponse) {
                                                              console.log('updated!');
                                                          }
                                                      });
                                                  }
                                              }
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
                                                  config.elm = input.ChartElm;
                                              });
                                          }
                                      });
                                  },
                                  function () {
                                      input.MaskElm.show();
                                      input.OptionMenu.removeClass("active");
                                      Local.Widget.TemperatureProfileReading({
                                          model: {
                                              blockId: model.blockId,
                                              objectId: model.objectId,
                                              dateFlag: model.dateFlag == "custom" ? input.DateFlag.val() : model.dateFlag,
                                              dataFieldId: model.dataFieldId,
                                              objectToCompareId: model.objectToCompareId,
                                              dataFieldToCompareId: model.dataFieldToCompareId,
                                          },
                                          success: function (res) {
                                              var series = [],
                                                name = '',
                                                raw = [];
                                              series[0] = {};
                                              series[0].name = model.objectId + " " + model.dataFieldId;
                                              series[0].data = [];
                                              raw = res.data.s1;
                                              for (var i = 0; i < raw.length; i++) {
                                                  series[0].data.push([Date.UTC(raw[i].YY, raw[i].MM, raw[i].DD, raw[i].hh, raw[i].mm, raw[i].ss), raw[i].value]);
                                              }
                                              series[1] = {};
                                              series[1].name = model.objectToCompareId + " " + model.dataFieldToCompareId;
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

                                              input.MaskElm.hide();
                                              if (dateFlag != "custom") {
                                                  if (model.displayProfile && model.blockId && model.objectId && model.dataFieldId && model.objectToCompareId && model.dataFieldToCompareId && model.unit && dateFlag) {
                                                      Local.Widget.Update({
                                                          model: {
                                                              id: model.id,
                                                              unit: model.unit,
                                                              blockId: model.blockId,
                                                              objectId: model.objectId,
                                                              dateFlag: model.dateFlag,
                                                              dataFieldId: model.dataFieldId,
                                                              displayProfile: model.displayProfile,
                                                              objectToCompareId: model.objectToCompareId,
                                                              dataFieldToCompareId: model.dataFieldToCompareId,
                                                          },
                                                          success: function (updateResponse) {
                                                              console.log('updated!');
                                                          }
                                                      });
                                                  }
                                              }
                                              Local.Widget.Draw(function (config) {
                                                  config.series = series;
                                                  config.chart.type = 'line';
                                                  config.elm = input.ChartElm;
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
                                              });
                                          }
                                      });
                                  });
                            });
                      });
                });

                input.Widget.val(preset.id);
                input.Block.select2("val", [preset.blockId, preset.blockText]);
                input.Unit.select2("val", [preset.blockId, preset.blockText]);
                input.Object.select2("val", [preset.objectId, preset.objectId]);


                var dateFlagValue = '';
                var today = [
                  moment().format("DD/MM/YYYY"),
                  moment().format("DD/MM/YYYY")];
                var yesterday = [
                  moment().add(-1, 'days').format("DD/MM/YYYY"),
                  moment().add(-1, 'days').format("DD/MM/YYYY")];
                var thisweek = [
                  moment().startOf('isoweek').isoWeekday(1).format("DD/MM/YYYY"),
                  moment().format("DD/MM/YYYY")];
                var lastweek = [
                  moment().startOf('isoweek').add(-7, 'days').isoWeekday(1).format("DD/MM/YYYY"),
                  moment().startOf('isoweek').add(-7, 'days').isoWeekday(7).format("DD/MM/YYYY")];
                var thismonth = [
                  moment().date(1).format("DD/MM/YYYY"),
                  moment().format("DD/MM/YYYY")];
                var lastmonth = [
                  moment().subtract(1, 'months').date(1).format("DD/MM/YYYY"),
                  moment().date(1).subtract(1, 'days').format("DD/MM/YYYY")];

                switch (preset.dateFlag) {
                    case "today":
                        dateFlagValue = today[0] + " - " + today[1];
                        break;
                    case "yesterday":
                        dateFlagValue = yesterday[0] + " - " + yesterday[1];
                        break;
                    case "thisweek":
                        dateFlagValue = thisweek[0] + " - " + thisweek[1];
                        break;
                    case "lastweek":
                        dateFlagValue = lastweek[0] + " - " + lastweek[1];
                        break;
                    case "thismonth":
                        dateFlagValue = thismonth[0] + " - " + thismonth[1];
                        break;
                    case "lastmonth":
                        dateFlagValue = lastmonth[0] + " - " + lastmonth[1];
                        break;
                    default:
                        dateFlagValue = today[0] + " - " + today[1];
                        break;
                }

                input.DateFlag.val(dateFlagValue);
                input.Unit.select2("val", [preset.unit, preset.unit]);
                input.DataField.select2("val", [preset.dataFieldId, preset.dataFieldId]);
                input.ChartType.select2("val", [preset.chartType, preset.chartTypeText]);
                input.Display.select2("val", [preset.displayProfile, preset.displayProfile]);

                which(preset.displayProfile == 'plain', function () {
                    input.tempElm.hide();
                    input.typeElm.show();
                    input.ChartType.select2("val", [preset.chartType, preset.chartTypeText]);
                }, function () {
                    which(preset.displayProfile == 'temperature', function () {
                        input.tempElm.show();
                        input.typeElm.hide();
                        input.Unit.select2("val", [preset.unit, preset.unit]);
                        input.tempObject.select2("val", [preset.objectToCompareId, preset.objectToCompareId]);
                        input.tempDataField.select2("val", [preset.dataFieldToCompareId, preset.dataFieldToCompareId]);
                    }, function () {
                        input.tempElm.hide();
                        input.typeElm.hide();
                        input.ChartType.select2("val", [preset.chartType, preset.chartTypeText]);
                    });
                });

                container.append(template);
                input.CreateElm.trigger("click", [{ preset: preset }]);
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
                        text: null
                    },
                    type: 'datetime',
                    startOnTick: false,
                    tickInterval: 60 * 60 * 1000,
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
        $rootScope.show = ready.show;
    });






