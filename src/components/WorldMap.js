import React, { Component } from 'react'
import '../style.css'
import worldData from '../utils/worldData.js'
import { geoPath, geoOrthographic } from 'd3-geo'
import { timer } from 'd3-timer'
import { select } from 'd3-selection'

class WorldMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeDelta: 0
		};
		this.translateX = 820/2 + 100;
		this.translateY = 620/2
		this.projection = geoOrthographic()
						   .scale(300)
						   .translate([this.translateX, this.translateY])
						   .clipAngle(90)
						   .precision(0.3);

		this.geoGenerator = geoPath().projection(this.projection);
		this.svg = select("svg");

		// this.createWorldMap = this.createWorldMap.bind(this);
		// this.spinning = this.spinning.bind(this);


	}

	componentDidMount() {
      this.createWorldMap();
      this.spinning();
   }

   componentDidUpdate() {
      this.createWorldMap();
   }

   spinning() {
   	   // Configuration for the spinning effect
	   let objState = this;
       let projectionClosed = objState.projection;

       let time = Date.now();
       const rotate = [0, 0];
	   const velocity = [.015, -0];

	   timer(function() {

	      // get current time
	      let dt = Date.now() - time;

	      // get the new position from modified projection function
	      projectionClosed.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

	      // update the timeDelta every seconds based on dt
	      objState.setState({timeDelta: dt});
	   });
   }

	createWorldMap() {		 
      	const countries = worldData.features
      							   .map((d,i) => 
      							   		<path
								         key={'path' + i}
								         d={this.geoGenerator(d)}
								         className='countries'
								        />
      							   	)
      	return countries;
	}

	render() {

		
		return (
			<svg width="820" height="620">
					<circle className="circle" cx={this.translateX} cy={this.translateY} r="300" fill="#1C70C8"></circle>
						{this.createWorldMap()}
					
			</svg>)
		}
}



export default WorldMap;

