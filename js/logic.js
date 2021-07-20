var earth_30_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
var plates = 'https://github.com/fraxen/tectonicplates/blob/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_boundaries.json'

myMap = L.map("map", {
	center: [0, -100],
	zoom: 3,
});



var worldMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/streets-v11",
	accessToken: API_KEY
}).addTo(myMap);



// Create the color scale for the depth
colorBar = d3.scaleLinear().domain([0, 600])
.interpolate(d3.interpolateHcl)
.range([d3.rgb("#0f3"), d3.rgb('#FF0000')]);


function createEarthquakeMap () {
	
	
	quakeData = d3.json(earth_30_url).then(function(results) {
		console.log(results)
		results.features.forEach(function(quake) {
			coord = quake.geometry.coordinates;  // [x , y , depth]
			depth = +coord[2];
			
			
			place = quake.properties.place;
			mag = quake.properties.mag;
			
			
			let circle = L.circle([coord[1], coord[0]], {
				color: 'black',
				lineWidth: 2,
				fillColor: colorBar(depth),
				fillOpacity: 0.75,
				radius: 20000 * mag
				
			}).addTo(myMap)
			
			circle.bindPopup(`<h3>${place}</h3><p><strong>magitude: </strong>${mag}<br><strong>Depth: </strong>${depth}` );
			
		})
	})
	
	var legend = L.control({position: "bottomright"});
	
	legend.onAdd = function(myMap){
		
		console.log("adding legend")
		
		var div = L.DomUtil.create("div", "info legend" );
		var limits = [];
		for(i of Array(11).keys()){
			limits.push(i*10)
		}
		var colors = limits.map(d => colorBar(d));
		var labels = [];
		
		let bar = ""
		var legendInfo =`<h1>Earthquake Depth</h1>` 
		
		for (i = 0 ; i <= 600; i += 75){
			bar += `<i style="background-color: ${colorBar(i)}" ></i> ${i} - ${i+75} <br>`;
		} 
		
		
		div.innerHTML = legendInfo + bar;
		
		
		return div;
	}
	legend.addTo(myMap);
	
	var logo = L.control({position: "bottomleft"})
	logo.onAdd = function(myMap) {
		var div = L.DomUtil.create("div", "info" );
		div.innerHTML = `<img src="./css/1-logo.png" alt="Logo">`
		return div;
	}
	logo.addTo(myMap)
	
}

var quakes = [];

function fixQuakeData() {
	
	console.log("Getting Quake Data")
	
	var quakeData = d3.json(earth_30_url).then(function(results) {
		console.log(results)
		results.features.forEach(function(quake) {
			coord = quake.geometry.coordinates;  // [x , y , depth]
			depth = +coord[2];
			
			
			place = quake.properties.place;
			mag = quake.properties.mag;
			
			
			var circle = L.circle([coord[1], coord[0]], {
				color: 'black',
				lineWidth: 2,
				fillColor: colorBar(depth),
				fillOpacity: 0.75,
				radius: 20000 * mag
				
			})
			
			circle.bindPopup(`<h3>${place}</h3><p><strong>magitude: </strong>${mag}<br><strong>Depth: </strong>${depth}` );
			
			
			quakes.push(circle)
		});
		
	})
	
}




function createLayers() {
	
	
	quakes.then( function(quakePoints) {
		
		fixQuakeData()
		quakePoints = quakes;
		console.log(quakePoints)
		
		var quakeLayer = L.layerGroup(quakePoints)
		
		var baseMaps = {
			world: worldMap,
		};
		
		var overlayMaps ={
			quakes: quakeLayer
		};
		
		myMap = L.map("map", {
			center: [0, -100],
			zoom: 3,
			layers: [worldMap, quakeLayer]
		});
		
		
		
		L.control.layers(baseMaps, overlayMaps).addTo(myMap);
	});


}

createEarthquakeMap();

//console.log("Made it here!")
//createLayers();
