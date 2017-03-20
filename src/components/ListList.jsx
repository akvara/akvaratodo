import React, { Component } from 'react';
import CONFIG from '../config.js';

class ListList extends Component {

	/* Inherited */
	removeList(id) {
		this.props.removeList(id);
	}

	/* Inherited */
	goToList(...params) {
		this.props.goToList(...params);
	}

	/* Display list line */
	displayList(list, i) {
		var itemClass = "list-item";

		if (list.immutable) {
			itemClass += " list-item-immutable"
		}

		if (list.name === CONFIG.user.settings.goToListIfExists) {
			itemClass += " list-item-current"
		}

		let deletable = list.tasks ? (list.tasks === '[]' && !list.immutable) : true;
		var updatedDateOrTime = new Date().toISOString().substr(0, 10) === list.updatedAt.substr(0, 10) ?
			list.updatedAt.substr(11, 5) : list.updatedAt.substr(0, 10);
		return (
			<tr key={'tr'+i}>
				<td className={itemClass} onClick={this.goToList.bind(this, list._id, list.name)} >
					<span className="glyphicon glyphicon-folder-open list-item list-item-glyph" aria-hidden="true"></span>
				{ list.name }
				</td>
				<td className="actions">
				{deletable &&
					<span className="glyphicon glyphicon-trash action-button" aria-hidden="true" onClick={this.removeList.bind(this, list._id)}></span>
				}
				</td>
				<td className="right-align">
					(<strong>{ list.tasks ? JSON.parse(list.tasks).length : 0 }</strong>)
					&nbsp;
					{ updatedDateOrTime }
				</td>
			</tr>
		);
	}

	render() {
		return (
			<table className="table table-hover">
				<tbody>
				<tr></tr>
					{this.props.lists.map(this.displayList.bind(this))}
				</tbody>
			</table>
		);
	}
}

export default ListList;
