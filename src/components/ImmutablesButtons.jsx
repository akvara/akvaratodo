import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import TaskApp from './TaskApp';
import config from './config.js';

class ImmutablesButtons extends Component {

	buttonAction(i) {
console.log("ImmutablesButtons item", i);		
console.log("ImmutablesButtons action", this.props.buttonAction);		
		// this.props.buttonAction(i);
	}

	render() {
console.log("ImmutablesButtons list", this.props.list);		
		return (
			<div>
				{ this.props.list.map((item) => this.buttonAction.bind(this, item)) }
			</div>
		);
	}
}

export default ImmutablesButtons;
