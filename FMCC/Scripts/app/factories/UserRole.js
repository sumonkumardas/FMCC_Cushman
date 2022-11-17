angular.module("fmccwebportal").factory("UserRole", function ($http) {
    return {
        getusers: function () {
            return $http({
                method: "GET",
                url: "/api/userrolemanagement/getuserlist",
            })
        },
        getroles: function () {
            return $http({
                method: "GET",
                url: "/api/userrolemanagement/getrolelist",
            })
        },
        getuserroles: function () {
            return $http({
                method: "GET",
                url: "/api/userrolemanagement/getuserroles",
            })
        },
        setUser: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/setuser",
                data: JSON.stringify(model)
            })
        },
        updateUser: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/updateUser",
                data: JSON.stringify(model)
            })
        },
        deleteUser: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/deleteUser",
                data: JSON.stringify(model)
            })
        },
        setrole: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/setrole",
                data: JSON.stringify(model)
            })
        },
        updateRole: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/updateRole",
                data: JSON.stringify(model)
            })
        },
        deleteRole: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/deleteRole",
                data: JSON.stringify(model)
            })
        },
        setUserRole: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/setuserrole",
                data: JSON.stringify(model)
            })
        },
        unsetUserRole: function (model) {
            return $http({
                method: "POST",
                url: "/api/userrolemanagement/deleteuserrole",
                data: JSON.stringify(model)
            })
        }

    }
});