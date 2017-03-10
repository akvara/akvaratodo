import React, { Component } from 'react';
import config from '../config.js';

class LoadingDecorator extends Component {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
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
				console.log("fulfilled:", val);
				   
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

	componentWillUnmount() {
	}

	tick() {
		var loadingString = '.';
		loadingString += this.state.loadingString.length < config.loadingStringLength ? this.state.loadingString : '';

		this.setState({loadingString});
	}

	render() {
	    if (this.state.finished)
	    	return null;
		return <div>{this.props.action} {this.state.loadingString}</div>
	}
}

export default LoadingDecorator;
