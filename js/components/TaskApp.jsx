var TaskApp = React.createClass({

	getInitialState: function() {

		return {
			uri: this.props.config.listsapi + "lists/" + this.props.listId,
			listsUri: this.props.config.listsapi + "lists/",
			itemsToDo: [], // generate with: Array.from(Array(40)).map((e,i)=>(i).toString()),
			itemsDone: this.props.itemsDone || [],
			receiving: this.props.receiving,
			listName: [],
			immutable: false,
			task: ''
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault();

 		this.state.itemsToDo.splice(this.props.config.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));

		this.setState({ 
			itemsToDo: _.unique(this.state.itemsToDo),
			task: ''
		}, this.save.bind(this));
	},

    removeTask: function(i, callback) {
    	console.log("nugi???", callback);

 		this.state.itemsToDo.splice(i, 1);
		this.setState({ itemsToDo: this.state.itemsToDo }, function (callback) { 
			this.save();
			if (callback) callback();
		}.bind(this, callback));
	},

    moveOutside: function(i) {
 		removed = this.state.itemsToDo[i];
 		this.removeTask(i, function(removed) {
			React.render(<Move config={this.props.config} item={removed} itemsDone={this.state.itemsDone}/>, document.getElementById("app"));
 		}.bind(this, removed));
	},

    postponeTask: function(i) {
    	let items = this.moveFromTo(this.state.itemsToDo, i, i + this.props.config.postponeBy)
		this.setState({ itemsToDo: items }, this.save);
	},

	doneTask: function(i) {
		var moved = this.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false)
		this.setState({ 
			itemsToDo: moved.A, 
			itemsDone: moved.B
		}, this.save);
	},

	unDoneTask: function(i) {
		var moved = this.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true)
		this.setState({ 
			itemsToDo: moved.B, 
			itemsDone: moved.A
		}, this.save);
	},	

	procrastinateTask: function(i) {
		let items = this.moveToEnd(this.state.itemsToDo, i);
		this.setState({ itemsToDo: items }, this.save);
	},

	onChange: function (e) {
		this.setState({ task: e.target.value });
	},

	moveToAnother: function(fromA, toB, i, toTop) {
  		trans = fromA[i];
  		fromA.splice(i, 1);
  		if (toTop) {
	  		toB = [trans].concat(toB);	
	  	} else {
	  		toB = toB.concat([trans]);
	  	}

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

	loadAnoter: function (listId) {

// console.log("loadAnoter: ", this.state.listsUri + listId);
		$.get(this.state.listsUri + listId)
		.done(function(data, textStatus, jqXHR) {
			this.setState({ 
				itemsToDo:  _.unique(JSON.parse(data.tasks).concat(this.state.itemsToDo))
			}, this.save);
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
	},	

	loadDaily: function () {
		this.readFromFile('daily', true);
	},	

	loadPostponed: function () {
		this.readFromFile('postponed', true);
	},	

	saveBackup: function (items) {
		$.cookie(this.props.config.cookieTodo, JSON.stringify(items));	
	},

	clear: function () {
		$.cookie(this.props.config.cookieTodo, '');
	},

	save: function () {
		let uri = this.state.uri;
// console.log('save kvietėte?', this.state.itemsToDo);		
		$.ajax({
			url: this.state.uri,
			type: 'PUT',
			data: { 
				tasks: JSON.stringify(this.state.itemsToDo),
				immutable: this.state.immutable
			}
		})
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
	},

	mark: function () {
		this.setState({
			immutable: !this.state.immutable
		}, this.save);
	},

	load: function () {
		$.get(this.state.uri)
		.done(function(data, textStatus, jqXHR) {
// console.log('~TaskApp data~', this.state.uri, data);
			let itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];

			if (this.state.receiving) {
				itemsToDo = [this.state.receiving].concat(itemsToDo);
			}

			this.setState({
				listName: data.name, 
				immutable: data.immutable,
				itemsToDo: itemsToDo,
				receiving: null
			}, this.state.receiving ? this.save : null);
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
	},

	loadDataFromCookies: function () {
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

	textToArray: (text) => text.split(/\r?\n/).filter(entry => entry.trim() != ''),

	readFromFile: function (fileName, comesFirst) {
	    this.getFileContents(fileName)
		.then(function (result) {
			if (comesFirst) {
				var items = _.unique(this.textToArray(result).concat(this.state.itemsToDo))
			}
			else {
				var items = _.unique(this.state.itemsToDo.concat(this.textToArray(result)))
			}
			this.setState({	itemsToDo: items });
			this.save(items);
			console.log(fileName + " loaded.");
		}.bind(this))
		.catch(err => {
		    console.log("File load error:", err);
		});
	},

	handleLists: function() {
    	React.render(<ListApp config={this.props.config} itemsDone={this.state.itemsDone}/>, document.getElementById("app"));
  	},

	componentWillMount: function() {
    	this.load()
  	},

  	displayLoadButton: function (item) {
  		var listName = item.name;
  		var id = item._id;

  		return <button onClick={this.loadAnoter.bind(this, id)} >Load from { listName }</button>
  	},

	render: function() {
		
		var today = new Date().toISOString().slice(0, 10);
		var markTitle = 'Mark immutable';
		if (this.state.immutable) 
			markTitle = 'Unmark immutable';
		var list = '';
// console.log('Render!', this.props.immutables);
		return (
			<div>
				<h1>{this.state.listName} {today}</h1>
				<h3>Finished ({this.state.itemsDone.length})</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask} />
				<hr />
				<h3>Remaining ({this.state.itemsToDo.length})</h3>
				<TaskList 
					items={this.state.itemsToDo} 
					immutable={this.state.immutable} 
					delete={this.removeTask} 
					move={this.moveOutside} 
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
				<hr />
				{ this.props.immutables.map((list) => this.displayLoadButton(list)) }
				<button onClick={this.mark}>{markTitle}</button>
				<button onClick={this.handleLists}>Lists</button>
				<hr />
			</div>
		);
	}
});