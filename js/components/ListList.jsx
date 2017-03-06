var ListList = React.createClass({

	delete: function (i) {
		this.props.delete(i);
	},

	displayList: function (list, i) {
console.log(list);
		let listName = list.name ? list.name : "[noname]";
		let listTasks = list.tasks ? list.tasks.substr(0, 40) : "[empty]";

		let listAsDisplayed = listName + " (" + listTasks + ")";
		return <li>
			{ listAsDisplayed }
			&nbsp;
			<button title="remove" onClick={this.delete.bind(this, list._id)}>x</button>
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