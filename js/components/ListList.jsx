var ListList = React.createClass({

	delete: function (i) {
		this.props.delete(i);
	},

	loadList: function (listId, listName) {
		React.render(<TaskApp 
			config={CONFIG} 
			listId={listId}
			listName={listName}
			immutables={this.props.lists.filter((item) => item.immutable)}
			itemsDone={this.props.itemsDone} 
		/>, document.getElementById("app"));
	},

	displayList: function (list, i) {
		let listName = list.name ? list.name : "[noname]";
		let listTasks = list.tasks ? list.tasks.substr(0, 40) : "[empty]";

		let listAsDisplayed = listName + " " + listTasks;
		let title = "load " + list._id;
		let deletable = list.tasks ? list.tasks ==="[]" && !list.immutable : true
		return <li key={'li'+i}>
			<button title={title} onClick={this.loadList.bind(this, list._id, listName)}>Load</button>
			&nbsp;
			{ listAsDisplayed }
			&nbsp;
			{deletable  &&
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
