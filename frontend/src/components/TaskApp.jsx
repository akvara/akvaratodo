import React  from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';
import _ from 'underscore';
import Loadable from './Loadable';
import LoadingDecorator from './LoadingDecorator';
import ListChanger from './ListChanger';
import Move from './Move';
import App from './App';
import ListApp from './ListApp';
import TaskList from './TaskList';
import TaskDoneList from './TaskDoneList';
import * as Utils from '../utils/utils.js';

class TaskApp extends Loadable {
	constructor(props, context) {
	    super(props, context);

        this.immutables = props.immutables || [];

	    this.state = {
            listName: this.props.list.name,
			itemsToDo: [],
			itemsDone: [],
			prepend: props.prepend,
			hightlightIndex: props.prepend ? 0 : null,
			immutable: false,
			task: '',
            notYetLoaded: true,
			reloadNeeded: false,
            expandToDo: false,
            listNameOnEdit: false,
            expandDone: false
	    };
	}

    checkKeyPressed(e) {
// console.log('e.which:', e.which, String.fromCharCode(e.which));
        var key = String.fromCharCode(e.which)
        if ('alrp<'.indexOf(key) !== -1) this.playSound()

        switch(String.fromCharCode(e.which))
        {
            case 'a':
                e.preventDefault();
                this.nameInput.focus();
                break;
            case 'l':
                e.preventDefault();
                this.openLists.call(this);
                break;
            case 'r':
                e.preventDefault();
                this.reload.call(this);
                break;
            case 'p':
                e.preventDefault();
                this.mark.call(this);
                break;
            case '<':
                e.preventDefault();
                if (this.props.previousList) this.listChanger.call(this);
                break;
            default:
                break;
        }
    }

    componentWillUnmount() {
        this.disableHotKeys();
    }

    componentDidMount() {
        this.registerHotKeys();
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
    openLists() {
        ReactDOM.render(<ListApp action='open'/>, this.appNode);
    }

    /* Render a ListChanger */
  	listChanger() {
    	ReactDOM.render(<ListChanger
            toList={this.props.previousList}
            previousList={this.props.list}
            immutables={this.immutables}
            />, this.appNode
        );
  	}

    /* User input */
    onChange (e) {
		this.setState({ task: e.target.value });
	}

    /* New task submit */
    handleSubmit(e) {
        e.preventDefault();
        this.setState({ notYetLoaded: true });

        var dataToSave = this.prepareClone();
        dataToSave.itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
        dataToSave.itemsToDo = _.unique(dataToSave.itemsToDo);

        let highlightPosition = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1);
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);
        this.checkWrapper(dataToSave, callback);
        this.registerHotKeys();
    }

    /* Edit header submit */
    handleNameSubmit(e) {
        e.preventDefault();
    }

    /* Remove task at i */
    removeTask(i) {
        this.setState({ notYetLoaded: true });
        var dataToSave = this.prepareClone();
        dataToSave.itemsToDo = Utils.removeItem(this.state.itemsToDo, i);

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);

        this.checkWrapper(dataToSave, callback);
	}

    /* Move task to another list */
    moveOutside(i) {
        ReactDOM.render(<Move fromList={this.props.list} itemIndex={i} state={this.state} />, this.appNode);
    }

    /* Show full/contracted ist */
    expand(which) {
		this.setState({
            [which]: !this.state[which]
        });
	}

    /* Calculations */
	postponeBy(){
		return Math.floor(this.state.itemsToDo.length / 2);
	}

	/* Move task down by 1/2 length */
    postponeTask(i) {
        this.setState({ notYetLoaded: true });
        var dataToSave = this.prepareClone();
        dataToSave.itemsToDo = Utils.moveFromTo(this.state.itemsToDo, i, i + this.postponeBy())

        let highlightPosition = Math.min(this.state.itemsToDo.length - 1, i + this.postponeBy());
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);

        this.checkWrapper(dataToSave, callback);
	}

    /* Move task to Done tasks array */
	doneTask(i) {
        this.setState({ notYetLoaded: true });
        var dataToSave = this.prepareClone();
        var moved = Utils.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false)

        dataToSave.itemsToDo = moved.A;
        dataToSave.itemsDone = moved.B;

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);

        this.checkWrapper(dataToSave, callback);
	}

    /* Move task back from Done tasks array */
	unDoneTask(i) {
        this.setState({ notYetLoaded: true });
        var dataToSave = this.prepareClone();
        var moved = Utils.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true)

        dataToSave.itemsToDo = moved.B;
        dataToSave.itemsDone = moved.A;

        let highlightPosition = 0;
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);

        this.checkWrapper(dataToSave, callback);
	}

    /* Move task to bottom */
	procrastinateTask(i) {
        var dataToSave = this.prepareClone();
        this.setState({ notYetLoaded: true });

        dataToSave.itemsToDo = Utils.moveToEnd(this.state.itemsToDo, i);

        let highlightPosition = this.state.itemsToDo.length;
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);

        this.checkWrapper(dataToSave, callback);
	}

    /* Move task to bottom */
    toTop(i) {
        var dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.moveToTop(this.state.itemsToDo, i);

        let highlightPosition = 0;
        let callback = this.callbackForSettingState.bind(this, highlightPosition, dataToSave);

        this.checkWrapper(dataToSave, callback);
	}

    /* Toggle immutable. No checking if changed */
    mark() {
        this.setState({ notYetLoaded: true });
        var dataToSave = this.prepareClone();
        dataToSave.immutable = !this.state.immutable;

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        this.saveTaskList(this.props.list.id, dataToSave, callback);
    }

    /* Guess */
    clearDone() {
        var dataToSave = this.prepareClone();
        dataToSave.itemsDone = [];

        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        this.saveTaskList(this.props.list.id, dataToSave, callback);
    }

    openListByName(name) {
        ReactDOM.render(
            <App
                openAtStartup={name}
            />, this.appNode
        );
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

        this.checkWrapper(dataToSave, callback);
    }

    /* Button for loading tasks from another list */
  	displayLoadFromButton(item) {
  		if (this.state.immutable) return null;

  		return <button key={'btn'+item._id} disabled={this.state.reloadNeeded || this.state.task.trim()} onClick={this.loadAnotherList.bind(this, item._id)} >
  			<span className={'glyphicon glyphicon-upload'} aria-hidden="true"></span> <i>{ item.name }</i>
  		</button>
  	}

    /* Mode: List name is on edit */
    editListName() {
        this.setState({
            listNameOnEdit: true
        });
    }

    /* Edit header keypress */
    onKeyDown(e) {
        switch(e.key) {
            case 'Enter':
            case 'Tab':
                this.saveEditedHeader(e);
                break;
            case 'Escape':
                this.setState({ listNameOnEdit: false });
                break;
            default:
                break;
        }
    }

    /* Save new header to DB */
    saveEditedHeader(e) {
        var dataToSave = this.prepareClone();
        let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        dataToSave.list.name = e.target.value;
        this.checkWrapper(dataToSave, callback);
        this.registerHotKeys();
    }

    manageHeader() {
        if (!this.state.listNameOnEdit)
            return <div>
                <h1>{this.state.listName}</h1>
            &nbsp;&nbsp;
            <span className={"small action-button glyphicon glyphicon glyphicon-pencil"} aria-hidden="true"  onClick={this.editListName.bind(this)}></span>
        </div>

        return <h1>
            <form onSubmit={this.handleNameSubmit.bind(this)}>
                <input
                    className="task-input"
                    defaultValue={this.state.listName}
                    onFocus={this.disableHotKeys.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)}
                    onBlur={this.saveEditedHeader.bind(this)}
                />
            </form>
        </h1>
    }

    /* Reload this list*/
    reload() {
        this.setState({ notYetLoaded: true });
        this.loadData();
    }

    /* The Renderer */
	render() {
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

        var markTitle = <span><u>P</u>rotect</span>;
        var markGlyphicon = 'exclamation-sign';
        if (this.state.immutable)  {
            markTitle = <span>Un<u>p</u>rotect</span>;
            markGlyphicon = 'screen-shot';
        }

        var expandToDoGlyphicon = "glyphicon-resize-full";
        if (this.state.expandToDo) expandToDoGlyphicon = "glyphicon-resize-small";

        var expandDoneGlyphicon = "glyphicon-resize-full";
		if (this.state.expandDone) expandDoneGlyphicon = "glyphicon-resize-small";

        return (
			<div>
				{ this.manageHeader() }
				<h3>
                    Finished ({this.state.itemsDone.length})
                    {Utils.overLength("displayDoneLength", this.state.itemsDone) &&
                        <span className={"small action-button glyphicon " + expandDoneGlyphicon} aria-hidden="true" onClick={this.expand.bind(this, 'expandDone')}></span>
                    }
                    &nbsp; &nbsp;
                    {this.state.itemsDone.length > 0 &&
                        <span className="small action-button glyphicon glyphicon-trash" aria-hidden="true" onClick={this.clearDone.bind(this)}></span>
                    }
                </h3>
				<TaskDoneList
                    items={this.state.itemsDone}
                    undone={this.unDoneTask.bind(this)}
                    expand={this.state.expandDone}
                />
				<hr />
				<h3>
                    Remaining ({this.state.itemsToDo.length})
                    {Utils.overLength("displayListLength", this.state.itemsToDo) &&
                        <span className={"small list-item action-button glyphicon " + expandToDoGlyphicon} aria-hidden="true" onClick={this.expand.bind(this, 'expandToDo')}></span>
                    }
                </h3>
				<TaskList
					items={this.state.itemsToDo}
					hightlightIndex={this.state.hightlightIndex}
					immutable={this.state.immutable}
					delete={this.removeTask.bind(this)}
					move={this.moveOutside.bind(this)}
					toTop={this.toTop.bind(this)}
					postpone={this.postponeTask.bind(this)}
                    procrastinate={this.procrastinateTask.bind(this)}
					openListByName={this.openListByName.bind(this)}
                    reloadNeeded={this.state.reloadNeeded}
					done={this.doneTask.bind(this)}
                    expand={this.state.expandToDo}
				/>
				{!this.state.immutable &&
					<div>
					<hr />
					<h3>Add new:</h3>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<input
                            ref={(input) => { this.nameInput = input; }}
                            onFocus={this.disableHotKeys.bind(this)}
                            onBlur={this.registerHotKeys.bind(this)}
                            className="task-input"
                            value={this.state.task}
                            onChange={this.onChange.bind(this)}
                        />
						<button disabled={!this.state.task.trim() || this.state.notYetLoaded }>Add task</button>
					</form>
					</div>
				}
				<hr />
				{this.props.immutables.map((list) => this.displayLoadFromButton(list)) }
                <button disabled={this.state.task.trim() || this.state.reloadNeeded} onClick={this.mark.bind(this)}>
                    <span className={'glyphicon glyphicon-' + markGlyphicon} aria-hidden="true"></span> {markTitle}
                </button>
                <button onClick={this.reload.bind(this)}>
                    <span className={'glyphicon glyphicon-refresh'} aria-hidden="true"></span> <u>R</u>eload
                </button>
                {this.props.previousList &&
                    <button disabled={this.state.task.trim()} onClick={this.listChanger.bind(this)}>
    					<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> {this.props.previousList.name}
    				</button>
                }
                <button disabled={this.state.task.trim()} onClick={this.openLists.bind(this)}>
                    <span className="glyphicon glyphicon-tasks" aria-hidden="true"></span> <u>L</u>ists
                </button>
			</div>
		);
	}
}

export default TaskApp;
