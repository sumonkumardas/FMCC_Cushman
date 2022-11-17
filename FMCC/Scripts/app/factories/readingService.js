angular.module("fmccwebportal").factory("readingService", function ($http) {
    return {
        Get: function (type, field, period, offset, success, failure) {
            if (type && field && period) {
                type = type.trim();
                field = field.trim();
                period = period.trim();
                return $http.get("/api/reading?type=" + type + "&field=" + field + "&period=" + period + "&offset=" + offset + "&siteId=" + $("#siteId").val()).error(failure).success(success);
            } else {
                return {}
            }
        },
        GetUnitName: function (name,failure,success) {
            if (true) {
                return $http.get("/api/reading/" + name).error(failure).success(success);
            } else {
                return {}
            }
        }

    };
});
