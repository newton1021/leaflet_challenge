var earth_30_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


var myMap = L.map("map", {
	center: [0, -100],
	zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/streets-v11",
	accessToken: API_KEY
}).addTo(myMap);

function createEarthquakeMap () {
	quakeData = d3.json(earth_30_url).then(function(results) {
		console.log(results)
		results.features.forEach(function(quake) {
			coord = quake.geometry.coordinates;  // [x , y , depth]
			depth = +coord[2];
			
			mag = quake.properties.mag;
			
			L.circle([coord[1], coord[0]], {
				color: 'black',
				fillColor: 'yellow',
				fillOpacity: 0.75,
				radius: 10000 * mag
			}).addTo(myMap);
			
		})
	})
}

createEarthquakeMap();