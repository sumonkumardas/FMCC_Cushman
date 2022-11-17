angular.module("fmccwebportal").controller('onOffMappingController', function ($scope, $http, $rootScope) {
    var input = {
        Id: $("#onoffId"),
        objectId: $("#objectId"),
        objectName: $("#objectName"),
        dataFieldId: $("#dataFieldId"),
        dataFieldName: $("#dataFieldName"),
        Type: $("#eqType"),
        On: $("#equOnValue"),
        Off: $("#equOffValue"),
        Thresold: $("#equThresold")
    };
    //var table = {
    //    power: $("#onOffObjectList").DataTable({
    //        ajax: {
    //            url: '/api/setupapi/loadpowerdatafieldunitlist',
    //            dataSrc: "data"
    //        },
    //        language: {
    //            search: "",
    //            searchPlaceholder: "Search",
    //            paginate: {
    //                next: "»",
    //                previous: "«"
    //            },
    //        },
    //        processing: true,
    //        serverSide: true,
    //        ordering: false,
    //        paging: true,
    //        searching: false,
    //        pageLength: 10,
    //        columns: [
    //            { data: "ObjectDataField", title: "Object Data Field" },
    //            { data: "UnitName", title: "Unit Name" }
    //        ]
    //    }),
    //    water: $("#wtable").DataTable({
    //        ajax: {
    //            url: '/api/setupapi/loadwaterdatafieldunitlist',
    //            dataSrc: "data"
    //        },
    //        language: {
    //            search: "",
    //            searchPlaceholder: "Search",
    //            paginate: {
    //                next: "»",
    //                previous: "«"
    //            },
    //        },
    //        processing: true,
    //        serverSide: true,
    //        ordering: false,
    //        paging: true,
    //        searching: false,
    //        pageLength: 10,
    //        columns: [
    //            { data: "ObjectDataField", title: "Object Data Field" },
    //            { data: "UnitName", title: "Unit Name" }
    //        ]
    //    })
    //};
    $scope.result = [];
    input.dataFieldId.select2({
        allowClear: true,
        placeholder: "Select a data field id"
    });
    input.Type.select2({
        allowClear: true,
        placeholder: "Select a Type"
    });
    

    input.objectId.on("change", function (e) {
        var elm = $(e.target);
        var val = elm.val();
        input.dataFieldId.html("<option></option>");
        $http.post("/api/setupapi/loadobjectdatafieldlist", { Id: val }).then(function (res) {
            console.log(res.data);
            input.dataFieldId.select2({
                data: res.data.model,
                allowClear: true,
                placeholder: "Select a data field id"
            });
        });
    })
    $http.get("/api/setupapi/object", { params: { siteId: $("#siteId").val() } }).then(function (res) {
        input.objectId.select2({
            allowClear: true,
            data: res.data.model,
            placeholder: "Select a Object id"
        });

    });

    
    input.Type.on("change", function () {
        var elm = $(this);
        var ovalue = elm.val();
        if (ovalue == 1) {
            $('.thresold').hide();
            $('.onoff').show();
        }
        else if (ovalue == 2) {
            $('.thresold').show();
            $('.onoff').hide();

        } else {
            $('.thresold').hide();
            $('.onoff').hide();
        }
    });

    var onOffDataTable = $("#onOffObjectDataList").DataTable({
        ajax: {
            url: '/api/setupapi/loadonoffobjectlist',
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
            { data: "Id", title: "#" },
            { data: "ObjectId", title: "Object Id" },
            {
                data: "Type",
                title: "Type",
                render: function (data) {
                    if (data == 1) {
                        return "OnOff";
                    } else if (data == 2) {
                        return "Temperature";
                    }
                    return "Unknown";
                }
            },
            { data: "DataFieldId", title: "Data Field Id" },
             {
                 data: null,
                 title: "Action",
                 render: function () {
                     return "<a href='javascript:void(0)'>Select</a>";
                 },
             }
        ]
    });
    

    onOffDataTable.on("click", "tr", function (e) {
        var rowData = onOffDataTable.row(this).data();

        $http.get("/api/setupapi/getonoffobject", {
            params: { id: rowData.Id }
        }).then(function (msg) {

            input.Type.val(msg.data.Type).trigger("change");
            input.objectId.val(msg.data.ObjectFkId).trigger("change");
            input.Id.val(msg.data.Id);
            $http.post("/api/setupapi/loadobjectdatafieldlist", { Id: msg.data.ObjectFkId }).then(function (res) {
                console.log(res.data);
                input.dataFieldId.select2({
                    data: res.data.model,
                    allowClear: true,
                    placeholder: "Select a data field id"
                });
                input.dataFieldId.val(msg.data.DataFieldFkId).trigger("change");
            });
            // input.dataFieldId.val(msg.data.DataFieldFkId).trigger("change");
            //formElm.ThresholdValue.val(rowData.ThresholdValue);
            input.On.val(msg.data.OnValue);
            input.Off.val(msg.data.OffValue);
            input.Thresold.val(msg.data.Thresold);
        }, function () {
            alert('Sorry');
        });
    });

    $scope.saveOnOffObject = function () {
        if (!input.objectId.val()) {
            alert("Please select an object id.")
        } else if (!input.dataFieldId.val()) {
            alert("Please select a data field id.")
        }
        else if (!input.Type.val()) {
            alert("Please select a Type.")
        }
        else if (input.Type.val() == 1) {
            if (!input.On.val()) {
                alert("Please select on value.")
            }

            if (!input.Off.val()) {
                alert("Please select off value.")
            }
        }
        else if (input.Type.val() == 2) {
            if (!input.Thresold.val()) {
                alert("Please select Thresold value.")
            }
        }
        {
            var model = {};
            model.Id = input.Id.val();
            model.ObjectFkId = input.objectId.val();
            model.DataFieldFkId = input.dataFieldId.val();
            model.Type = input.Type.val();
            model.OnValue = input.On.val();
            model.OffValue = input.Off.val();
            model.Thresold = input.Thresold.val();
            $http.post("/api/setupapi/saveonoffobject", model).then(function (response) {
                input.objectName.val('');
                input.objectId.val('').trigger('change');
                input.Type.val('').trigger('change');
                input.On.val('');
                input.Off.val('');
                input.Id.val(0);
                input.Thresold.val('');
                onOffDataTable.ajax.reload();
            }, function (error) {
                console.log(error);
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
    $scope.deleteOnoffObject = function () {
        if (!input.objectId.val()) {
            alert("Please select an object id.")
        } else if (!input.dataFieldId.val()) {
            alert("Please select a data field id.")
        }
        else if (!input.Type.val()) {
            alert("Please select a Type.")
        }
        else if (input.Type.val() == 1) {
            if (!input.On.val()) {
                alert("Please select on value.")
            }

            if (!input.Off.val()) {
                alert("Please select off value.")
            }
        }
        else if (input.Type.val() == 2) {
            if (!input.Thresold.val()) {
                alert("Please select Thresold value.")
            }
        }
        {
            var model = {};
            model.Id = input.Id.val();
            model.ObjectFkId = input.objectId.val();
            model.DataFieldFkId = input.dataFieldId.val();
            model.Type = input.Type.val();
            model.OnValue = input.On.val();
            model.OffValue = input.Off.val();
            model.Thresold = input.Thresold.val();
            $http.post("/api/setupapi/deleteonoffobject", model).then(function (response) {
                input.objectName.val('');
                input.objectId.val('').trigger('change');
                input.Type.val('').trigger('change');
                input.On.Val('');
                input.Off.Val('');
                input.Id.val(0);
                input.Thresold.Val('');
                $("#onOffObjectDataList").DataTable().ajax.reload();
            }, function (error) {
                console.log(error);
            })
        }
    };
    
});