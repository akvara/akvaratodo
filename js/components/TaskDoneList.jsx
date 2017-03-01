var TaskDoneList = React.createClass({

	undone: function(i) {
		this.props.undone(i);
	},

	displayTask: function(task, i) {
		return <li>
			{task}&nbsp;
			<button onClick={this.undone.bind(this, i)}>-</button>
		</li>;
	},

	render: function() {
		return (
			<ul className="done">
				{ this.props.items.map(this.displayTask) }
			</ul>
		);
	}
});