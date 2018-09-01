import React, { Component } from 'react'
import '../style.css'
import worlddata from '../utils/world.js'
import { geoMercator, geoPath } from 'd3-geo'

class WorldMap extends Component {
	render() {
		const projection = geoMercator();
		// const projection = d3.geoEquirectangular();
      	const geoGenerator = geoPath().projection(projection);
      	const countries = worlddata.features
      							   .map((d,i) => 
      							   		<path
								         key={'path' + i}
								         d={geoGenerator(d)}
								         className='countries'
								        />
      							   	)
	
	return <svg width={500} height={500}>
		   		{countries}
		   </svg>
	}
}

export default WorldMap;