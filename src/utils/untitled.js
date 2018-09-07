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

<path
      							   				key= {"path" + i}
												d = { this.geoGenerator(d) }
												fill= { this.symbolVisitedCountries(d.properties.name) }
												onClick={ () => this.handleCountryClick(d) }
												text= {d.properties.name}
      							   			/>

worldData.features.map((d,i) => d.properties.name);

