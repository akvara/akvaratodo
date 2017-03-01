var TaskApp = React.createClass({

	getInitialState: function() {
		return {
			itemsToDo: [
				'get groceries',
				'go ham in the dolla stow'
			],

			itemsDone: [
			],

			task: ''
		}
	},

	addTask: function (e) {
 		e.preventDefault();

		this.setState({ 
			itemsToDo: this.state.itemsToDo.concat([this.state.task]),
			task: ''
		});
	},

    removeTask: function(i) {
		var items = this.state.itemsToDo;
		delete items[i];
		this.setState({ items });
	},

	doneTask: function(i){
		var moved = this.moveElement(this.state.itemsToDo, this.state.itemsDone, i)
		this.setState({ 
			itemsToDo: moved.A, 
			itemsDone: moved.B
		});
	},

	unDoneTask: function(i){
		var moved = this.moveElement(this.state.itemsDone, this.state.itemsToDo, i)
		this.setState({ 
			itemsToDo: moved.B, 
			itemsDone: moved.A
		});
	},	

	postponeTask: function(i){
		this.setState({ 
			itemsToDo: this.moveToEnd(this.state.itemsToDo, i)
		});
	},

	onChange: function (e) {
		this.setState({ task: e.target.value });
	},

	moveElement: function(fromA, toB, i) {
  		trans = fromA[i];
  		fromA.splice(i, 1);
  		toB = toB.concat([trans]);

  		return {A: fromA, B: toB};
	},

	moveToEnd: function(items, i) {
  		trans = items[i];
  		items.splice(i, 1);

  		return items.concat([trans]);
	},

	render: function() {
		return (
			<div>
				<h1>My tasks</h1>
				<h3>Finished</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask} />
				<h3>Remaining</h3>
				<TaskList 
					items={this.state.itemsToDo} 
					delete={this.removeTask} 
					postpone={this.postponeTask} 
					done={this.doneTask}
				/>
				<h3>Add new:</h3>
				<form onSubmit={this.addTask}>
					<input value={this.state.task} onChange={this.onChange} />
					<button>Add task</button>
				</form>
			</div>
		);
	}
});

React.render(<TaskApp />, document.body)