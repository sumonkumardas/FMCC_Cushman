angular.module('fmccwebportal')
.factory('siteFactory', ['$http', function ($http) {
    var fac = {}
    fac.GetAllSites = function () {
        return $http.get('/api/sites');
    }
    
    return fac;
}])