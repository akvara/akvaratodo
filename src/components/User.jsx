import React, { Component } from 'react';
import CONFIG from '../config.js';

class User extends Component {
	renderSettings(lists) {
		this.props.renderSettings(lists);
	}

	render() {
		return <div>
			<span className="list-item">{CONFIG.version} <small><b>{process.env.NODE_ENV}</b></small></span>
			<span className="glyphicon glyphicon-cog action-button" aria-hidden="true" onClick={this.renderSettings.bind(this, this.props.lists)}></span>
			<span className="action-button">{CONFIG.user.name}</span>
		</div>
	}
}

export default User;
