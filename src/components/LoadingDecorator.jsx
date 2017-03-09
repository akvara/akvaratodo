import React, { Component } from 'react';
import config from '../config.js';

class LoadingDecorator extends Component {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
			loadingString: ''
	    }
	    console.log('LoadingDecorator called');
	}

	componentWillMount() {
		this.interval = setInterval(this.tick.bind(this), 100);

		new Promise((resolve, reject) => this.props.request(resolve, reject))
	    	.then((val) => {
	    		clearInterval(this.interval);
	    		this.props.callback(val);
	    		console.log("fulfilled:", val);
	    	})
 			.catch((err) => {
 				clearInterval(this.interval);
 				this.setState({ 
					loadingString: ' error'
				})
 				console.log("rejected:", err);
 			});
	}

	tick() {
		var loadingString = '.';
		loadingString += this.state.loadingString.length < config.loadingStringLength ? this.state.loadingString : '';

		this.setState({loadingString});
	}

	render() {
		return <div>Loading {this.state.loadingString}</div>
	}
}

export default LoadingDecorator;
