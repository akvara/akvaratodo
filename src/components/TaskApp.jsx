import React  from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';
import _ from 'underscore';
import Loadable from './Loadable';
import LoadingDecorator from './LoadingDecorator';
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
			immutables: props.immutables || [],
			immutable: false,
			task: '',
			notYetLoaded: true
	    };
	}

    componentWillMount() {
        this.loadData();
    }

    componentDidMount() {
// console.log('TaskApp Did Mount', Session.get('someVar'));
    }

    componentWillUnmount() {
// console.log('TaskApp Did Un');
    }

    loadData() {
        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, this.props.listId)}
                callback={this.loadAListCallback.bind(this)}
                actionMessage='Loading list'
                finishedMessage='Loaded.'
            />, this.loaderNode
        );
    }

  	goToLists() {
    	ReactDOM.render(<ListApp itemsDone={this.state.itemsDone}/>, this.appNode);
  	}

	mark() {
		this.setState({
			immutable: !this.state.immutable
		}, this.saveTaskList);
	}

    onChange (e) {
		this.setState({ task: e.target.value });
	}

	handleSubmit(e) {
 		e.preventDefault();
 		let highlightPosition = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1);
 		this.state.itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
		this.setState({
			itemsToDo: _.unique(this.state.itemsToDo),
			hightlightIndex: highlightPosition,
			task: ''
		}, this.saveTaskList.bind(this));
	}

    removeTask(i) {
		this.setState({
			itemsToDo: Utils.removeItem(this.state.itemsToDo, i),
			hightlightIndex: null,
		},
		this.saveTaskList.bind(this))
	}

    moveOutside(i) {
		ReactDOM.render(<Move state={this.state} itemIndex={i} fromList={this.state.listId}/>, this.appNode);
	}

	postponeBy(){
		return Math.floor(this.state.itemsToDo.length / 2)
	}

	highlightPosition(i) {
		return  Math.min(
			this.state.itemsToDo.length - 1,
			i + this.postponeBy(),
		// 	CONFIG.user.settings.displayListLength
		// ) + (this.state.itemsToDo.length >= CONFIG.user.settings.displayListLength ? 1 : 0);
		)
	}

    postponeTask(i) {
console.log('postponeBy', this.postponeBy());
console.log('i', i);
console.log('to', i + this.postponeBy());
    	let items = Utils.moveFromTo(this.state.itemsToDo, i, i + this.postponeBy())
		this.setState({
			itemsToDo: items ,
			hightlightIndex: Math.min(this.state.itemsToDo.length - 1, i + this.postponeBy())
		}, this.saveTaskList);
	}

	doneTask(i) {
		var moved = Utils.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false)
		this.setState({
			hightlightIndex: null,
			itemsToDo: moved.A,
			itemsDone: moved.B
		}, this.saveTaskList);
	}

	unDoneTask(i) {
		var moved = Utils.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true)
		this.setState({
			itemsToDo: moved.B,
			itemsDone: moved.A,
			hightlightIndex: 0
		}, this.saveTaskList);
	}

	procrastinateTask(i) {
		let items = Utils.moveToEnd(this.state.itemsToDo, i);
		this.setState({
			itemsToDo: items,
			hightlightIndex: this.state.itemsToDo.length
		}, this.saveTaskList);
	}

	toTop(i) {
		console.log(this.state);
		let items = Utils.moveToTop(this.state.itemsToDo, i);
		this.setState({
			itemsToDo: items,
			hightlightIndex: 0
		}, this.saveTaskList);
	}

	loadFromAnother(listId) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, listId)}
                callback={this.loadAForeignListCallback.bind(this)}
                actionMessage='Loading a list'
            />, this.loaderNode
        );
	}

  	displayLoadFromButton(item) {
  		if (this.state.immutable) return null;

  		return <button key={'btn'+item._id} onClick={this.loadFromAnother.bind(this, item._id)} >
  			Load from <span className={'glyphicon glyphicon-upload'} aria-hidden="true"></span> <i>{ item.name }</i>
  		</button>
  	}

	render() {
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

		var markTitle = 'Protect';
		var markGlyphicon = 'exclamation-sign';
		if (this.state.immutable)  {
			markTitle = 'Unprotect';
			markGlyphicon = 'screen-shot';
		}

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
						<input className="task-input" value={this.state.task} onChange={this.onChange.bind(this)} />
						<button disabled={!this.state.task.trim()}>Add task</button>
					</form>
					</div>
				}
				<hr />
				{ this.props.immutables.map((list) => this.displayLoadFromButton(list)) }
				<button disabled={this.state.task.trim()} onClick={this.mark.bind(this)}>
					<span className={'glyphicon glyphicon-' + markGlyphicon} aria-hidden="true"></span> {markTitle}
				</button>
				<button disabled={this.state.task.trim()} onClick={this.goToLists.bind(this)}>
					<span className="glyphicon glyphicon-tasks" aria-hidden="true"></span> Lists
				</button>
				<hr />
			</div>
		);
	}
}

export default TaskApp;
