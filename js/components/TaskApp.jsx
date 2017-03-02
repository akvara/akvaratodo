
var TaskApp = React.createClass({

	saved: function() {
		return `
starts with http? a link
Show 5
add at +7
read from local file
Paleisti Sort ant Heroku

https://devcenter.heroku.com/articles/getting-started-with-php#introduction
https://blog.heroku.com/deploying-react-with-zero-configuration
https://getforge.com/pricing
http://docs.railsbridge.org/javascript-to-do-list-with-react/creating_a_list
http://reactfordesigners.com/labs/reactjs-introduction-for-people-who-know-just-enough-jquery-to-get-by/
https://laracasts.com/series/do-you-react/episodes/6
https://scotch.io/tutorials/learning-react-getting-started-and-concepts

------------------------
		`.split(/\r?\n/).filter(entry => entry.trim() != '')
	},

	statics: {
		apiUrl: "http://listalous.herokuapp.com/lists/akvaratodo/",
		postponeBy: 10,
		addNewAt: 5
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

	postItem: function(item) {
  		var creationRequest = $.ajax({
    		type: 'POST',
    		url: this.constructor.apiUrl + "items",
    		data: { description: itemDescription, completed: false }
  		})
	},

	loadItems: function() {
		var loadRequest = $.ajax({
  			type: 'GET',
  			url: this.constructor.apiUrl
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
					procrastinate={this.procrastinateTask} 
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