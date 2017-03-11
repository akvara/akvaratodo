import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import config from '../config.js';
import _ from 'underscore';
import $ from 'jquery';
import LoadingDecorator from './LoadingDecorator';
import Messenger from './Messenger';
import Move from './Move';
import ListApp from './ListApp';
import TaskList from './TaskList';
import TaskDoneList from './TaskDoneList';

class TaskApp extends Component {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
	    	uri: config.apiHost + config.listsAddon + "/" + props.listId,
			itemsToDo: [], 
			itemsDone: props.itemsDone || [],
			prepend: props.prepend,
			hightlightIndex: null,
			immutable: false,
			task: '',
			notYetLoaded: true
	    };
	    this.loaderNode = document.getElementById('loading');
	}

    componentWillMount() {
console.log('Task App Will Mount');
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
console.log('Task App Did Un');
    }

    loadData() {
        ReactDOM.render(
            <LoadingDecorator 
                request={this.loadListRequest.bind(this)} 
                callback={this.loadListCallback.bind(this)} 
                action='Loading ToDo lists' 
            />, this.loaderNode
        );
    }

    loadListRequest(resolve, reject) {
        return $.get(this.state.uri)
            .done((data) => { resolve(data) })
            .fail((err) => { reject(err) });
    }

    loadListCallback(data) { 
          let itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];

            if (this.state.prepend) {
                itemsToDo = [this.state.prepend].concat(itemsToDo);
            }

            this.setState({
                listName: data.name, 
                immutable: data.immutable,
                itemsToDo: itemsToDo,
                prepend: null,
                notYetLoaded: false,
            }, this.state.prepend ? this.save : null)

        ReactDOM.render(<Messenger info="Loaded." />, this.loaderNode);    
    }

	saveRequest(resolve, reject) {
		return $.ajax({
			url: this.state.uri,
			type: 'PUT',
			data: { 
				tasks: JSON.stringify(this.state.itemsToDo),
				immutable: this.state.immutable
			}
		})
		.done((data) => { resolve(data) })
        .fail((err) => { reject(err) });
	}

	saveCallback() {
	    ReactDOM.render(<Messenger info="Saved." />, this.loaderNode);    
	}

	save() {
// console.log('save kvietėte?', this.state.itemsToDo);		
		ReactDOM.render(
            <LoadingDecorator 
                request={this.saveRequest.bind(this)} 
                callback={this.saveCallback.bind(this)} 
                action='Saving' 
            />, this.loaderNode
        );
	}

	mark() {
		this.setState({
			immutable: !this.state.immutable
		}, this.save);
	}

    onChange (e) {
		this.setState({ task: e.target.value });
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

	// Helper functions

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

		loadFake() {
		this.setState({
			listName: 'Test', 
			itemsToDo: Array.from(Array(config.displayListLength+1)).map((e,i)=>(i).toString()),
			prepend: null
		});
	}

	textToArray(text) {
		return text.split(/\r?\n/).filter(entry => entry.trim() !== '')
	}

	handleLists() {
    	ReactDOM.render(<ListApp itemsDone={this.state.itemsDone}/>, document.getElementById("app"));
  	}

  	displayLoadButton(item) {
  		// var listName = item.name;
  		// var id = item._id;
console.log('displayLoadButton item', item);
  		// return <button onClick={this.loadAnoter.bind(this, id)} >Load from { listName }</button>
  		return "aha";
  	}

	render() {
		var today = new Date().toISOString().slice(0, 10);
		if (this.state.notYetLoaded) {
			return (
				<div>
					<h1>{this.state.listName} {today}</h1>
					<div id="l"></div>
				</div>
			);
		}

		var markTitle = 'Mark immutable';
		if (this.state.immutable) 
			markTitle = 'Unmark immutable';

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
				{!this.state.immutable &&
					<div>
					<hr />
					<h3>Add new:</h3>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<input value={this.state.task} onChange={this.onChange.bind(this)} />
						<button disabled={!this.state.task.trim()}>Add task</button>
					</form>
					</div>
				}
				<hr />
				<button onClick={this.mark.bind(this)}>{markTitle}</button>
				<button onClick={this.handleLists.bind(this)}>Lists</button>
				<hr />
			</div>
		);
	}
}

export default TaskApp;
