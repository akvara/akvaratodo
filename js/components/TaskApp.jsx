var TaskApp = React.createClass({

	getInitialState: function() {

		return {
			uri: this.props.config.listsapi + "lists/" + this.props.listId,
			listsUri: this.props.config.listsapi + "lists/",
			itemsToDo: [], 
			itemsDone: this.props.itemsDone || [],
			receiving: this.props.receiving,
			hightlightIndex: null,
			listName: 'Loading',
			immutable: false,
			task: ''
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault();

 		this.state.itemsToDo.splice(this.props.config.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
		this.setState({ 
			itemsToDo: _.unique(this.state.itemsToDo),
			hightlightIndex: Math.min(this.state.itemsToDo.length, this.props.config.addNewAt - 1),
			task: ''
		}, this.save);
	},

    removeTask: function(i, callback) {
 		this.state.itemsToDo.splice(i, 1);
		this.setState({ 
			itemsToDo: this.state.itemsToDo,
			hightlightIndex: null,
		}, function (callback) { 
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

	highlightPosition: function (i) {
		return  Math.min(
			this.state.itemsToDo.length - 1, 
			this.props.config.postponeBy - 1, 
			this.props.config.displayFirst
		) + (this.state.itemsToDo.length >= this.props.config.displayFirst ? 1 : 0);
	},

    postponeTask: function(i) {
    	let items = this.moveFromTo(this.state.itemsToDo, i, i + this.props.config.postponeBy)
		this.setState({ 
			itemsToDo: items ,
			hightlightIndex: this.highlightPosition(i),
		}, this.save);
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
			itemsDone: moved.A,
			hightlightIndex: 0
		}, this.save);
	},	

	procrastinateTask: function(i) {
		let items = this.moveToEnd(this.state.itemsToDo, i);
		this.setState({ 
			itemsToDo: items,
			hightlightIndex: this.state.itemsToDo.length
		}, this.save);
	},

	toTop: function(i) {
		let items = this.moveToTop(this.state.itemsToDo, i);
		this.setState({ 
			itemsToDo: items,
			hightlightIndex: 0
		}, this.save);
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

	moveToTop: function(items, i) {
  		trans = items[i];
  		items.splice(i, 1);

  		return [trans].concat(items);
	},

	moveFromTo: function (arrayA, from, to) {
  		trans = arrayA[from];
		arrayA.splice(from, 1); 
		arrayA.splice(to, 0, trans);

  		return arrayA;
	},

	loadAnoter: function (listId) {

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

	loadFake: function () {
		this.setState({
			listName: 'Test', 
			itemsToDo: Array.from(Array(this.props.config.displayListLength+1)).map((e,i)=>(i).toString()),
			receiving: null
		});
	},
	load: function () {
		$.get(this.state.uri)
		.done(function(data, textStatus, jqXHR) {
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
    	this.load();
    	// this.loadFake();
  	},
	componentDidMount: function() {
    	document.title = this.props.listName;
  	},

  	displayLoadButton: function (item) {
  		return <button key='load' onClick={this.loadAnoter.bind(this, item._id)} >Load from <strong>{ item.name }</strong></button>
  	},

	render: function() {
		
		// var today = new Date().toISOString().slice(0, 10);
		var markTitle = 'Mark immutable';
		if (this.state.immutable) 
			markTitle = 'Unmark immutable';
		var list = '';

		return (
			<div>
				<h1>{this.state.listName}</h1>
				<h3>Finished ({this.state.itemsDone.length})</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask} />
				<hr />
				<h3>Remaining ({this.state.itemsToDo.length})</h3>
				<TaskList 
					items={this.state.itemsToDo} 
					hightlightIndex={this.state.hightlightIndex} 
					immutable={this.state.immutable} 
					delete={this.removeTask} 
					move={this.moveOutside} 
					toTop={this.toTop} 
					postpone={this.postponeTask} 
					procrastinate={this.procrastinateTask} 
					done={this.doneTask}
					config={this.props.config}
				/>
				<hr />
				<h3>Add new:</h3>
				<form onSubmit={this.handleSubmit}>
					<input value={this.state.task} onChange={this.onChange} />
					<button disabled={this.state.task.trim()===''} >Add task</button>
				</form>
				<hr />
				{ this.props.immutables.map((list) => this.displayLoadButton(list)) }
				<button key='mark' disabled={!this.state.task.trim()===''} onClick={this.mark}>{markTitle}</button>
				<button key='lists' disabled={!this.state.task.trim()===''} onClick={this.handleLists}>Lists</button>
				<hr />
			</div>
		);
	}
});
