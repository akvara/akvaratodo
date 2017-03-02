
var TaskApp = React.createClass({

	statics: {
		apiUrl: "http://listalous.herokuapp.com/lists/akvaratodo/"
	},

	getInitialState: function() {

		return {
			itemsToDo: this.saved(),

			itemsDone: [
			],

			task: ''
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault();

		this.setState({ 
			itemsToDo: this.state.itemsToDo.concat([this.state.task]),
			task: ''
		});
	},

    removeTask: function(i) {
		this.setState({ items: this.state.itemsToDo.splice(i, 1) });
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

	saved: function() {
		return `
Paleisti Sort ant Heroku
		`.split(/\r?\n/).filter(entry => entry.trim() != '')
	},

	postItem: function(item) {
  		var creationRequest = $.ajax({
    		type: 'POST',
    		url: this.apiUrl + "items",
    		data: { description: itemDescription, completed: false }
  		})
	},

	loadItems: function() {
		var loadRequest = $.ajax({
  			type: 'GET',
  			url: this.apiUrl
		});

		loadRequest.done(function(dataFromServer) {
      		items = dataFromServer.items;
      		console.log("aha!");
      // notifyComponents()
	    })
	},

	render: function() {
		return (
			<div class="container">
			    <div class="row">
        <div class="col-sm-8 blog-main">

				<h1>My tasks</h1>
				<button onClick={this.loadItems}>Load</button>
				<h3>Finished ({this.state.itemsDone.length})</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask} />
				<h3>Remaining ({this.state.itemsToDo.length})</h3>
				<TaskList 
					items={this.state.itemsToDo} 
					delete={this.removeTask} 
					postpone={this.postponeTask} 
					done={this.doneTask}
				/>
				<h3>Add new:</h3>
				<form onSubmit={this.handleSubmit}>
					<input value={this.state.task} onChange={this.onChange} />
					<button>Add task</button>
				</form>
			</div>
			</div>
			</div>
		);
	}
});


React.render(<TaskApp />, document.body)