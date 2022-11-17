angular.module("fmccwebportal").controller("buildingMappingController", function ($scope, $http, $rootScope) {

    var table;
    var formElm = {
        buildingId: $("#inputBuildingId"),
        name: $('#inputBlockName'),
        location: $('#inputLocation'),
        site:$('#inputSite')

    };

    $http.get("/api/alertrule/site", { }).then(function (res) {
        formElm.site.select2({
            allowClear: true,
            data: res.data.model,
            placeholder: "Select a Site"
        });
    });
    
    LoadBuildingList();
    function LoadBuildingList() {
        var count = 0;
        table = $('#BuildingList').DataTable({
            ajax: {
                url: '/api/alarm/getblocks',
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
                {
                    data: "BuildingId",
                    title: "BuildingId"
                },
                { data: "Site", title: "Site" },
            ]
        });
    }

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

    $scope.saveBuilding = function () {

        if (!formElm.buildingId.val()) {
            alert("Please enter buildingId");
            return;
        }
        if (!formElm.site.val()) {
            alert("Please enter site");
            return;
        }
        else if (!formElm.name.val()) {
            alert("Please enter building name");
            return;
        } else {
            var model = {
                BuildingId: formElm.buildingId.val(),
                Name: formElm.name.val(),
                Location: formElm.location.val(),
                SiteId:formElm.site.val()
            }

            $http.post("/api/alarm/saveblocks", model).then(function (res) {
                formElm.buildingId.val('');
                formElm.name.val('');
                formElm.location.val('');
                //$('#BuildingList').DataTable().ajax.reload();
                refreshTable('#BuildingList', '/api/alarm/getblocks');
            })

        }

    };
});
