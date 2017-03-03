var TaskApp = React.createClass({

	statics: {
		postponeBy: 10,
		addNewAt: 5
	},

	getInitialState: function() {

		return {
			itemsToDo: this.props.items,
			itemsDone: [],
			task: ''
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault();

 		this.state.itemsToDo.splice(this.constructor.addNewAt - 1, 0, this.state.task);

		this.setState({ 
			task: ''
		});
	},

    removeTask: function(i) {
		this.setState({ items: this.state.itemsToDo.splice(i, 1) });
	},

    postponeTask: function(i) {
		this.setState({ 
			items: this.moveFromTo(this.state.itemsToDo, i, i + this.constructor.postponeBy) 
		});
	},

	doneTask: function(i){
		var moved = this.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i)
		this.setState({ 
			itemsToDo: moved.A, 
			itemsDone: moved.B
		});
	},

	unDoneTask: function(i){
		var moved = this.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i)
		this.setState({ 
			itemsToDo: moved.B, 
			itemsDone: moved.A
		});
	},	

	procrastinateTask: function(i){
		this.setState({ 
			itemsToDo: this.moveToEnd(this.state.itemsToDo, i)
		});
	},

	onChange: function (e) {
		this.setState({ task: e.target.value });
	},

	moveToAnother: function(fromA, toB, i) {
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

	moveFromTo: function (arrayA, from, to) {
  		trans = arrayA[from];
		arrayA.splice(from, 1); 
		arrayA.splice(to, 0, trans);

  		return arrayA;
	},

	saveFileContents: function (fileName) {
		console.log("saving " + fileName + "...");
		return request('POST', fileName + '.txt', './' + fileName + '.txt');
	},

	save: function () {
		$.cookie('my-first-cookie', 'cookie data');
		// var pr = new Promise(this.saveFileContents('backup'));

		// pr.then(function(result) {
		// 		console.log("Backup saved.");
		// 	})
		// 	.catch(err => {
  //   			console.log("File save error:", err);
		// 	});
	},

	load: function () {
		console.log($.cookie('my-first-cookie'));
	},

	render: function() {
		
		var today = new Date().toISOString().slice(0, 10);
		
		return (
			<div>
				<h1>My tasks: {today}</h1>
				<button onClick={this.save}>Save</button>
				<button onClick={this.load}>Load</button>

				<hr />
				<h3>Finished ({this.state.itemsDone.length})</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask} />
				<hr />
				<h3>Remaining ({this.state.itemsToDo.length})</h3>
				<TaskList 
					items={this.state.itemsToDo} 
					delete={this.removeTask} 
					postpone={this.postponeTask} 
					procrastinate={this.procrastinateTask} 
					done={this.doneTask}
				/>
				<hr />
				<h3>Add new:</h3>
				<form onSubmit={this.handleSubmit}>
					<input value={this.state.task} onChange={this.onChange} />
					<button>Add task</button>
				</form>
			</div>
		);
	}
});
