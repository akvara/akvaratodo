import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';
// import $ from 'jquery';


class ListList extends Component {

	delete(i) {
		this.props.delete(i);
	}

	load(listId) {
// console.log('listList listid', listId);		
		ReactDOM.render(<TaskApp 
			listId={listId} 
			immutables={this.props.lists.filter((item) => item.immutable)}
			itemsDone={this.props.itemsDone} 
		/>, document.getElementById("app"));
	}

	displayList(list, i) {
		let listName = list.name ? list.name : "[noname]";
		let listTasks = list.tasks ? list.tasks.substr(0, 40) : "[empty]";

		let listAsDisplayed = listName + " (" + listTasks + ")";
		let title = "load " + list._id;
		return (
			<li key={'li'+i}>
				<button title={title} onClick={this.load.bind(this, list._id)}>Load</button>
				&nbsp;
				{ listAsDisplayed }
				&nbsp;
				{!list.immutable  &&
					<button title="remove" onClick={this.delete.bind(this, list._id)}>x</button>
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
