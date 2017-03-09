var ListList = React.createClass({

	delete: function (i) {
		this.props.delete(i);
	},

	load: function (listId) {
// console.log('listList listid', listId);		
		React.render(<TaskApp 
			config={CONFIG} 
			listId={listId} 
			immutables={this.props.lists.filter((item) => item.immutable)}
			itemsDone={this.props.itemsDone} 
		/>, document.getElementById("app"));
	},

	displayList: function (list, i) {
		let listName = list.name ? list.name : "[noname]";
		let listTasks = list.tasks ? list.tasks.substr(0, 40) : "[empty]";

		let listAsDisplayed = listName + " (" + listTasks + ")";
		let title = "load " + list._id;
		return <li key={'li'+i}>
			<button title={title} onClick={this.load.bind(this, list._id)}>Load</button>
			&nbsp;
			{ listAsDisplayed }
			&nbsp;
			{!list.immutable  &&
				<button title="remove" onClick={this.delete.bind(this, list._id)}>x</button>
			}
		</li>
	},
	
	render: function () {

		return (
			<ul>
				{this.props.lists.map(this.displayList)}
			</ul>
		);
	}
});
