angular.module("fmccwebportal")
.controller('mapViewCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.view_type = 1;//$stateParams.view_type;

    $scope.map = null;
    $scope.circlelayer = [];

    $scope.GenerateMap = function () {
        try {
            // set up the map
            $scope.map = new L.Map('map',
            { center: new L.LatLng(1.33595103, 103.83262396), zoom: 11.45 });
            //var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            $scope.gg = new L.Google('OVERLAY');


            $scope.map.addLayer($scope.gg);
            //map.addControl(new L.Control.Layers({ 'Google Overlay': gg, 'OSM': osm }, {}));
            $scope.map.on('zoomend', function () {
                var currentZoom = $scope.map.getZoom();
                angular.forEach($scope.circlelayer, function (circle) {
                    try {
                        circle.setRadius(150 - ((currentZoom - 15) * 45));

                    } catch (e) {
                        // ignored
                    }
                });
            });

        } catch (err) {
            // ignored
        }


    };

    $scope.CreateCircle = function () {


        var greenIcon = L.icon({
            iconUrl: '../images/map/green-ok.png',

            iconSize: [70, 70], // size of the icon
            //iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            //popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });

        var alarmIcon = L.icon({
            iconUrl: '../images/map/flashingred.gif',

            iconSize: [70, 70], // size of the icon
            //iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
            //popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });

        L.marker([1.410502, 103.749114], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.298953, 103.663834], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.349752, 103.677567], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.325726, 103.737991], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.333277, 103.765457], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.385447, 103.803909], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.443794, 103.807343], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.285910, 103.794296], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.275613, 103.846481], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.302386, 103.842361], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.343573, 103.856781], { icon: greenIcon }).addTo($scope.map);
        L.marker([1.353184, 103.913773], { icon: greenIcon }).addTo($scope.map);

        var navalGreen = L.marker([1.32400935, 104.01484681], { icon: greenIcon });
        var navalAlarm = L.marker([1.32400935, 104.01484681], { icon: alarmIcon })

        var navalGreenPopupContent = document.createElement('div');
        navalGreenPopupContent.innerHTML = "<div class='popup'><img src='../images/map/resolved.png' /></div>";
        navalGreenPopupContent.onclick = function () {
            //$state.go('powerbi');
        };

        var navalGreenPopup = L.marker([1.32400935, 104.01484681], { icon: greenIcon }).bindPopup(navalGreenPopupContent);

        var navalAlarmPopupContent = document.createElement('div');
        navalAlarmPopupContent.innerHTML = "<div class='popup'><img src='../images/map/alarm.png' /></div>";
        navalAlarmPopupContent.onclick = function () {
            //$state.go('assign');
        };
        var navalAlarmPopup = L.marker([1.32400935, 104.01484681], { icon: alarmIcon }).bindPopup(navalAlarmPopupContent);

        if ($scope.view_type == 1) {
            navalGreen.addTo($scope.map);
            $timeout(function () {
                $scope.map.removeLayer(navalGreen);
                navalAlarmPopup.addTo($scope.map);
                $scope.Building_Class[3] = 'critical';
            }, 10000);

        } else if ($scope.view_type == 2) {
            navalAlarm.addTo($scope.map);
            $timeout(function () {
                $scope.map.removeLayer(navalAlarm);
                navalGreenPopup.addTo($scope.map);
                $scope.Building_Class[3] = 'healthy';
            }, 10000);
        }
        else {//if null
            navalGreen.addTo($scope.map);
            $timeout(function () {
                $scope.map.removeLayer(navalGreen);
                navalAlarmPopup.addTo($scope.map);
                $scope.Building_Class[3] = 'critical';
            }, 10000);
        }



    };

    // filter dropdown by alert or status
    $scope.searchEnabled = false;
    $scope.alerttype = {};
    $scope.alert_type_list = [{ 'id': '0', 'name': 'All(10)', 'url': '/images/icon-circle-black.png' },
                              { 'id': '1', 'name': 'Minor(0)', 'url': '/images/icon-circle-yellow.png' },
                              { 'id': '2', 'name': 'Major(0)', 'url': '/images/icon-circle-orange.png' },
                              { 'id': '3', 'name': 'Critical(1)', 'url': '/images/icon-circle-red.png' },
                              { 'id': '4', 'name': 'Healthy(9)', 'url': '/images/icon-circle-green.png' }];

    $scope.alerttype.selected = $scope.alert_type_list[0];

    $scope.buildingtype = {};
    $scope.building_type_list = [{ 'id': '0', 'name': 'All', 'url': '/images/icon-square-blue.png' },
                              { 'id': '1', 'name': 'Minor(0)', 'url': '/images/icon-circle-yellow.png' },
                              { 'id': '2', 'name': 'Major(0)', 'url': '/images/icon-circle-orange.png' },
                              { 'id': '3', 'name': 'Critical(1)', 'url': '/images/icon-circle-red.png' },
                              { 'id': '4', 'name': 'Healthy(9)', 'url': '/images/icon-circle-green.png' }];


    $scope.buildingtype.selected = $scope.building_type_list[0];


}])