//creating the map and circle for view use
function CreateMap() {
    //allid, filterid, lon, lat
    //forEach(id in filterid)
    //{
    //    var idtemp = id;
    //    idtemp = null;
    //};

    // variable for circle
    var circlelucky = null;
    var circletang = null;
    var circlefareast = null;
    var circlescott = null;
    var circlepacific = null;
    var circleshaw = null;

    // set up the map
    var map = new L.Map('map', { center: new L.LatLng(1.30595103, 103.83262396), zoom: 17 });
    //var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    var gg = new L.Google('OVERLAY');


    map.addLayer(gg);
    //map.addControl(new L.Control.Layers({ 'Google Overlay': gg, 'OSM': osm }, {}));

    generateCircle('a');
    //forEach(id in allid)
    //{
    //    try {
    //        map.removeLayer(id);
    //    } catch (e) { }
    //};

    //for (var i = 0; i < filterid.length; i++) {
    //    filterid[i] = L.circle([lat, lon], 35, { // for lucky plaza circle
    //        color: '#000',
    //        fillColor: 'red',
    //        fillOpacity: 0.5
    //    });

    //    filterid[i].addTo(map);
    //}
    // for creating the circle
    function generateCircle(type) {

        try {
            map.removeLayer(circlelucky);
            map.removeLayer(circletang);
            map.removeLayer(circlefareast);
            map.removeLayer(circlescott);
            map.removeLayer(circlepacific);
            map.removeLayer(circleshaw);
        } catch (e) { }


        if (type == 'a') {
            circlelucky = L.circle([1.30441453, 103.83397847], 35, { // for lucky plaza circle
                color: '#000',
                fillColor: 'red',
                fillOpacity: 0.5
            });

            circletang = L.circle([1.30506882, 103.83305579], 35, { // for tang plaza circle
                color: '#000',
                fillColor: 'yellow',
                fillOpacity: 0.5
            });

            circlefareast = L.circle([1.30713358, 103.83372098], 35, { // for fareast plaza circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circlescott = L.circle([1.305805, 103.83299263], 35, { // for scott squre circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circlepacific = L.circle([1.306578, 103.832295], 35, { // for pacific plaza circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circleshaw = L.circle([1.30547322, 103.83158153], 35, { // for shaw house circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });
            circlelucky.addTo(map);
            circletang.addTo(map);
            circlefareast.addTo(map);
            circlescott.addTo(map);
            circlepacific.addTo(map);
            circleshaw.addTo(map);

            circlelucky.bindPopup("Lucky Plaza");
            circletang.bindPopup("Tang Plaza");
            circlefareast.bindPopup("Fareast Plaza");
            circlescott.bindPopup("Scotts Square");
            circlepacific.bindPopup("Pacific Plaza");
            circleshaw.bindPopup("Shaw House");

        } else if (type == 'e') {
            circlelucky = L.circle([1.30441453, 103.83397847], 35, { // for lucky plaza circle
                color: '#000',
                fillColor: 'red',
                fillOpacity: 0.5
            });

            circlelucky.addTo(map);
            circlelucky.bindPopup("Lucky Plaza");

        } else if (type == 'w') {
            circletang = L.circle([1.30506882, 103.83305579], 35, { // for tang plaza circle
                color: '#000',
                fillColor: 'yellow',
                fillOpacity: 0.5
            });

            circletang.addTo(map);
            circletang.bindPopup("Tang Plaza");

        } else if (type == 'g') {
            circlefareast = L.circle([1.30713358, 103.83372098], 35, { // for fareast plaza circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circlescott = L.circle([1.305805, 103.83299263], 35, { // for scott squre circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circlepacific = L.circle([1.306578, 103.832295], 35, { // for pacific plaza circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circleshaw = L.circle([1.30547322, 103.83158153], 35, { // for shaw house circle
                color: '#000',
                fillColor: 'green',
                fillOpacity: 0.5
            });

            circlefareast.addTo(map);
            circlescott.addTo(map);
            circlepacific.addTo(map);
            circleshaw.addTo(map);

            circlefareast.bindPopup("Fareast Plaza");
            circlescott.bindPopup("Scotts Square");
            circlepacific.bindPopup("Pacific Plaza");
            circleshaw.bindPopup("Shaw House");

        }

    }

}
