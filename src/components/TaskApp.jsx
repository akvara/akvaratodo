import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import config from './config.js';
import _ from 'underscore';
import $ from 'jquery';
import Move from './Move';
import ListApp from './ListApp';
import TaskList from './TaskList';
import TaskDoneList from './TaskDoneList';

class TaskApp extends Component {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
			uri: config.listsapi + "lists/" + props.listId,
			listsUri: config.listsapi + "lists/",
			itemsToDo: [], 
			itemsDone: props.itemsDone || [],
			prepend: props.prepend,
			hightlightIndex: null,
			listName: [],
			immutable: false,
			task: '',
			loaded: false,
			loadingDots: ''
	    };
	}

	handleSubmit(e) {
 		e.preventDefault();

 		this.state.itemsToDo.splice(config.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
		this.setState({ 
			itemsToDo: _.unique(this.state.itemsToDo),
			hightlightIndex: Math.min(this.state.itemsToDo.length, config.addNewAt - 1),
			task: ''
		}, this.save.bind(this));
	}

    removeTask(i, callback) {
 		this.state.itemsToDo.splice(i, 1);
		this.setState({ 
			itemsToDo: this.state.itemsToDo,
			hightlightIndex: null,
		}, function (callback) { 
			this.save();
			if (callback) callback();
		}.bind(this, callback));
	}

    moveOutside(i) {
 		var removed = this.state.itemsToDo[i];
 		this.removeTask(i, function(removed) {
			ReactDOM.render(<Move config={config} item={removed} itemsDone={this.state.itemsDone}/>, document.getElementById("app"));
 		}.bind(this, removed));
	}

	highlightPosition (i) {
		return  Math.min(
			this.state.itemsToDo.length - 1, 
			config.postponeBy - 1, 
			config.displayFirst
		) + (this.state.itemsToDo.length >= config.displayFirst ? 1 : 0);
	}

    postponeTask(i) {
    	let items = this.moveFromTo(this.state.itemsToDo, i, i + config.postponeBy)
		this.setState({ 
			itemsToDo: items ,
			hightlightIndex: this.highlightPosition(i),
		}, this.save);
	}

	doneTask(i) {
		var moved = this.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false)
		this.setState({ 
			itemsToDo: moved.A, 
			itemsDone: moved.B
		}, this.save);
	}

	unDoneTask(i) {
		var moved = this.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true)
		this.setState({ 
			itemsToDo: moved.B, 
			itemsDone: moved.A,
			hightlightIndex: 0
		}, this.save);
	}	

	procrastinateTask(i) {
		let items = this.moveToEnd(this.state.itemsToDo, i);
		this.setState({ 
			itemsToDo: items,
			hightlightIndex: this.state.itemsToDo.length
		}, this.save);
	}

	toTop(i) {
		console.log(this.state);
		let items = this.moveToTop(this.state.itemsToDo, i);
		this.setState({ 
			itemsToDo: items,
			hightlightIndex: 0
		}, this.save);
	}

	onChange (e) {
		this.setState({ task: e.target.value });
	}

	moveToAnother(fromA, toB, i, toTop) {
  		let trans = fromA[i];
  		fromA.splice(i, 1);
  		if (toTop) {
	  		toB = [trans].concat(toB);	
	  	} else {
	  		toB = toB.concat([trans]);
	  	}

  		return {A: fromA, B: toB};
	}

	moveToEnd(items, i) {
  		let trans = items[i];
  		items.splice(i, 1);

  		return items.concat([trans]);
	}

	moveToTop(items, i) {
  		let trans = items[i];
  		items.splice(i, 1);

  		return [trans].concat(items);
	}

	moveFromTo(arrayA, from, to) {
  		let trans = arrayA[from];
		arrayA.splice(from, 1); 
		arrayA.splice(to, 0, trans);

  		return arrayA;
	}

	loadAnoter(listId) {

		$.get(this.state.listsUri + listId)
		.done(function(data, textStatus, jqXHR) {
			this.setState({ 
				itemsToDo:  _.unique(JSON.parse(data.tasks).concat(this.state.itemsToDo))
			}, this.save);
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
	}	

	loadDaily() {
		this.readFromFile('daily', true);
	}	

	loadPostponed() {
		this.readFromFile('postponed', true);
	}	

	saveBackup(items) {
		$.cookie(config.cookieTodo, JSON.stringify(items));	
	}

	clear() {
		$.cookie(config.cookieTodo, '');
	}

	save() {
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
	}

	mark() {
		this.setState({
			immutable: !this.state.immutable
		}, this.save);
	}

	loadFake() {
		this.setState({
			listName: 'Test', 
			itemsToDo: Array.from(Array(config.displayListLength+1)).map((e,i)=>(i).toString()),
			prepend: null
		});
	}

	tick() {
		if (this.state.loadingDots.length > 40) {
			this.setState({loadingDots: '.'});
		}
		else {
			this.setState({loadingDots: this.state.loadingDots + '.'});
		}
	}

	loadData() {
		this.interval = setInterval(this.tick.bind(this, this.loadingDots), 100);

		$.get(this.state.uri)
		.done((data, textStatus, jqXHR) => {
			let itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];

			if (this.state.prepend) {
				itemsToDo = [this.state.prepend].concat(itemsToDo);
			}

			this.setState({
				listName: data.name, 
				immutable: data.immutable,
				itemsToDo: itemsToDo,
				prepend: null,
				loaded: true,
				loadingDots: '',
			}, this.state.prepend ? this.save : null)
		})
		.fail((jqXHR, textStatus, errorThrown) => {
        	console.log(textStatus);			
        	this.setState({ 
				loadingString: ' error'
			})
        })
        .always(() => clearInterval(this.interval));
	}

	loadDataFromCookies() {
		let backupData = $.cookie(config.cookieTodo);

		if (backupData) {
			console.log('Loading from backup');
			this.setState({
				itemsToDo: JSON.parse(backupData)
			})
		} else {
			this.readFromFile('daily', true);
			this.readFromFile('postponed', false);
		}
	}

	getFileContents(fileName) {
		console.log("Loading " + fileName + "...");
		return this.request('GET', fileName + '.txt', './' + fileName + '.txt?<?php echo time(); ?>');
	}

	request(method, resource, url) {
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
	}

	textToArray(text) {
		return text.split(/\r?\n/).filter(entry => entry.trim() !== '')
	}

	readFromFile(fileName, comesFirst) {
	    this.getFileContents(fileName)
		.then(function (result) {
			var items;
			if (comesFirst) {
				items = _.unique(this.textToArray(result).concat(this.state.itemsToDo))
			}
			else {
				items = _.unique(this.state.itemsToDo.concat(this.textToArray(result)))
			}
			this.setState({	itemsToDo: items });
			this.save(items);
			console.log(fileName + " loaded.");
		}.bind(this))
		.catch(err => {
		    console.log("File load error:", err);
		});
	}

	handleLists() {
    	ReactDOM.render(<ListApp itemsDone={this.state.itemsDone}/>, document.getElementById("app"));
  	}

	componentWillMount() {
    	this.loadData();
    	// this.loadFake();
  	}

  	displayLoadButton(item) {
  		var listName = item.name;
  		var id = item._id;
console.log('displayLoadButton item', item);
  		// return <button onClick={this.loadAnoter.bind(this, id)} >Load from { listName }</button>
  		return "aha";
  	}

	render() {
		var today = new Date().toISOString().slice(0, 10);
		if (!this.state.loaded)	{
			return (
				<div>
					<h1>{this.state.listName} {today}</h1>
					Loading {this.state.loadingDots}
				</div>
			);
		}	
		var markTitle = 'Mark immutable';
		if (this.state.immutable) 
			markTitle = 'Unmark immutable';
console.log('this.props.immutables', this.props.immutables);

		return (
			<div>
				<h1>{this.state.listName} {today}</h1>
				<h3>Finished ({this.state.itemsDone.length})</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask} />
				<hr />
				<h3>Remaining ({this.state.itemsToDo.length})</h3>
				<TaskList 
					items={this.state.itemsToDo} 
					hightlightIndex={this.state.hightlightIndex} 
					immutable={this.state.immutable} 
					delete={this.removeTask.bind(this)} 
					move={this.moveOutside.bind(this)} 
					toTop={this.toTop.bind(this)} 
					postpone={this.postponeTask.bind(this)} 
					procrastinate={this.procrastinateTask.bind(this)} 
					done={this.doneTask.bind(this)}
				/>
				<hr />
				<h3>Add new:</h3>
				<form onSubmit={this.handleSubmit.bind(this)}>
					<input value={this.state.task} onChange={this.onChange.bind(this)} />
					<button disabled={!this.state.task.trim()}>Add task</button>
				</form>
				<hr />
				

				
				{ ['a', 'b'].map((list) => this.displayLoadButton) }
				<button onClick={this.mark.bind(this)}>{markTitle}</button>
				<button onClick={this.handleLists.bind(this)}>Lists</button>
				<hr />
			</div>
		);
	}
}

export default TaskApp;
