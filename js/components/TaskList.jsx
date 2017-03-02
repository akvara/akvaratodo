var TaskList = React.createClass({

	done: function(i){
		this.props.done(i);
	},

	delete: function(i){
		this.props.delete(i);
	},

	procrastinate: function(i){
		this.props.procrastinate(i);
	},

	postpone: function(i){
		this.props.postpone(i);
	},

	displayTask: function(task, i) {
		let taskDescription = { task };
		if (task.substring(0, 4) == "http") {
			taskDescription = <a href={ task } target="_blank">{ task }</a>;
		}
		
		return <li>
			<button onClick={this.done.bind(this, i)}>--</button>
			&nbsp; 
			{ taskDescription }
			&nbsp;
			<button onClick={this.delete.bind(this, i)}>x</button>
			<button onClick={this.procrastinate.bind(this, i)}>v</button>
			<button onClick={this.postpone.bind(this, i)}>p</button>
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

