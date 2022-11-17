angular.module("fmccwebportal").controller("exportController", function ($scope, $http, $rootScope) {

    var table;
    var formElm = {
        Block: $("#exportBlock"),
        Object: $("#blockObject"),
        DataField: $("#exportDataField")

    };

    $("#fromdate").datetimepicker({
        format: "YYYY-MM-DD hh:mm A"
    });

    

    formElm.Block.select2({
        allowClear: true
    });
    formElm.Object.select2({
        allowClear: true
    });

    formElm.DataField.select2({
        allowClear: true
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
            var omodel = formElm.Object.data("model");
            if (omodel && omodel.objectId) {
                formElm.Object.val(omodel.objectId).trigger("change");
            }
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

   

    $scope.submitExport = function () {
        var model = {};
        if (!formElm.Object.val()) {
            alert("Please select Object");
        }
        else if (!formElm.DataField.val()) {
            alert("Please select DataField");
        }
        else if (!formElm.Block.val()) {
            alert("Please select a block");
        }
        else if (!$("#fromdate").val()) {
            alert("Please select a from date");
        }
        else if (!$("#todate").val()) {
            alert("Please select a to date");

            
        }
        else {

            var d1 = new Date($("#fromdate").val());
            var d2 = new Date($("#todate").val());

            if (d1 > d2) { 
                alert("From date cannot be greater than to date");
                return;
            }

            

            var timeDiff = Math.abs(d2.getTime() - d1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays > 30)
            {
                alert("Difference between from date and to date cannot be greater than 30");
                return;
            }
            
            model.Block = formElm.Block.val();
            model.Object = formElm.Block.val();
            model.DataField = formElm.DataField.val();
            model.FromDate = $("#fromdate").val();
            model.ToDate = $("#todate").val();

            $('#hidden').html('');
            $('<form>').attr({
                method: 'POST',
                id: 'hidden',
                action: '/api/alertaverage/export'
            }).appendTo('body');

            $('<input>').attr({
                type: 'hidden',
                id: 'blk',
                name: 'blk',
                value: model.Block
            }).appendTo('#hidden');

            $('<input>').attr({
                type: 'hidden',
                id: 'obj',
                name: 'obj',
                value: model.Object
            }).appendTo('#hidden');

            $('<input>').attr({
                type: 'hidden',
                id: 'df',
                name: 'df',
                value: model.DataField
            }).appendTo('#hidden');

            $('<input>').attr({
                type: 'hidden',
                id: 'td',
                name: 'td',
                value: model.ToDate
            }).appendTo('#hidden');

            $('<input>').attr({
                type: 'hidden',
                id: 'fd',
                name: 'fd',
                value: model.FromDate
            }).appendTo('#hidden');

            $('#hidden').submit();

            //$http.post("/Home/Export", model).then(function (res) {
            //})
        }
        
    };


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
