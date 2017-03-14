import React, { Component } from 'react';
import CONFIG from '../config.js';

class User extends Component {
	settings(lists) {
		this.props.settings(lists);
	}

	render() {
		return <div>
			<span className="list-item">{CONFIG.version}</span>
			<span className="glyphicon glyphicon-cog action-button" aria-hidden="true" onClick={this.settings.bind(this, this.props.lists)}></span>
			<span className="action-button">{CONFIG.user.name}</span>
		</div>
	}
}

export default User;
