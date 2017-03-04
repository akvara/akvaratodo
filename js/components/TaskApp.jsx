var TaskApp = React.createClass({

	getInitialState: function() {

		return {
			itemsToDo: [],
			itemsDone: [],
			task: ''
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault();

 		this.state.itemsToDo.splice(this.props.config.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));

		this.setState({ 
			itemsToDo: _.unique(this.state.itemsToDo),
			task: ''
		});
	},

    removeTask: function(i) {
		this.setState({ items: this.state.itemsToDo.splice(i, 1) });
	},

    postponeTask: function(i) {
		this.setState({ 
			items: this.moveFromTo(this.state.itemsToDo, i, i + this.props.config.postponeBy) 
		});
	},

	doneTask: function(i) {
		var moved = this.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i)
		this.setState({ 
			itemsToDo: moved.A, 
			itemsDone: moved.B
		});
		this.backup(moved.A);
	},

	unDoneTask: function(i) {
		var moved = this.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i)
		this.setState({ 
			itemsToDo: moved.B, 
			itemsDone: moved.A
		});
	},	

	procrastinateTask: function(i) {
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

	loadDaily: function () {
		this.readFromFile('daily', true);
	},	

	saveBackup: function (items) {
		$.cookie(this.props.config.cookieTodo, JSON.stringify(items));
	},

	clear: function () {
		$.cookie(this.props.config.cookieTodo, '');
	},

	prepend: function (items) {
		console.log('prepend', items);			
	},

	loadData: function () {
		let backupData = $.cookie(this.props.config.cookieTodo);

		if (backupData) {
			console.log('Loading from backup');
			this.setState({
				itemsToDo: JSON.parse(backupData)
			})
		} else {
			this.readFromFile('daily', true);
			this.readFromFile('postponed', false);
		}
	},

	getFileContents: function(fileName) {
		console.log("Loading " + fileName + "...");
		return this.request('GET', fileName + '.txt', './' + fileName + '.txt?<?php echo time(); ?>');
	},

	request: function (method, resource, url) {
	    return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        xhr.open(method, url);
	        xhr.onload = () => {
	            if (xhr.status >= 200 && xhr.status < 300) {
	                resolve(xhr.response);
	            } else {
	                reject(xhr.statusText + " : " + resource);
	            }
	        };
	        xhr.onerror = () => reject(xhr.statusText);
	        xhr.send();
	    });
	},

	readFromFile: function (fileName, comesFirst) {
		var textToArray = (text) => text.split(/\r?\n/).filter(entry => entry.trim() != '');
	    
	    this.getFileContents(fileName)
		.then(function (result) {
			console.log(fileName + " loaded.");
			if (comesFirst) {
				this.setState({
					itemsToDo: _.unique(textToArray(result).concat(this.state.itemsToDo))
				})
			}
			else {
				this.setState({
					itemsToDo: _.unique(this.state.itemsToDo.concat(textToArray(result)))
				})
			}
		}.bind(this))
		.catch(err => {
		    console.log("File load error:", err);
		});
	},

	componentWillMount: function() {
    	this.loadData();
  	},

	render: function() {
		
		var today = new Date().toISOString().slice(0, 10);

		return (
			<div>
				<h1>My tasks: {today}</h1>
				<button onClick={this.loadDaily}>Load daily</button>
				<button onClick={this.clear}>Clear</button>

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
					config={this.props.config}
				/>
				<hr />
				<h3>Add new:</h3>
				<form onSubmit={this.handleSubmit}>
					<input value={this.state.task} onChange={this.onChange} />
					<button disabled={this.state.task.trim()==''} >Add task</button>
				</form>
			</div>
		);
	}
});
