import React, { Component } from 'react'


class Categories extends React.Component {
	constructor(props){
		super(props);
	}

	render() {
		return(
			<div className="categories">
				<p className="box1">Countries that Huong has visited</p>
				<p className="box2">Countries that Huong will visit one day</p>
			</div>
		)
	}
}


export default Categories;