angular.module('fmccwebportal')
    .factory('reportSrvs', ['$http', function ($http) {
        var fac = {};
        fac.GetAMRDashBoardData = function (previousStart, previousEnd, lastStart, lastEnd) {
            return $http.get('/api/report/amrGetDashboardData' + '/' + previousStart + '/' + previousEnd + '/' + lastStart + '/' + lastEnd);
        }
        fac.GetAMRPowerConsumptionReportData = function (blockId, datafield, previousStart, previousEnd, lastStart, lastEnd, buildingType) {
            return $http.get('/api/report/amrpowerconsumption/' + blockId + '/' + datafield + '/' + previousStart + '/' + previousEnd + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val() + '/' + buildingType);
        }

        fac.GetAMRPowerConsumptionBlockViewReportData = function (blockId, datafield, previousStart, previousEnd, lastStart, lastEnd, buildingType) {
            return $http.get('/api/report/amrpowerconsumptionblockview/' + blockId + '/' + datafield + '/' + previousStart + '/' + previousEnd + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val() + '/' + buildingType);
        }

        fac.GetAMRBillReportData = function (blockId, datafield, previousStart, previousEnd, lastStart, lastEnd, buildingType) {
            return $http.get('/api/report/GetAMRPowerBill/' + blockId + '/' + datafield + '/' + previousStart + '/' + previousEnd + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val() + '/' + buildingType);
        }

        fac.GetAMRBillBlockViewReportData = function (blockId, datafield, previousStart, previousEnd, lastStart, lastEnd, buildingType) {
            return $http.get('/api/report/GetAMRPowerBillBlockView/' + blockId + '/' + datafield + '/' + previousStart + '/' + previousEnd + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val() + '/' + buildingType);
        }

        fac.GetAllBlocks = function () {
            return $http.get('/getblocks?siteId='+$('#siteId').val());
        }

        fac.GetPowerConsumptionReportDashboardData = function (blockId, datafield, lastStart, lastEnd) {
            
            return $http.get('/api/report/pcrdd/' + blockId + '/' + datafield + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val());
        }

        fac.GetPowerConsumptionReportData = function (blockId, datafield, previousStart, previousEnd, lastStart, lastEnd) {
            return $http.get('/api/report/powerconsumption/' + blockId + '/' + datafield + '/' + previousStart + '/' + previousEnd + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val());
        }

        fac.GetPowerConsumptionReportBreakDownData = function (blockId, datafield, lastStart, lastEnd) {
            return $http.get('/api/report/pcbd/' + blockId + '/' + datafield + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val());
        }

        fac.GetAlert = function (blockId, datafield, lastStart, lastEnd,type) {
            return $http.get('/api/report/alert/' + blockId + '/' + datafield + '/' + lastStart + '/' + lastEnd + '/' + type + '/' + $('#siteId').val());
        }

        fac.GetOverCooledReportDashboardData = function (blockId, lastStart, lastEnd) {
            return $http.get('/api/report/ocrdd/' + blockId + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val());
        }

        fac.GetOverCooledAlert = function (blockId, lastStart, lastEnd) {
            return $http.get('/api/report/ocalert/' + blockId + '/' + lastStart + '/' + lastEnd + '/' + $('#siteId').val());
        }

        fac.GetEquipementData = function (blockId, type, lastStart, lastEnd) {
            return $http.get('/api/report/histogram/' + blockId + '/' + type + '/' + lastStart + '/' + lastEnd +'/'+ $('#siteId').val());
        }

        fac.GetEquipementAlert = function (blockId, lastStart, lastEnd) {
            return $http.get('/api/report/eqalert/' + blockId + '/' + lastStart + '/' + lastEnd+'/'+ $('#siteId').val());
        }

        fac.GetAllObject = function () {
            return $http.get('/api/allobject');
        }

        fac.GetAllDatafield = function () {
            return $http.get('/api/alldatafield');
        }

        fac.GetDatafieldById = function (objectId) {
            return $http.get('/api/alldatafield/' + objectId);
        }

        fac.DayToDay = function (blockId, objectId, dataFieldId, startDateOne, endDateOne, startDateTwo, endDateTwo) {
            return $http.get('/api/report/daytoday/' + blockId + '/' + objectId + '/' + dataFieldId + '/' + startDateOne + '/' + endDateOne + '/' + startDateTwo + '/' + endDateTwo);
        }

        fac.WeekToWeek = function (blockId, objectId, dataFieldId, startDateOne, endDateOne, startDateTwo, endDateTwo) {
            return $http.get('/api/report/daytoday/' + blockId + '/' + objectId + '/' + dataFieldId + '/' + startDateOne + '/' + endDateOne + '/' + startDateTwo + '/' + endDateTwo);
        }

        fac.MonthToMonth = function (blockId, objectId, dataFieldId, startDateOne, endDateOne, startDateTwo, endDateTwo) {
            return $http.get('/api/report/daytoday/' + blockId + '/' + objectId + '/' + dataFieldId + '/' + startDateOne + '/' + endDateOne + '/' + startDateTwo + '/' + endDateTwo);
        }

        fac.SingleDateTwoDataPoint = function (blockId, objectId1, dataFieldId1, objectId2, dataFieldId2, startDateOne, endDateOne) {
            return $http.get('/api/report/singledatetwodatapoint/' + blockId + '/' + objectId1 + '/' + dataFieldId1 + '/' + objectId2 + '/' + dataFieldId2 + '/' + startDateOne + '/' + endDateOne);
        }

        fac.GetAlertCount = function (blockId,type, startDate, endDate) {
            return $http.get('/api/report/alertcount/' + blockId + '/' + type + '/' + startDate + '/' + endDate);
        }
        fac.GetWorkingPeriod = function () {
            return $http.get('/api/report/workingperiod');
        }

        return fac;
    }])

    .factory('spineService',function () {
        var fac = {};
        fac.CreateLoadingSpine = function (id) {
            $(id).empty();
            $(id).append('<img style="margin-top:150px" src="/images/gif/ajax-loader-large.gif" /><br/><br/>Loading Content Please Wait for a While....');
        }
        fac.DisposeLoadingSpine = function (id) {
            $(id).empty();
        }
        return fac;
    });