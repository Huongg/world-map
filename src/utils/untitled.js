let worldData = {
		"type": "FeatureCollection",
    	"features": [
    	  {
			  "type": "Feature",
			  "geometry": {
			    "type": "Point",
			    "coordinates": [125.6, 10.1]
			  },
			  "properties": {
			    "name": "Dinagat Islands"
			  }
		  },

		  {
			  "type": "Feature",
			  "geometry": {
			    "type": "Point",
			    "coordinates": [125.6, 10.1]
			  },
			  "properties": {
			    "name": "Vietname"
			  }
		  }
		]
}

worldData.features.map((d,i) => d.properties.name);