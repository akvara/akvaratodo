var TaskList = React.createClass({

	done: function(i){
		this.props.done(i);
	},

	delete: function(i){
		this.props.delete(i);
	},

	displayTask: function(task, i) {
		return <li>
			<button onClick={this.delete.bind(this, i)}>x</button>
			&nbsp;{ task } &nbsp;
			<button onClick={this.done.bind(this, i)}>+</button>
		</li>
	},
	
	render: function() {

		return (
			<ul>
				{this.props.items.map(this.displayTask)}
			</ul>
		);
	}
});

