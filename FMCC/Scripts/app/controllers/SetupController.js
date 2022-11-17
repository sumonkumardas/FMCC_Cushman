angular.module("fmccwebportal").controller('Setup', function ($scope, $http, $rootScope) {
    var modal = angular.element("#delete-confirmation-model").modal({
        show: false
    });
    modal.find('[data-dismiss="modal"]').bind("click", function (e)
    {
        modal.hide();
    });
    var tables = {
        object: angular.element("#object-data").DataTable({
            ajax: {
                url: '/api/SetupApi/LoadObjectList',
                dataSrc: "data"
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
                { data: "ObjectId", title: "Object Id" },
                { data: "Name", title: "Object Name" },
                { data: null, width: '85px', defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
            ]
        }),
        units: angular.element("#data-field-unit").DataTable({
            ajax: {
                url: '/api/setupapi/loaddatafieldunits',
                dataSrc: "data"
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
                { data: "Id", title: "Unit Id" },
                { data: "Name", title: "Unit Name" },
                { data: null, width: '85px', defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
            ]
        }),
        dataField: angular.element("#data-field").DataTable({
            ajax: {
                url: '/api/SetupApi/LoadDataFieldList',
                dataSrc: "data"
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
                { data: "DataFieldId", title: "Data Field Id" },
                { data: "Name", title: "Data Field Name" },
                { data: "Unit", title: "Data Field Unit" },
                { data: null, width: '85px', defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
            ],
        }),
        objectDataField: angular.element("#object-data-field").DataTable({
            ajax: {
                url: '/api/SetupApi/LoadBuildingObjectData',
                dataSrc: "data"
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
                { data: "BuildingName", title: "Block" },
                { data: "ObjectName", title: "Object" },
                { data: "DataFieldName", title: "Data Field" },
                { data: "DataFieldUnit", title: "Unit" },
                { data: "RawDataFieldNumber", title: "Data Field Number" },
                { data: null, width: '85px', defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
            ]
        })
    }

    $scope.object = {
        Id: 0,
        Name: "",
        ObjectId: "",
    }

    $scope.dataField = {
        Id: 0,
        Name: "",
        Unit: "",
        DataFieldId: "",
    }

    $scope.dataFieldUnit = {
        Id: 0,
        Name: "",
    }

    $scope.buildingObjectDataField = {
        Id: 0,
        BuildingFkId: "",
        ObjectFkId: "",
        DataFieldFkId: "",
        RawDataFieldNumber: "",

    }

    $scope.keyDown = function (e) {
        var value = angular.element(e.target).val();
        if (isNaN(value)) {
            angular.element(e.target).val("");
        }
    };

    $scope.submitObject = function () {
        var objectData = {
            Id: $scope.object.Id,
            ObjectId: $scope.object.ObjectId,
            Name: $scope.object.Name,
        };
        $http.post('/api/setupapi/postObject', objectData).then(function (msg) {
            if (msg.data != null) {
                $scope.object.Id = 0;
                $scope.object.ObjectId = "";
                $scope.object.Name = "";
                $("#object-data").DataTable().ajax.reload();
                loadObjects();
            }
        }, function () {
            alert('Sorry an error occured');
        });
    };

    $scope.updateObject = function () {
        var objectData = {
            Id: $scope.object.Id,
            ObjectId: $scope.object.ObjectId,
            Name: $scope.object.Name,
        };
        $http.post('/api/setupapi/updateobject', objectData).then(function (msg) {
            if (msg.data.okay) {
                $scope.object.Id = 0;
                $scope.object.ObjectId = "";
                $scope.object.Name = "";
                angular.element("#object-data").DataTable().ajax.reload();
                angular.element('#object-data-field').DataTable().ajax.reload();
                loadObjects();
            }
        }, function () {
            alert('Sorry an error occured');
        });
    }

    $scope.deleteObject = function () {
        var r = confirm("Want to delete this ?");
        if (r == true) {

            $http.post('/api/setupapi/deleteobject', $scope.object).then(function(msg) {
                //angular.element(e.target).closest(".modal").remove();
                if (msg.data.okay) {
                    $scope.object.Id = 0;
                    $scope.object.ObjectId = "";
                    $scope.object.Name = "";
                    $("#object-data").DataTable().ajax.reload();
                    loadObjects();
                }
            }, function() {
                //angular.element(e.taFrget).closest(".modal").remove();
            });
        }
    }

    $scope.cancelObject = function () {
        var objectData = {
            Id: $scope.object.Id,
            ObjectId: $scope.object.ObjectId,
            Name: $scope.object.Name,
        };
        $http.post('/api/setupapi/updateobject', objectData).then(function (msg) {
            if (msg.data.okay) {
                $scope.object.Id = 0;
                $scope.object.ObjectId = "";
                $scope.object.Name = "";
                $("#object-data").DataTable().ajax.reload();
            }
        }, function () {
            alert('Sorry an error occured');
        });
    }

    $scope.submitDataField = function () {
        if (!$scope.dataField.DataFieldId) {
            alert("Please type datafieldId");
            $('#inputDataFieldId').focus();
            return;
        }
        else if (!$scope.dataField.Name) {
            alert("Please type datafield name");
            $('#inputDataFieldName').focus();
            return;
        }
        else if (!angular.element("#inputDataFieldUnit").val()) {
            alert("Please type datafield unit");
            $('#inputDataFieldUnit').focus();
            return;
        }
        var objectData = {
            Name: $scope.dataField.Name,
            Unit: angular.element("#inputDataFieldUnit").val(),
            DataFieldId: $scope.dataField.DataFieldId,
        };
        $http.post('/api/SetupApi/PostDataField', objectData).then(function (msg) {
            console.log(msg.data)
            if (msg.data.okay) {
                $('#inputDataFieldId').val("");
                $('#inputDataFieldName').val("");
                $('#inputDataFieldUnit').val("");
                angular.element("#inputDataFieldUnit").val("").trigger("change");
                $("#data-field").DataTable().ajax.reload();
                loadDataFields();
            } else {

            }
        }, function () {
            alert('Sorry an error occured');
        });
    };

    $scope.updateDataField = function () {
        var datafield = {
            Id: $scope.dataField.Id,
            DataFieldId: $scope.dataField.DataFieldId,
            Name: $scope.dataField.Name,
            Unit: angular.element("#inputDataFieldUnit").val(),
        };
        $http.post("/api/SetupApi/updatedatafield", datafield).then(function (res) {
            if (res.data.okay) {
                $scope.dataField = {
                    Id: 0,
                    Name: "",
                    Unit: "",
                    DataFieldId: "",
                }
                angular.element("#inputDataFieldUnit").val("").trigger("change");
                angular.element("#data-field").DataTable().ajax.reload();
                angular.element('#object-data-field').DataTable().ajax.reload();
                loadDataFields();
            } else {
                console.log(res.data.message);
            }

        }, function () {
            alert('Sorry');
        });
    }

    $scope.deleteDataField = function () {
        createModal(function (e) {
            var datafield = {
                Id: $scope.dataField.Id
            };
            $http.post("/api/SetupApi/deletedatafield", datafield).then(function (res) {
                angular.element(e.target).closest(".modal").remove();
                if (res.data.okay) {
                    $scope.dataField = {
                        Id: 0,
                        Name: "",
                        Unit: "",
                        DataFieldId: "",
                    }
                    angular.element("#inputDataFieldUnit").val("").trigger("change");
                    $("#data-field").DataTable().ajax.reload();
                    loadDataFields();
                } else {
                    console.log(res.data.message);
                }

            }, function () {
                angular.element(e.target).closest(".modal").remove();
            });
        });
    }

    $scope.cancelDataField = function () {
        $scope.dataField.Id = 0;
        $scope.dataField.Name = "";
        $scope.dataField.Unit = "";
        $scope.dataField.DataFieldId = "";
        $("#data-field").DataTable().ajax.reload();
        angular.element("#inputDataFieldUnit").val("").trigger("change");
    }

    $scope.submitDataFieldUnit = function () {
        if (!angular.element("#inputDataFieldUnitName").val()) {
            alert("Please enter a data field name.")
        } else {
            $http.post('/api/setupapi/submitdatafieldunit', $scope.dataFieldUnit).then(function (msg) {
                $scope.dataFieldUnit.Id = 0;
                $scope.dataFieldUnit.Name = "";
                angular.element("#inputDataFieldUnitName").val("")
                angular.element('#data-field-unit').DataTable().ajax.reload();
                loadDataFieldUnits();
            }, function () {
                alert('Sorry an error occured');
            });
        }
    }

    $scope.updateDataFieldUnit = function () {
        if (!angular.element("#inputDataFieldUnitName").val()) {
            alert("Please enter a data field name.")
        } else {
            $http.post('/api/setupapi/updatedatafieldunit', $scope.dataFieldUnit).then(function (msg) {
                $scope.dataFieldUnit.Id = 0;
                $scope.dataFieldUnit.Name = "";
                angular.element("#inputDataFieldUnitName").val("");
                angular.element("#data-field").DataTable().ajax.reload();
                angular.element('#data-field-unit').DataTable().ajax.reload();
                angular.element('#object-data-field').DataTable().ajax.reload();

                loadDataFieldUnits();
            }, function () {
                alert('Sorry an error occured');
            });
        }
    }

    $scope.deleteDataFieldUnit = function () {
        createModal(function (e) {
            $http.post('/api/setupapi/deletedatafieldunit', $scope.dataFieldUnit).then(function (msg) {
                angular.element(e.target).closest(".modal").remove();
                $scope.dataFieldUnit.Id = 0;
                angular.element("#inputDataFieldUnitName").val("")
                angular.element('#data-field-unit').DataTable().ajax.reload();
                loadDataFieldUnits();
            }, function () {
                angular.element(e.target).closest(".modal").remove();
            });
        });
    }

    $scope.cancelDataFieldUnit = function () {
        $scope.dataFieldUnit.Id = 0;
        angular.element("#inputDataFieldUnitName").val("")
        tables.units.ajax.reload();
    }

    $scope.submitBuildingObjectDataField = function () {
        if (!angular.element("#idSelectDatafieldData").val()) {
            alert("Please select a block ");
            return;
        }
        else if (!angular.element("#idSelectObjectList").val()) {
            alert("Please select an object");
            return;
        }
        else if (!angular.element("#idSelectDatafieldData").val()) {
            alert("Please select an data field");
            return;
        }
        else if (!angular.element("#RawDataFieldNumber").val()) {
            alert("Please enter a data field number");
            return;
        }

        var objInfo = $('#idSelectObjectList').val()
        var dfInfo = $('#idSelectDatafieldData').val()
        var model = {
            BuildingFkId: angular.element("#idSelectBuildings").val(),
            ObjectFkId: $('#idSelectObjectList').val(),
            DataFieldFkId: angular.element("#idSelectDatafieldData").val(),
            RawDataFieldNumber: angular.element("#RawDataFieldNumber").val()
        };
        $http.post('/api/setupapi/SaveBuidingObjectData', model).then(function (msg) {
            $scope.buildingObjectDataField.Id = 0;
            angular.element("#idSelectBuildings").val("val", "").trigger("change");
            angular.element("#idSelectObjectList").val("val", "").trigger("change");
            angular.element("#idSelectDatafieldData").val("val", "").trigger("change");
            angular.element("#RawDataFieldNumber").val("")
            angular.element('#object-data-field').DataTable().ajax.reload();
        }, function () {
            alert('Sorry an error occured');
        });
    };

    $scope.updateBuildingObjectDataField = function () {
        var BuildingObjectDataField = {
            BuildingFkId: angular.element("#idSelectBuildings").val(),
            ObjectFkId: angular.element("#idSelectObjectList").val(),
            DataFieldFkId: angular.element("#idSelectDatafieldData").val(),
            RawDataFieldNumber: angular.element("#RawDataFieldNumber").val()
        }
        $http.post("/api/setupapi/updatebuildingobjectdatafield", BuildingObjectDataField).then(function (res) {
            if (res.data.okay) {
                $scope.buildingObjectDataField.Id = 0;
                $scope.buildingObjectDataField.RawDataFieldNumber = "";
                angular.element("#idSelectBuildings").val("val", "").trigger("change");
                angular.element("#idSelectObjectList").val("val", "").trigger("change");
                angular.element("#idSelectDatafieldData").val("val", "").trigger("change");
                angular.element("#RawDataFieldNumber").val('');;
                angular.element('#object-data-field').DataTable().ajax.reload();
            } else {
                console.log(res.data.message);
            }

        }, function () {
            alert('Sorry');
        });
        tables.objectDataField.$("tr.selected").removeClass('selected');
    }

    $scope.deleteBuildingObjectDataField = function () {
        createModal(function (e) {
            var BuildingObjectDataField = {
                BuildingFkId: angular.element("#idSelectBuildings").val(),
                ObjectFkId: angular.element("#idSelectObjectList").val(),
                DataFieldFkId: angular.element("#idSelectDatafieldData").val(),
                RawDataFieldNumber: angular.element("#RawDataFieldNumber").val()
            }
            $http.post("/api/setupapi/deletebuildingobjectdatafield", BuildingObjectDataField).then(function (res) {
                angular.element(e.target).closest(".modal").remove();
                if (res.data.okay) {
                    $scope.buildingObjectDataField.Id = 0;
                    angular.element("#idSelectBuildings").val("val", "").trigger("change");
                    angular.element("#idSelectObjectList").val("val", "").trigger("change");
                    angular.element("#idSelectDatafieldData").val("val", "").trigger("change");
                    angular.element("#RawDataFieldNumber").val("")
                    angular.element('#object-data-field').DataTable().ajax.reload();
                } else {
                    console.log(res.data.message);
                }

            }, function () {
                angular.element(e.target).closest(".modal").remove();
            });
        });
    }

    $scope.cancelBuildingObjectDataField = function () {
        $scope.buildingObjectDataField.Id = 0;
        $scope.buildingObjectDataField.RawDataFieldNumber = "";
        angular.element("#idSelectBuildings").val("").trigger("change");
        angular.element("#idSelectObjectList").val("").trigger("change");
        angular.element("#idSelectDatafieldData").val("").trigger("change");
        tables.objectDataField.ajax.reload();
    }

    angular.element("#object-data tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = tables.object.row(this).data();
        if (e.target.tagName == "BUTTON") {
            var target = $(e.target);
            if (target.hasClass('btn-primary')) {
                target.removeClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.object.Id = 0;
                    $scope.object.Name = "";
                    $scope.object.ObjectId = "";
                })
            }
            else {
                tables.object.$("button").removeClass('btn-primary');
                target.addClass('btn-primary');
                $rootScope.$apply(function () {
                    if (rowData) {
                        $scope.object.Id = rowData.Id;
                        $scope.object.Name = rowData.Name;
                        $scope.object.ObjectId = rowData.ObjectId;
                    }
                });
            }
        }
    });

    angular.element("#data-field tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = tables.dataField.row(this).data();
        if (e.target.tagName == "BUTTON") {
            var target = $(e.target);
            if (target.hasClass("btn-primary")) {
                $rootScope.$apply(function () {
                    $scope.dataField.Id = 0;
                    $scope.dataField.Name = "";
                    $scope.dataField.Unit = "";
                    $scope.dataField.DataFieldId = "";
                    angular.element("#inputDataFieldUnit").val("").trigger("change");
                })
                target.removeClass('btn-primary');
            }
            else {
                tables.dataField.$("button").removeClass('btn-primary');
                target.addClass('btn-primary');
                $rootScope.$apply(function () {
                    if (rowData) {
                        $scope.dataField.Id = rowData.Id;
                        $scope.dataField.Name = rowData.Name;
                        $scope.dataField.Unit = rowData.UnitId;
                        $scope.dataField.DataFieldId = rowData.DataFieldId;
                        angular.element("#inputDataFieldUnit").val(rowData.UnitId).trigger("change");
                    }
                });
            }
        }
    });

    angular.element("#data-field-unit tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = tables.units.row(this).data();
        if (e.target.tagName == "BUTTON") {
            var target = $(e.target);
            if (target.hasClass("btn-primary")) {
                $rootScope.$apply(function () {
                    $scope.dataFieldUnit.Id = 0;
                    $scope.dataFieldUnit.Name = "";
                })
                $("#inputDataFieldUnitName").val("");
                target.removeClass('btn-primary');
            }
            else {
                tables.units.$("button").removeClass('btn-primary');
                target.addClass('btn-primary');
                $rootScope.$apply(function () {
                    if (rowData) {
                        $scope.dataFieldUnit.Id = rowData.Id;
                        $scope.dataFieldUnit.Name = rowData.Name;
                        $("#inputDataFieldUnitName").val(rowData.Name);
                    }
                });
            }
        }
    });

    angular.element("#object-data-field tbody").on("click", "tr", function (e) {
        var rowElem = $(this);
        var rowData = tables.objectDataField.row(this).data();
        if (e.target.tagName == "BUTTON") {
            var target = $(e.target);
            if (target.hasClass('btn-primary')) {
                target.removeClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.buildingObjectDataField.Id = 0;
                    if (rowData) {
                        angular.element("#idSelectBuildings").val("").trigger("change");
                        angular.element("#idSelectObjectList").val("").trigger("change");
                        angular.element("#idSelectDatafieldData").val("").trigger("change");
                        angular.element("#RawDataFieldNumber").val("").trigger("change");
                    }
                });
            }
            else {
                tables.objectDataField.$("button").removeClass('btn-primary');
                target.addClass('btn-primary');
                $rootScope.$apply(function () {
                    $scope.buildingObjectDataField.Id = 1;
                    if (rowData) {
                        $scope.buildingObjectDataField.RawDataFieldNumber = parseInt(rowData.RawDataFieldNumber);
                        angular.element("#idSelectBuildings").val(rowData.BuildingFkId).trigger("change");
                        angular.element("#idSelectObjectList").val(rowData.ObjectFkId).trigger("change");
                        angular.element("#idSelectDatafieldData").val(rowData.DataFieldFkId).trigger("change");
                    }
                });
            }
        }
    });


    $http.get("/api/alertrule/block", { params: { siteId: $("#siteId").val() } }).then(function (msg) {
        var data = [];
        $scope.BuildingList = msg.data;
        //for (var i = 0; i < msg.data.length; i++) {
        //    data.push({ id: msg.data[i].Id, text: msg.data[i].Name })
        //}
        angular.element("#idSelectBuildings").select2({
            data: msg.data.model,
            allowClear: true,
            placeholder: "Please select a block"
        });
    }, function () {
        alert('Sorry');
    });

    function loadObjects() {
        $http.get("/api/setupapi/loadtypelist").then(function (msg) {
            var data = [];
            $scope.ObjectList = msg.data;
            for (var i = 0; i < msg.data.length; i++) {
                data.push({ id: msg.data[i].Id, text: msg.data[i].Name })
            }
            angular.element("#idSelectObjectList").html('<option></option>').trigger("change");
            angular.element("#idSelectObjectList").select2({
                data: data,
                allowClear: true,
                placeholder: "Please select an object"
            });
        }, function () {
            alert('Sorry');
        });
    }

    function loadDataFields() {
        $http.get("/api/setupapi/loadfieldlist").then(function (msg) {
            var data = [];
            $scope.DataFiledList = msg.data;
            for (var i = 0; i < msg.data.length; i++) {
                data.push({ id: msg.data[i].Id, text: msg.data[i].Name })
            }
            angular.element("#idSelectDatafieldData").html('<option></option>').trigger("change");
            angular.element("#idSelectDatafieldData").select2({
                data: data,
                allowClear: true,
                placeholder: "Please select a data field"
            });
        }, function () {
            alert('Sorry');
        });
    }

    function loadDataFieldUnits() {
        $http.get("/api/setupapi/loaddatafieldunitlist").then(function (msg) {
            if (msg.data.okay) {
                $scope.DataFiledUnitList = msg.data.model;
                angular.element("#inputDataFieldUnit").html('<option></option>').trigger("change");
                angular.element("#inputDataFieldUnit").select2({
                    data: msg.data.model,
                    allowClear: true,
                    placeholder: "Please select a unit"
                });
            } else {
                console.log(msg);
            }
        }, function () {
            alert('Sorry');
        });
    }

    function createModal(proceed) {
        var modalElm = angular.element(angular.element("#delete-confirmation-template").html())
        angular.element("body").append(modalElm)
        var modal = modalElm.modal({ show: false });
        modal.show();
        modal.find(".proceed-button").on("click", proceed)
        modal.find(".cancel-button").on("click", function (e) {
            modalElm.remove();
        })
    }

    loadObjects();
    loadDataFields();
    loadDataFieldUnits();
});