import React, { Component } from 'react';
import CONFIG from '../config.js';

class ListList extends Component {

	removeList(id) {
		this.props.removeList(id);
	}

	loadList(...params) {
		this.props.loadList(...params);
	}

	displayList(list, i) {
		var itemClass = "list-item";

		if (list.immutable) {
			itemClass += " list-item-immutable"
		}

		if (list.name === CONFIG.user.loadListIfExists) {
			itemClass += " list-item-current"
		}

		let buttonTitle = "load " + list._id;
		let deletable = list.tasks ? (list.tasks === '[]' && !list.immutable) : true;

		return (
			<tr key={'tr'+i} onClick={this.loadList.bind(this, list._id, list.name)}>
				<td className={itemClass}>
					<span className="glyphicon glyphicon-folder-open list-item" aria-hidden="true"></span>
					{ list.name }
				</td>
				<td>
				{deletable &&
					<span className="glyphicon glyphicon-trash action-button" aria-hidden="true" onClick={this.removeList.bind(this, list._id)}></span>
				}
				</td>
			</tr>
		);
	}

	render() {
		return (
			<table className="table table-hover">
				<tbody>
					{this.props.lists.map(this.displayList.bind(this))}
				</tbody>
			</table>
		);
	}
}

export default ListList;
