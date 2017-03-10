import React, { Component } from 'react';
import config from '../config.js';

class Messenger extends Component {
	render() {
		var type, message;
		if (this.props.success) {
			message = this.props.success;
			type = 'success';
		}		
		if (this.props.info) {
			message = this.props.info;
			type = 'info';
		}		
		if (this.props.error) {
			message = this.props.error;
			type = 'error';
		}
		if (!message) return null;
		return <div className="messenger messenger-{type}">{message}</div>
	}
}

export default Messenger;
