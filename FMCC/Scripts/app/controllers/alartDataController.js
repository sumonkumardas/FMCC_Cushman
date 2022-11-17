angular
    .module("fmccwebportal")
    .controller("alertDataController", function ($scope, $http, $rootScope) {
        $scope.form = {};
        $scope.form.mode = {};
        $scope.form.mode.edit = false;

        var formElm = {
            Id: $("#alertRuleSetupId"),
            AlertText: $("#alertRuleSetupAlertText"),
            Remarks: $("#alertRuleSetupRemarks"),
            Type: $("#alertRuleSetupType"),
            Block: $("#alertRuleSetupBlock"),
            Object: $("#alertRuleSetupObject"),
            MultiDatafield: $("#alertRuleSetupMultiData"),
            DataField: $("#alertRuleSetupDataField"),
            //ThresholdValue: $("#alertRuleSetupThreshold"),
            Condition: $("#alertRuleSetupCondition"),
            Severity: $("#alertRuleSetupSeverity"),
            ReferenceValue: $("#alertRuleSetupReference"),
            SiteId:$('#siteId').val(),
            //Percenage: $("#alertRulePercentage"),
            FixedRuleByFMCC: $("#alertRuleSetupFixedRuleByFMCC").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' // optional
            }),
            SatDay: $("#chkSaturday").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'

            }),
            SunDay: $("#chkSunday").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            }),
            MonDay: $("#chkMonday").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            }),
            TueDay: $("#chkTuesday").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            }),
            WedDay: $("#chkWednesday").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            }),
            ThrDay: $("#chkThursay").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            }),
            FriDay: $("#chkFriday").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            })

        };

        $("#startdate").datetimepicker({
            format: "hh:mm A"
        });

        $("#post_startdate").datetimepicker({
            format: "YYYY-MM-DD"
        });

        $("#post_enddate").datetimepicker({
            format: "YYYY-MM-DD"
        });

        $("#enddate").datetimepicker({
            format: "hh:mm A"
        });

        formElm.Block.select2({
            allowClear: true
        });

        formElm.Object.select2({
            allowClear: true

        });

        formElm.MultiDatafield.select2({
            allowClear: true

        });

        formElm.DataField.select2({
            allowClear: true
        });

        formElm.Condition.select2({
            allowClear: true
        });

        formElm.Severity.select2({
            allowClear: true
        });

        formElm.Type.select2({
            allowClear: true,
        });

        $http.get("/api/alertrule/block", { params: { siteId: $("#siteId").val() } }).then(function (res) {
            formElm.Block.select2({
                allowClear: true,
                data: res.data.model
            });
        });


        formElm.Block.on("change", function () {
            var elm = $(this);
            var value = elm.val();
            formElm.Object.html("<option></option>");
            $http.post("/api/alertrule/object", { BuildingFkId: value }).then(function (res) {
                formElm.Object.select2({
                    allowClear: true,
                    data: res.data.model
                });

            });




            formElm.MultiDatafield.html("<option></option>");

            $http.post("/api/alertrule/tempdatafield", { BuildingFkId: value }).then(function (result) {
                formElm.MultiDatafield.select2({
                    allowClear: true,
                    data: result.data.model
                });

            });
        });

        formElm.Object.on("change", function () {
            var elm = $(this);
            var ovalue = elm.val();
            var bvalue = formElm.Block.val();
            formElm.DataField.html("<option></option>");
            $http.post("/api/alertrule/datafield", { BuildingFkId: bvalue, ObjectFkId: ovalue }).then(function (res) {
                formElm.DataField.select2({
                    allowClear: true,
                    data: res.data.model
                });


                var omodel = formElm.DataField.data("model");
                if (omodel && omodel.dataFieldId) {
                    formElm.DataField.val(omodel.dataFieldId).trigger("change");
                }


            });
        });

        formElm.Type.on("change", function () {
            var elm = $(this);
            var ovalue = elm.val();
            if (ovalue == 1 || ovalue == 2) {
                $('#divObject').hide();
                $('#divDatafield').hide();
                $('#divMultiData').hide();
                $('.percentage').hide();
            }
            else if (ovalue == 3) {
                $('#divObject').hide();
                $('#divMultiData').show();
                $('#divDatafield').hide();
                //$('.percentage').show();

            } else {
                $('#divObject').show();
                $('#divDatafield').show();
                $('#divMultiData').hide();
               // $('.percentage').hide();
            }
        });

        var alertRuleSetupTable = $("#alarm-rule-setup-table").DataTable({
            ajax: {
                url: '/api/alertrule/readall',
                dataSrc: "model",
                data: function (d) { }
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
            columns: [{
                data: "BuildingId",
                title: "Block"
            }, {
                data: "ObjectId",
                title: "Object"
            }, {
                data: "DataFieldId",
                title: "Data Field"
            }, {
                data: "Condition",
                render: function (data) {
                    if (data == 1) {
                        return "Above";
                    } else if (data == 2) {
                        return "Below";
                    } else if (data == 3) {
                        return "Deviate";
                    }
                },
                title: "Condition"
            }
            //,{
            //    data: "ThresholdValue",
            //    title: "Threshold"
            //}
            , {
                data: "Severity",
                render: function (data) {
                    if (data == 1) {
                        return "Minor";
                    } else if (data == 2) {
                        return "Major";
                    } else if (data == 3) {
                        return "Critical";
                    }
                },
                title: "Severity"
            }, {
                data: "Type",
                title: "Type",
            },
            {
                data: "ReferenceValue",
                title: "Reference"
            }
            , {
                data: null,
                title: "Action",
                render: function () {
                    return "<a href='javascript:void(0)'>Select</a>";
                },
            },
                {
                    data: null,
                    title:'Process',
                    render: function() {
                        return "<button type=\"button\" class=\"btn btn-info btn-sm myModal\"   data-target=\"#myModal\" >Process</button> <span style=\"display:none\"> <img width=\"24px;\"    src=\"/images/gif/ajax-loader-large.gif\" /></span>";
                    }
                }
            ]
        });
        function parseIsoDatetime(dtstr) {
            var dt = dtstr.split(/[: T-]/).map(parseFloat);
            return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
        }
        alertRuleSetupTable.on("click", "td", function (e) {
            $scope.form.mode.edit = true;
            $($(e.target).next()[0]).show();
            var rowElem = $(this);
            var rowData = alertRuleSetupTable.row(this).data();
            var idx = alertRuleSetupTable.cell(this).index().column;
            if (idx == 8) {

                
                $("#myModal").modal();

                $("#myModal .btnProcess").on("click", function (ex) {
                    if (!$("#post_startdate").val()) {
                        alert("Please select a start date");
                        return;
                    }
                    else if (!$("#post_enddate").val()) {
                        alert("Please select a end date");
                        return;
                    }

                    var d1 = new Date($("#post_startdate").val());
                    var d2 = new Date($("#post_enddate").val());

                    if (d1 > d2) {
                        alert("Start date cannot be greater than End date");
                        return;
                    }

                    $('#myModal').modal('hide');
                    $http.post("/api/alertrule/postprocessingalert", { AlertRuleId: rowData.Id, StartDateTime: d1, EndDateTime: $("#post_enddate").val() }).then(function (result) {
                        $($(e.target).next()[0]).hide();

                    });
                });

                return;
            }


            $http.get("/api/alertrule/readabyid", {
                params: { id: rowData.Id }
            }).then(function (msg) {
                if (msg.data.okay) {
                    formElm.Id.val(msg.data.model.Id);
                    formElm.Block.val(msg.data.model.BuildingFkId).trigger("change");
                    $http.post("/api/alertrule/object", { BuildingFkId: msg.data.model.BuildingFkId }).then(function (res) {
                        formElm.Object.select2({
                            allowClear: true,
                            data: res.data.model
                        });
                        formElm.Object.val(msg.data.model.ObjectFkId);
                    });

                    $http.post("/api/alertrule/datafield", { BuildingFkId: msg.data.model.BuildingFkId, ObjectFkId: msg.data.model.ObjectFkId }).then(function (res) {
                        formElm.DataField.select2({
                            allowClear: true,
                            data: res.data.model
                        });
                        formElm.DataField.val(msg.data.model.DataFieldFkId).trigger("change");
                    });

                    //var $multiSelect = $("#alertRuleSetupMultiData").select2();
                    //$multiSelect.val(msg.data.model.SelectedDataIds.split(",")).trigger("change");
                    $http.post("/api/alertrule/tempdatafield", { BuildingFkId: msg.data.model.BuildingFkId }).then(function (res) {
                        formElm.Object.select2({
                            allowClear: true,
                            data: res.data.model
                        });

                        formElm.MultiDatafield.val(msg.data.model.SelectedDataIds.split(",")).trigger("change");

                    });
                    
                    //$('#alertRuleSetupMultiData').val(msg.data.model.SelectedDataIds.split(",")).trigger("change");
                    //formElm.Percenage.val(msg.data.model.Percenage);
                    formElm.Id.val(msg.data.model.Id);
                    formElm.AlertText.val(msg.data.model.AlertText);
                    formElm.Remarks.val(msg.data.model.Remarks);
                    formElm.Type.val(msg.data.model.Type).trigger("change");
                    if (msg.data.model.SelectedDataIds == "")
                        $('#divMultiData').hide();
                    else
                        $('#divMultiData').show();
                    //formElm.ThresholdValue.val(rowData.ThresholdValue);
                    formElm.Condition.val(msg.data.model.Condition).trigger("change");
                    formElm.Severity.val(msg.data.model.Severity).trigger("change");
                    formElm.ReferenceValue.val(msg.data.model.ReferenceValue);
                    var d = parseIsoDatetime(msg.data.model.StartDate);
                    $("#startdate").val(d.toLocaleTimeString());
                    d = parseIsoDatetime(msg.data.model.EndDate);
                    $("#enddate").val(d.toLocaleTimeString());
                    if (msg.data.model.FixedRuleByFMCC) {
                        formElm.FixedRuleByFMCC.iCheck("check");
                    } else {
                        formElm.FixedRuleByFMCC.iCheck("uncheck");
                    }

                    var rowWeekData = msg.data.model.WeekDays;

                    if ((rowWeekData.indexOf('sat') !== -1) == true)
                        formElm.SatDay.iCheck("check");
                    else
                        formElm.SatDay.iCheck("uncheck");

                    if ((rowWeekData.indexOf('sun') !== -1) == true)
                        formElm.SunDay.iCheck("check");
                    else
                        formElm.SunDay.iCheck("uncheck");

                    if ((rowWeekData.indexOf('mon') !== -1) == true)
                        formElm.MonDay.iCheck("check");
                    else
                        formElm.MonDay.iCheck("uncheck");

                    if ((rowWeekData.indexOf('tue') !== -1) == true)
                        formElm.TueDay.iCheck("check");
                    else
                        formElm.TueDay.iCheck("uncheck");

                    if ((rowWeekData.indexOf('wed') !== -1) == true)
                        formElm.WedDay.iCheck("check");
                    else
                        formElm.WedDay.iCheck("uncheck");

                    if ((rowWeekData.indexOf('thu') !== -1) == true)
                        formElm.ThrDay.iCheck("check");
                    else
                        formElm.ThrDay.iCheck("uncheck");

                    if ((rowWeekData.indexOf('fri') !== -1) == true)
                        formElm.FriDay.iCheck("check");
                    else
                        formElm.FriDay.iCheck("uncheck");
                } else {
                    console.log(msg);
                }
            }, function () {
                alert('Sorry');
            });



        });


        $scope.validateAlertRuleSetupForm = function () {
            var model = {};
            if (!formElm.AlertText.val()) {
                alert("Please enter a alert text");
                return;
            }
            else if (!formElm.Remarks.val()) {
                alert("Please enter a remarks");
                return;
            }
            else if (!formElm.Type.val()) {
                alert("Please select a Type");
                return;

            }
            //else if (formElm.Type.val() == 3 && !formElm.MultiDatafield.val()) {
            //    //if (!formElm.Object.val()) {
            //    //    alert("Please select an object");
            //    //    return;
            //    //}
            //    //else
            //    //if (!formElm.MultiDatafield.val()) {
            //    //    alert("Please select a data field");
            //    //    return;
            //    //}

            //    //if (!formElm.Percenage.val()) {
            //    //    alert("Please select a percentage");
            //    //    return;
            //    //}

            //}
            else if (!formElm.Block.val()) {
                alert("Please select a block");
                return;
            }
                // else if (!formElm.Object.val()) {
                //    alert("Please select an object");
                //} else if (!formElm.DataField.val()) {
                //    alert("Please select a data field");
                //}
                //else if (!formElm.ThresholdValue.val()) {
                //    alert("Please enter a threshold value");
                //}
            else if (!formElm.Condition.val()) {
                alert("Please select a condition");
                return;
            }
            else if (!formElm.Severity.val()) {
                alert("Please select a severity");
                return;
            }
            else if (!formElm.ReferenceValue.val()) {
                alert("Please select a reference value");
                return;
            }
            else if (!$("#startdate").val()) {
                alert("Please select a start date");
                return;
            }
            else if (!$("#enddate").val()) {
                alert("Please select a end date");
                return;
            }



            else {
                model.Id = formElm.Id.val();
                model.AlertText = formElm.AlertText.val();
                model.Remarks = formElm.Remarks.val();
                //model.AlertNotifyUser = formElm.NotifyUser.val();
                model.BuildingFkId = formElm.Block.val();
                model.ObjectFkId = formElm.Object.val();
                model.DataFieldFkId = formElm.DataField.val();
                //model.ThresholdValue = formElm.ThresholdValue.val();
                model.Condition = formElm.Condition.val();
                //model.Percentage = parseFloat(formElm.Percenage.val());
                model.SelectedDataIds = model.SelectedDataIds = (formElm.MultiDatafield.val()) ? formElm.MultiDatafield.val().toString() : '';
                ;
                model.ReferenceValue = formElm.ReferenceValue.val();
                model.Severity = formElm.Severity.val();
                model.FixedRuleByFMCC = formElm.FixedRuleByFMCC[0].checked;
                model.StartDate = $("#startdate").val();
                model.EndDate = $("#enddate").val();
                model.Type = formElm.Type.val();

                var weekdays = '';
                if (formElm.SatDay[0].checked) {
                    weekdays += 'sat,'
                }
                if (formElm.SunDay[0].checked) {
                    weekdays += 'sun,'
                }
                if (formElm.MonDay[0].checked) {
                    weekdays += 'mon,'
                }
                if (formElm.TueDay[0].checked) {
                    weekdays += 'tue,'
                }
                if (formElm.WedDay[0].checked) {
                    weekdays += 'wed,'
                }
                if (formElm.ThrDay[0].checked) {
                    weekdays += 'thu,'
                }
                if (formElm.FriDay[0].checked) {
                    weekdays += 'fri,'
                }
                model.WeekDays = weekdays;
                return model;
            }
        };

        $scope.cancelAlertRuleSetup = function (model) {
            formElm.Id.empty(),
            formElm.AlertText.val('');
            formElm.Remarks.val('');
            formElm.FixedRuleByFMCC.iCheck('uncheck');
            formElm.Type.val(null).trigger('change');
            formElm.Block.val('').trigger('change');
            formElm.Object.val('').trigger('change');
            formElm.DataField.val('').trigger('change');
            //formElm.Percenage.val('');
            formElm.MultiDatafield.val('').trigger('change');
            //formElm.ThresholdValue.val('');
            formElm.Condition.val('').trigger('change');
            formElm.Severity.val('').trigger('change');
            formElm.ReferenceValue.val('');
            $('#startdate').val('');
            $('#enddate').val('');
            formElm.SatDay.iCheck('uncheck');
            formElm.SunDay.iCheck('uncheck');
            formElm.MonDay.iCheck('uncheck');
            formElm.TueDay.iCheck('uncheck');
            formElm.WedDay.iCheck('uncheck');
            formElm.ThrDay.iCheck('uncheck');
            formElm.FriDay.iCheck('uncheck');
            $scope.form.mode.edit = false;
        };

        $scope.updateAlertRuleSetup = function (model) {
            var model = $scope.validateAlertRuleSetupForm();
            if (model) {
                $http.post("/api/alertrule/update", model).then(function (res) {
                    alertRuleSetupTable.ajax.reload();
                    $scope.form.mode.edit = false;
                    $scope.cancelAlertRuleSetup();
                })
            } else {
                return;
            }
        };

        $scope.deleteAlertRuleSetup = function (model) {
            var model = $scope.validateAlertRuleSetupForm();
            if (model) {
                $http.post("/api/alertrule/delete", model).then(function (res) {
                    alertRuleSetupTable.ajax.reload();
                    $scope.form.mode.edit = false;
                    $scope.cancelAlertRuleSetup();
                })
            } else {
                return;
            }
        };

        $scope.submitAlertRuleSetup = function () {
            var model = $scope.validateAlertRuleSetupForm();
            if (model) {
                $http.post("/api/alertrule/create", model).then(function (res) {
                    $scope.cancelAlertRuleSetup();
                    alertRuleSetupTable.ajax.reload();
                })
            }
        };

    });


