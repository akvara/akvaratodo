import React, { Component } from 'react';
import CONFIG from '../config.js';

class LoadingDecorator extends Component {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
	    	actionString: this.props.action || "Loading",
			loadingString: '',
			finished: false
	    }
	}

	componentDidMount() {
		this.interval = setInterval(this.tick.bind(this), 100);

		new Promise((resolve, reject) => this.props.request(resolve, reject))
	    	.then((val) => {
	    		clearInterval(this.interval);
	    		this.interval = 0;

				this.props.callback(val);
// console.log("fulfilled:", val);

	    	})
 			.catch((err) => {
 				clearInterval(this.interval);
 				this.interval = 0;
 				this.setState({
					loadingString: ' error'
				})
				console.log("rejected:", err);
 			});
	}

	tick() {
		var loadingString = '.';
		loadingString += this.state.loadingString.length < CONFIG.loadingStringLength ? this.state.loadingString : '';

		this.setState({loadingString});
	}

	render() {
	    if (this.state.finished)
	    	return null;
		return <div>{this.state.actionString} {this.state.loadingString}</div>
	}
}

export default LoadingDecorator;
