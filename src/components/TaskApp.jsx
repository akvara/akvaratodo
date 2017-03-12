import React  from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';
import _ from 'underscore';
import $ from 'jquery';
import Loadable from './Loadable';
import LoadingDecorator from './LoadingDecorator';
import Messenger from './Messenger';
import Move from './Move';
import ListApp from './ListApp';
import TaskList from './TaskList';
import TaskDoneList from './TaskDoneList';
import * as Utils from '../utils/utils.js';

class TaskApp extends Loadable {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
			itemsToDo: [],
			itemsDone: props.itemsDone || [],
			prepend: props.prepend,
			hightlightIndex: props.prepend ? 0 : null,
			// immutables: props.immutables || [],
			immutable: false,
			task: '',
			notYetLoaded: true
	    };
	}

    componentDidMount() {
console.log('TaskApp Did Mount');
    }

    componentWillUnmount() {
console.log('TaskApp Did Un');
    }

    loadData() {
        document.title = this.props.listName;

        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, this.props.listId)}
                callback={this.loadAListCallback.bind(this)}
                action='Loading ToDo lists'
            />, this.loaderNode
        );
    }

  	goToLists() {
    	ReactDOM.render(<ListApp itemsDone={this.state.itemsDone}/>, this.appNode);
  	}

	saveTask() {
		ReactDOM.render(
            <LoadingDecorator
                request={this.saveTaskRequest.bind(this, this.props.listId)}
                callback={this.saveTaskCallback.bind(this)}
                action='Saving'
            />, this.loaderNode
        );
	}

	saveTaskRequest(listId, resolve, reject) {
		return $.ajax({
			url: CONFIG.apiHost + CONFIG.listsAddon + "/" + listId,
			type: 'PUT',
			data: {
				tasks: JSON.stringify(this.state.itemsToDo),
				immutable: this.state.immutable,
				hightlightIndex: this.state.hightlightIndex,
                updated_at: new Date()
			}
		})
		.done((data) => { resolve(data) })
        .fail((err) => { reject(err) });
	}

	saveTaskCallback() {
	    ReactDOM.render(<Messenger info="Saved." />, this.loaderNode);
	}

	mark() {
		this.setState({
			immutable: !this.state.immutable
		}, this.saveTask);
	}

    onChange (e) {
		this.setState({ task: e.target.value });
	}

	handleSubmit(e) {
 		e.preventDefault();
 		let highlightPosition = Math.min(this.state.itemsToDo.length, CONFIG.addNewAt - 1);
 		this.state.itemsToDo.splice(CONFIG.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
		this.setState({
			itemsToDo: _.unique(this.state.itemsToDo),
			hightlightIndex: highlightPosition,
			task: ''
		}, this.saveTask.bind(this));
	}

    removeTask(i, callback) {
 		this.state.itemsToDo.splice(i, 1);
		this.setState({
			itemsToDo: this.state.itemsToDo,
			hightlightIndex: null,
		}, function (callback) {
			this.saveTask();
			if (callback) callback()
		}.bind(this, callback));
	}

    moveOutside(i) {
 		var removed = this.state.itemsToDo[i];
 		this.removeTask(i, function(removed) {
			ReactDOM.unmountComponentAtNode(this.loaderNode);
			ReactDOM.render(<Move item={removed} itemsDone={this.state.itemsDone}/>, this.appNode);
 		}.bind(this, removed));
	}

	highlightPosition(i) {
		return  Math.min(
			this.state.itemsToDo.length - 1,
			CONFIG.postponeBy - 1,
			CONFIG.displayListLength
		) + (this.state.itemsToDo.length >= CONFIG.displayListLength ? 1 : 0);
	}

    postponeTask(i) {
    	let items = Utils.moveFromTo(this.state.itemsToDo, i, i + CONFIG.postponeBy)
		this.setState({
			itemsToDo: items ,
			hightlightIndex: this.highlightPosition(i),
		}, this.saveTask);
	}

	doneTask(i) {
		var moved = Utils.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false)
		this.setState({
			itemsToDo: moved.A,
			itemsDone: moved.B
		}, this.saveTask);
	}

	unDoneTask(i) {
		var moved = Utils.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true)
		this.setState({
			itemsToDo: moved.B,
			itemsDone: moved.A,
			hightlightIndex: 0
		}, this.saveTask);
	}

	procrastinateTask(i) {
		let items = Utils.moveToEnd(this.state.itemsToDo, i);
		this.setState({
			itemsToDo: items,
			hightlightIndex: this.state.itemsToDo.length
		}, this.saveTask);
	}

	toTop(i) {
		console.log(this.state);
		let items = Utils.moveToTop(this.state.itemsToDo, i);
		this.setState({
			itemsToDo: items,
			hightlightIndex: 0
		}, this.saveTask);
	}

	loadFromAnother(listId) {
		// ReactDOM.unmountComponentAtNode(this.loaderNode);
        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, listId)}
                callback={this.loadAForeignListCallback.bind(this)}
                action='Loading a list'
            />, this.loaderNode
        );
	}

  	displayFromButton (item) {
  		return <button key={'btn'+item._id} onClick={this.loadFromAnother.bind(this, item._id)} >Load from <i>{ item.name }</i></button>
  	}

	render() {
		// var today = new Date().toISOString().slice(0, 10);
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

		var markTitle = 'Mark immutable';
		if (this.state.immutable)
			markTitle = 'Unmark immutable';

		return (
			<div>
				<h1>{this.state.listName}</h1>
				<h3>Finished ({this.state.itemsDone.length})</h3>
				<TaskDoneList items={this.state.itemsDone} undone={this.unDoneTask.bind(this)} />
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
				{ this.props.immutables.map((list) => this.displayFromButton(list)) }
				<button disabled={this.state.task.trim()} onClick={this.mark.bind(this)}>{markTitle}</button>
				<button disabled={this.state.task.trim()} onClick={this.goToLists.bind(this)}>Lists</button>
				<hr />
			</div>
		);
	}
}

export default TaskApp;
