import React, { Component } from 'react';

class ListList extends Component {

	removeList(i) {
		this.props.removeList(i);
	}

	loadList(i) {
		this.props.loadList(i);
	}

	displayList(list, i) {
		let listName = list.name ? list.name : "[noname]";
		let listTasks = list.tasks ? list.tasks.substr(0, 40) : "[empty]";

		let listAsDisplayed = listName + ": " + listTasks;
		let title = "load " + list._id;
		return (
			<li key={'li'+i}>
				<button title={title} onClick={this.loadList.bind(this, list._id)}>Load</button>
				&nbsp;
				{ listAsDisplayed }
				&nbsp;
				{!list.immutable  &&
					<button title="remove" onClick={this.removeList.bind(this, list._id)}>x</button>
				}
			</li>
		);
	}
	
	render() {
console.log("ListList", this.props.lists);
		return (
			<ul>
				{this.props.lists.map(this.displayList.bind(this))}
			</ul>
		);
	}
}

export default ListList;
