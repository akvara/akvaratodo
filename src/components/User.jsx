import React, { Component } from 'react';
import CONFIG from '../config.js';

class User extends Component {
	settings(lists) {
		this.props.settings(lists);
	}

	render() {
		return <div>
			{CONFIG.version}
			&nbsp;
			<button onClick={this.settings.bind(this, this.props.lists)}>
				<span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
			</button>
			&nbsp;
			<span className="glyphicon glyphicon-user" aria-hidden="true"></span> {CONFIG.user.name}
		</div>
	}
}

export default User;
