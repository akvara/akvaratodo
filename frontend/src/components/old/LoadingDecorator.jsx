import React, { Component } from 'react';
import CONFIG from '../config.js';

class LoadingDecorator extends Component {
	constructor(props, context) {
	    super(props, context);

		this.interval = null;

	    this.state = {
	    	message: '',
			loadingString: ''
	    }
	}

	componentWillMount() {
		this.doAction(this.props.request, this.props.callback, this.props.actionMessage, this.props.finishedMessage);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps) this.doAction(nextProps.request, nextProps.callback, nextProps.actionMessage, nextProps.finishedMessage);
	}

	doAction(request, callback, actionMessage, finishedMessage) {
		clearInterval(this.interval);
		this.interval = setInterval(this.tick.bind(this), 100);
		this.setState({
			message: actionMessage,
			loadingString: '',
		});
		new Promise((resolve, reject) => request(resolve, reject))
	    	.then((val) => {
	    		clearInterval(this.interval);
	    		this.setState({
	    			message: finishedMessage,
	    			loadingString: ''
	    		});
	    		callback(val);
	    	})
				.catch((err) => {
					clearInterval(this.interval);
					this.setState({
						loadingString: ' error: ' + err
					})
				console.log("rejected:", err);
				});
	}

	tick() {
		var loadingString = '.';
		loadingString += this.state.loadingString.length < CONFIG.loadingStringLength ? this.state.loadingString : '';
		this.setState({loadingString});
	}

  	/* The Renderer */
	render() {
		return <div>{this.state.message} {this.state.loadingString}</div>
	}
}

export default LoadingDecorator;