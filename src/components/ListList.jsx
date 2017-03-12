import React, { Component } from 'react';
import config from '../config.js';

class ListList extends Component {

	removeList(id) {
		this.props.removeList(id);
	}

	loadList(...params) {
		this.props.loadList(...params);
	}

	displayList(list, i) {
		let listName = list.name ? list.name : "[noname]";
		let listTasks = list.tasks ? list.tasks.substr(0, config.maxTaskLength) : " ";

		let listAsDisplayed = listName + ": " + listTasks;
		if (list.updatedAt) {
			listAsDisplayed = list.updatedAt.substr(-13, 8) + " - " + listAsDisplayed
		}

		let buttonTitle = "load " + list._id;
		let deletable = list.tasks ? (list.tasks === '[]' && !list.immutable) : true;

		return (
			<li key={'li'+i}>
				<button title={buttonTitle} onClick={this.loadList.bind(this, list._id, list.name)}>Load</button>
				&nbsp;
				{ listAsDisplayed }
				&nbsp;
				{deletable &&
					<button title="remove" onClick={this.removeList.bind(this, list._id)}>x</button>
				}
			</li>
		);
	}

	render() {
		return (
			<ul>
				{this.props.lists.map(this.displayList.bind(this))}
			</ul>
		);
	}
}

export default ListList;
