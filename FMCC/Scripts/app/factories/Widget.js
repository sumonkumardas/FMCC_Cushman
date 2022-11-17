angular.module("fmccwebportal")
    .factory("Widget", function ($http) {
        var factory = {};
        var success = function (res) {
            //console.log(res);
        }
        var failure = function (res) {
            //console.log(res);
        }
        factory.ReadWidget = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "POST",
                url: "/api/Widget/Read",
                data: JSON.stringify({ id: option.menuId })
            }).then(option.success, option.failure);
        };
        factory.CreateWidget = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || factory;
            return $http({
                method: "POST",
                url: "/api/Widget/Create",
                data: JSON.stringify(option.model)
            }).then(option.success, option.failure);
        };
        factory.UpdateWidget = function (option)
        {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "POST",
                url: "/api/Widget/Update",
                data: JSON.stringify(option.model)
            }).then(option.success, option.failure);
        };
        factory.RemoveWidget = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "POST",
                url: "/api/Widget/Remove",
                data: JSON.stringify({ id: option.model.id }),
            }).then(option.success, option.failure);
        };
        factory.ReadWidgetData = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "GET",
                url: "/service/widgetdata/plain?blockId=" + option.model.blockId + "&objectId=" + option.model.objectId + "&dataFieldId=" + option.model.dataFieldId + "&dateFlag=" + option.model.dateFlag,
            }).then(option.success, option.failure)
        };
        factory.ReadWidgetHeatMapData = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "GET",
                url: "/service/widgetdata/heatmap?blockId=" + option.model.blockId + "&objectId=" + option.model.objectId + "&dataFieldId=" + option.model.dataFieldId + "&dateFlag=" + option.model.dateFlag,
            }).then(option.success, option.failure);
        };        
        factory.ReadWidgetTemperatureProfileData = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "GET",
                url: "/service/widgetdata/temperatureprofile?blockId=" + option.model.blockId + "&objectId1=" + option.model.objectId + "&objectId2=" + option.model.objectToCompareId + "&dataFieldId1=" + option.model.dataFieldId + "&dataFieldId2=" + option.model.dataFieldToCompareId + "&dateFlag=" + option.model.dateFlag,
            }).then(option.success, option.failure);
        };
        factory.ReadWidgetAhuProfileData = function (option) {
            option.success = option.success || success;
            option.failure = option.failure || failure;
            return $http({
                method: "GET",
                url: "/service/widgetdata/ahuprofile?blockId=" + option.model.blockId + "&objectId=" + option.model.objectId + "&dataFieldId1=" + option.model.raTemperature + "&dataFieldId2=" + option.model.valveOutput + "&dateFlag=" + option.model.dateFlag,
            }).then(option.success, option.failure);
        };
        return factory;
    });