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

        // this.list = props.list; //????
        this.immutables = props.immutables || [];

        // this.list = props.list;

	    this.state = {
			itemsToDo: [],
			itemsDone: props.itemsDone || [],
			prepend: props.prepend,
			hightlightIndex: props.prepend ? 0 : null,
			immutable: false,
			task: '',
			notYetLoaded: true
	    };
	}

    /* Load A List */
    loadData() {
        document.title = this.props.list.name;
        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, this.props.list.id)}
                callback={this.loadAListCallback.bind(this)}
                actionMessage='Loading list'
                finishedMessage='Loaded.'
            />, this.loaderNode
        );
    }

    /* Render list of TaskLists */
  	goToLists() {
    	ReactDOM.render(<ListApp itemsDone={this.state.itemsDone}/>, this.appNode);
  	}

    /* User input */
    onChange (e) {
		this.setState({ task: e.target.value });
	}

    /* User submit */
	handleSubmit(e) {
 		e.preventDefault();

        var dataToSave = this.prepareClone();
        dataToSave.itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
        dataToSave.itemsToDo = _.unique(dataToSave.itemsToDo);

        let highlightPosition = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1);
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Remove task at i */
    removeTask(i) {
        var dataToSave = this.prepareClone();
        dataToSave.itemsToDo = Utils.removeItem(this.state.itemsToDo, i);

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Move task to another list */
    moveOutside(i) {
		ReactDOM.render(<Move fromList={this.props.list} itemIndex={i} state={this.state} />, this.appNode);
	}

    /* Calculations */
	postponeBy(){
		return Math.floor(this.state.itemsToDo.length / 2)
	}

	/* Move task down by 1/2 length */
    postponeTask(i) {
        var dataToSave = this.prepareClone();
        dataToSave.itemsToDo = Utils.moveFromTo(this.state.itemsToDo, i, i + this.postponeBy())

        let highlightPosition = Math.min(this.state.itemsToDo.length - 1, i + this.postponeBy());
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);

console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Move task to Done tasks array */
	doneTask(i) {
        var dataToSave = this.prepareClone();
        var moved = Utils.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false)

        dataToSave.itemsToDo = moved.A;
        dataToSave.itemsDone = moved.B;

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Move task back from Done tasks array */
	unDoneTask(i) {
        var dataToSave = this.prepareClone();
        var moved = Utils.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true)

        dataToSave.itemsToDo = moved.B;
        dataToSave.itemsDone = moved.A;

        let highlightPosition = 0;
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Move task to bottom */
	procrastinateTask(i) {
        var dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.moveToEnd(this.state.itemsToDo, i);

        let highlightPosition = this.state.itemsToDo.length;
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Move task to bottom */
    toTop(i) {
        var dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.moveToTop(this.state.itemsToDo, i);

        let highlightPosition = 0;
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
	}

    /* Toggle immutable. No checking if changed */
    mark() {
        var dataToSave = this.prepareClone();
        dataToSave.immutable = !this.state.immutable;

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        this.saveTaskList(this.props.list.id, dataToSave, callback);
    }

	loadAnotherList(listId) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, listId)}
                callback={this.loadAForeignListCallback.bind(this)}
                actionMessage='Loading a list'
            />, this.loaderNode
        );
	}

    loadAForeignListCallback(data) {
        var dataToSave = this.prepareClone();
        let loadedItems = data.tasks ? JSON.parse(data.tasks) : [];
        dataToSave.itemsToDo = _.unique(loadedItems.concat(this.state.itemsToDo));

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        console.log('this.state', this.state);
        this.checkIfSame(this.props.list.id, this.state.lastAction, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
    }

    /* Button for loading tasks from another list */
  	displayLoadFromButton(item) {
  		if (this.state.immutable) return null;

  		return <button key={'btn'+item._id} onClick={this.loadAnotherList.bind(this, item._id)} >
  			Load from <span className={'glyphicon glyphicon-upload'} aria-hidden="true"></span> <i>{ item.name }</i>
  		</button>
  	}

    /* The Renderer */
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
				<h1>{this.props.list.name}</h1>
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
