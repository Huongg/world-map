import React, { Component } from 'react'
import '../style.css'
import worldData from '../utils/worldData.js'
import colourVisitedCountries from '../utils/visitedCountries.js'
import { geoPath, geoOrthographic, centroid } from 'd3-geo'
import { timer } from 'd3-timer'
import { select, mouse } from 'd3-selection'

const defaultSize = 820;

class WorldMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeDelta: 0,
			startTime: Date.now(),
			startedSpinning: false,
			hover: false,
			tooltip: null
		};
		this.translateX = defaultSize/2 + 100;
		this.translateY = defaultSize/2
		this.projection = geoOrthographic()
						   .scale(300)
						   .translate([this.translateX, this.translateY])
						   .clipAngle(90)
						   .precision(0.3);

		this.geoGenerator = geoPath().projection(this.projection);
		this.svg = select("svg");

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
	      	startedSpinning: !this.state.startedSpinning,
	      	tooltip: d
	    });
   		// when the globe's stopped spinning, update the startTime to be at the point when its stopped
   		if(!this.state.startedSpinning){
   			this.setState({
   				startTime : Date.now() - this.state.timeDelta,
   				tooltip: null
   			});
   		} 
   }



	handleMouseEnter(d) {
	    this.setState({
	    	tooltip: d,
	    	// hover: true
	    })
	}

	handleMouseLeave() {
	    this.setState({
	    	tooltip: null,
	    	// hover: false
	    })
	}

    initSpinner() {
   	   // Configuration for the spinning effect
   	    let objState = this;
       	let projectionClosed = objState.projection;

       	// let time = Date.now();
       	const rotate = [0, 0];
	   	const velocity = [.002, -0];
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
			let tooltipData = {
				x: this.geoGenerator.centroid(this.state.tooltip)[0], 
				y: this.geoGenerator.centroid(this.state.tooltip)[1], 
				d: this.state.tooltip
			};
			tooltip = <InfoBox tooltip={tooltipData} />;
      	} 
      	
		return (
			<svg width={defaultSize} height={defaultSize}>
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
				<path className= "country" key= {this.props.key} d={this.props.d} stroke= "#FFFFFF" strokeWidth ="1"
					  fill= {this.props.fill} 
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


class InfoBox extends React.Component {
  render() {
  	let {tooltip} = this.props;
  	let {x, y, d} = tooltip;

  	let countryName = d.properties.name;
	let width = countryName.length * 12;
	const height = 40;

	let offsetX = width;
	let offsetY = -height;

	const maxTop = defaultSize * 0.6;
	const maxBottom = defaultSize * 0.4; 
	const maxLeft = defaultSize * 0.6;
	const maxRight = defaultSize * 0.4;

	if(y > maxTop) {
		offsetY = -height;
	} else if (y < maxBottom) {
		offsetY = height;
	}

	if(x > maxRight) {
		offsetX = -width;
	} else if (x < maxLeft) {
		offsetX = width/2;
	}
	
    return(
    	<svg style={{pointerEvents: "none"}}>
	    	<Rectangle 
	    		x={x - width/4  + offsetX}
	    		y={y + offsetY}
	    		width={width}
	    		height={height}
	    	/>
	    	<InfoText
	    		x={x + width/4 + offsetX}
	    		y={y + height/2 + offsetY}
	    		countryName={countryName}
	    	/>
	    </svg>
    ) 
  } 
}


class Rectangle extends React.Component {
  render() {
    let {x, y, width, height} = this.props;
    return (
    	<rect x={x} y={y} height={height} width={width}></rect>
    )
  }
  
}


class InfoText extends React.Component {
	render() {
		let {x, y, countryName} = this.props;
		return(
			<text x={x} y={y} textAnchor="middle" alignmentBaseline="middle"> {countryName} </text>
		)
	}
}





export default WorldMap;

