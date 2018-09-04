import React, { Component } from 'react'
import '../style.css'
import worldData from '../utils/worldData.js'
import colourVisitedCountries from '../utils/visitedCountries.js'
import { geoPath, geoOrthographic } from 'd3-geo'
import { timer } from 'd3-timer'
import { select } from 'd3-selection'

class WorldMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeDelta: 0,
			startTime: Date.now(),
			startedSpinning: false,
			selectedCountry: null,
			centered: null
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

		this.width = window.innerWidth;
    	this.height = window.innerHeight;

		this.handleCountryClick = this.handleCountryClick.bind(this)

	}

	componentDidMount() {
      this.initSpinner();
   }


   handleCountryClick(d) {
   	
   		this.setState({
	      	startedSpinning: !this.state.startedSpinning
	    });
   		// when the globe's stopped spinning, update the startTime to be at the point when its stopped
   		if(!this.state.startedSpinning){
   			this.setState({
   				startTime : Date.now() - this.state.timeDelta,
   				// selectedCountry: d.properties.name
   			});
   		} 

   		console.log(`This is: ${d.properties.name}`);

   		// let x, y, k;
   		//if not centered into that country
   		// if (d && this.state.centered !== d) {
   		// 	let centroid = this.geoGenerator.centroid(d); //get center of country
     //    	let bounds = this.geoGenerator.bounds(d); //get bounds of country
     //    	let dx = bounds[1][0] - bounds[0][0]; //get bounding box
     //        let	dy = bounds[1][1] - bounds[0][1];

     //        //get transformation values
	    //     x = (bounds[0][0] + bounds[1][0]) / 2;
	    //     y = (bounds[0][1] + bounds[1][1]) / 2;
	    //     k = Math.min(this.width / dx, this.height / dy);

	    //     this.setState({
	    //     	centered : d,
	    //     	selectedCountry : d
	    //  	});

   		// } else {
   		// 	//else reset to world view
	    //     x = this.width / 2;
	    //     y = this.height / 2;
	    //     k = 1;

	    //     this.setState({ centered : null });
   		// }

   		// let country = document.getElementsByClassName("country");


   }

 //    popupContent() {
	//   var width = 700;
	//   var height = 700;
	//   var scale = 1200 * 5;
	//   var scaleExtent = [1 << 12, 1 << 13]
	//   var center = [122, 23.5];
	// }
	  
	//   var popupContent = function(d) { return d.properties.text; }

   initSpinner() {
   	   // Configuration for the spinning effect
   	    let objState = this;
       	let projectionClosed = objState.projection;

       	// let time = Date.now();
       	const rotate = [0, 0];
	   	const velocity = [.008, -0];
	   	this.setState({startedSpinning : true});
   	   	timer(function() {
		      if(objState.state.startedSpinning) {
		      	// get current time
		        let dt = Date.now() - objState.state.startTime;
		      	// get the new position from modified projection function
		        projectionClosed.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
		        // update the timeDelta every seconds based on dt
		      	objState.setState({timeDelta: dt});
		      } 
		});
   	   
	   
   }

   symbolVisitedCountries(country) {
	  const visitedCountries= ["Vietnam", "Thailand", "Maylaysia", "Singapore", "Cambodia", "Laos", "Indonesia",
	                   "United Kingdom", "France", "Italy", "Monico", "Switzerland", "South Africa", 
	                   "United States", "China"];

	    for (let i=0 ; i<visitedCountries.length ; i++) {
	    	if((visitedCountries[i]).includes(country)) {
	    		return "#e7d8ad";
	    	}
	    }
	    return "#12EA00";

	}


	render() {	
		const countries = worldData.features
      							   .map((d,i) => {
      							   		return (
      							   			<RenderingPath 
      							   				key= {"path" + i}
												d = { this.geoGenerator(d) }
												fill= { this.symbolVisitedCountries(d.properties.name) }
												onClick={ () => this.handleCountryClick(d) }
												text= {d.properties.name}
      							   			/>
										)
      							   	});	
		return (
			<svg width="820" height="620">
				<circle className="circle" cx={this.translateX} cy={this.translateY} r="300" fill="#1C70C8"></circle>
				{countries}
			</svg>
		)
	}
}

class RenderingPath extends React.Component {
	constructor(props){
	    super(props);
	}

	render() {
		return(
			<path className= "country" key= {this.props.key} d={this.props.d}
				  fill= {this.props.fill} stroke= "#FFFFFF" strokeWidth ="0.5"
				  onClick={this.props.onClick}>
				
				<text fill="red">
				    <textPath xlinkHref={this.props.key}>
				      {this.props.text}
				    </textPath>
			    </text>
			
			</path>
		)
	}
}



export default WorldMap;

