import React, { Component } from 'react';
import CONFIG from '../config.js';

class User extends Component {
	settings(lists) {
		this.props.settings(lists);
	}

	render() {
		return <div>
			{CONFIG.version}
			<span className="glyphicon glyphicon-cog list-item" aria-hidden="true" onClick={this.settings.bind(this, this.props.lists)}></span>
			{CONFIG.user.name}
		</div>
	}
}

export default User;
