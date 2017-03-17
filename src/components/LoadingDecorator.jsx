import React, { Component } from 'react';
import CONFIG from '../config.js';

class LoadingDecorator extends Component {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
	    	message: '',
			loadingString: ''
	    }
	}

    componentDidMount() {
// console.log('Decorator Did Mount');
    }

    componentWillUnmount() {
// console.log('Decorator Will Un');
    }

    componentWillUpdate() {
// console.log('Decorator Will Update');
    }

    componentDidUpdate() {
    	// if (this.state.finished) {
    		// this.props.callback(this.state.val);
    	// }
// console.log('Decorator Did Update');
    }

	componentWillMount() {
// console.log('Decorator Will Mount');
		this.doAction(this.props.request, this.props.callback, this.props.actionMessage, this.props.finishedMessage);
	}

	componentWillReceiveProps(nextProps) {
// console.log('Decorator Will Receive PROPS', this.props , nextProps);
		if (this.props !== nextProps) this.doAction(nextProps.request, nextProps.callback, nextProps.actionMessage, nextProps.finishedMessage);
	}

	doAction(request, callback, actionMessage, finishedMessage) {
		this.interval = setInterval(this.tick.bind(this), 100);
		this.setState({
			message: actionMessage,
			loadingString: '',
			// finished: false,put
		});
		new Promise((resolve, reject) => request(resolve, reject))
	    	.then((val) => {
	    		clearInterval(this.interval);
	    		this.interval = 0;
	    		this.setState({
	    			message: finishedMessage,
	    			loadingString: ''
	    		});
	    		callback(val);
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
		return <div>{this.state.message} {this.state.loadingString}</div>
	}
}

export default LoadingDecorator;
