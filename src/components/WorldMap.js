import React, { Component } from 'react'
import '../style.css'
import worldData from '../utils/worldData.js'
import colourVisitedCountries from '../utils/visitedCountries.js'
import { geoPath, geoOrthographic, centroid } from 'd3-geo'
import { timer } from 'd3-timer'
import { select, mouse } from 'd3-selection'

class WorldMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeDelta: 0,
			startTime: Date.now(),
			startedSpinning: false,
			tooltip: null
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

		this.tooltip = select("body") //for hover
		  .append("div")
		  .attr("class", "tooltip hidden");
		  
		this.tooltip_point = select("body") //for click
		    .append("div")
		    .attr("class", "tooltip_point hidden");

		this.width = window.innerWidth;
    	this.height = window.innerHeight;

		this.handleCountryClick = this.handleCountryClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave= this.handleMouseLeave.bind(this);

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

	// showTooltipPoint(d) {
	// 	let mouse = mouse(this.svg.node()).map(function(d) {
 //                        return parseInt(d);
	// 	            });
	// 	this.tooltip_point.classed('hidden', false) //make tooltip visible
	// 					  .html(d.properties.name) //display the name of point
	// 					  .attr('style', //set size of the tooltip
	// 	                        'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px')
	// }

	// // hide point tooltip
	// hideTooltipPoint(d) {
	//   this.tooltip_point.classed('hidden', true);
	// }

	handleMouseEnter(d) {
		console.log("OVER", d);
	    this.setState({tooltip: d})
	}

	handleMouseLeave() {
		console.log("LEAVE");
	    this.setState({tooltip: null})
	}

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
      							   			<Countries 
      							   				key= {"path" + i}
												d = { this.geoGenerator(d) }
												fill= { this.symbolVisitedCountries(d.properties.name) }
												onClick={ () => this.handleCountryClick(d) }
												onMouseEnter={ () => this.handleMouseEnter(d) }
												onMouseLeave={ this.handleMouseLeave }
												
      							   			/>
										)
      							   	});	
      	const labels = worldData.features
      							   .map((d,i) => {
      							   		return (
      							   			<Labels 
												cx= {this.geoGenerator.centroid(d)[0]}
												cy= {this.geoGenerator.centroid(d)[1]}
												id= {d.id}
												area= {this.geoGenerator.area(d)}
      							   			/>
										)
      							   	});	

      	let tooltip = null;
      	if(this.state.tooltip) {
      		let [x,y] = this.geoGenerator.centroid(this.state.tooltip);
			let tooltipData = {
				x: x, 
				y: y, 
				label: this.state.tooltip.properties.name
			};
			tooltip = <Tooltips tooltip={tooltipData} />;
			console.log(tooltipData);
      	}
      	
		return (

			<svg width="820" height="620">
				<circle className="circle" cx={this.translateX} cy={this.translateY} r="300" fill="#1C70C8"></circle>
				{countries}
				{labels}
				{tooltip}
			</svg>
		)
	}
}

class Countries extends React.Component {
	render() {
		return(
			<g>
				<path className= "country" key= {this.props.key} d={this.props.d}
					  fill= {this.props.fill} stroke= "#FFFFFF" strokeWidth ="0.5"
					  onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
				</path> 				
			</g>
		)
	}
}

class Labels extends React.Component {
	render() {
		return(
			<g>
				{
					(this.props.area > 400) 
					? <text className="countriesIDs" x={this.props.cx} y={this.props.cy} alignmentBaseline="middle" textAnchor="middle">
						{this.props.id}
				       </text>
			    	:

			    	(this.props.area > 50)
			    	? <circle r="2" cx={this.props.cx} cy={this.props.cy}> </circle>
			    	: null
				}				
			</g>
		)
	}
}

class Tooltips extends React.Component {
	render() {
		let { tooltip } = this.props;
    	let { x, y, label } = tooltip;
		return (
			<g style={{pointerEvents: "none"}}>
				<rect x={x+20} y={y-30} height="30" width="60"></rect>
				<text x={x+40} y={y-10} textAnchor="middle" alignmentBaseline="middle" style={{"color": "white"}}> {label} </text>
			</g>
		)
	}
}


export default WorldMap;

