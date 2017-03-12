var TaskDoneList = React.createClass({

	undone: function(i) {
		this.props.undone(i);
	},

	displayTask: function(task, i) {
		return <li key={'li'+i}>
			<button onClick={this.undone.bind(this, i)}>+</button>
			&nbsp;
			{task}
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
