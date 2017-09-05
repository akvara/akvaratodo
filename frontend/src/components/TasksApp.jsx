import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TasksList from './TasksList';
import TasksDoneList from './TasksDoneList';
import CONFIG from '../config.js';
import {getAList, getListOfLists, addOrOpenAList, checkAndSave, prependToAList} from '../actions/list-actions';
import {playSound} from '../utils/hotkeys';
import {bindActionToPromise} from '../utils/redux-form';
import * as Utils from '../utils/utils.js';
import _ from 'underscore';

class TasksApp extends Component {

    static propTypes = {
        list: PropTypes.object.isRequired,
        previousList: PropTypes.object,
    };

    constructor(props, context) {
        super(props, context);

console.log('TasksApp constructed. this.props.list:', props.list);

        this.immutables = props.immutables || [];

        this.state = {
            listName: props.list.name,
            itemsToDo: JSON.parse(this.props.list.tasks),
            itemsDone: this.props.list.done ? JSON.parse(this.props.list.done) : [],
            prepend: props.prepend,
            highLightIndex: props.prepend ? 0 : null,
            lastAction: props.list.lastAction,
            immutable: props.list.immutable,
            task: '',
            reloadNeeded: false,
            expandToDo: false,
            listNameOnEdit: false,
            expandDone: false
        };
    }

    componentWillUnmount() {
        Utils.disableHotKeys();
    }

    componentDidMount() {
        document.title = "ToDo lists";
        Utils.registerHotKeys(this.checkKeyPressed);
    }

    /* cloning State */
    prepareClone() {
        let clone = {};
        clone.lastAction = new Date().toISOString();
        clone.listId = this.props.list._id;
        clone.previousAction = this.state.lastAction;

        return clone;
    }

    /* */
    serialize(object) {
        let res = {
                listId: object.listId,
                previousAction: object.previousAction,
                listData: {
                    lastAction: object.lastAction,
                    immutable: object.immutable
                }
            };
        if (object.name) res.listData.name = object.name;
        if (object.itemsToDo) res.listData.tasks = JSON.stringify(object.itemsToDo);
        if (object.itemsDone) res.listData.done = JSON.stringify(object.itemsDone);
        console.log(" ___________ ", res);
        return res;
    }
    
    /* Calculations */
    calculatePostponePosition = (number) => (Math.floor(number / 2));
    
    /* Show full/contracted ist */
    expand = (which) => {
        this.setState({
            [which]: !this.state[which]
        });
    };

    /* Move task to Done tasks array */
    doneTask = (i) => {
        let dataToSave = this.prepareClone(),
            moved = Utils.moveToAnother(this.state.itemsToDo, this.state.itemsDone, i, false);

        dataToSave.itemsToDo = moved.A;
        dataToSave.itemsDone = moved.B;

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            itemsDone: dataToSave.itemsDone,
            hightlightIndex: null
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Move task back from Done tasks array */
    unDoneTask = (i) => {
        let dataToSave = this.prepareClone(),
            moved = Utils.moveToAnother(this.state.itemsDone, this.state.itemsToDo, i, true);

        dataToSave.itemsToDo = moved.B;
        dataToSave.itemsDone = moved.A;

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            itemsDone: dataToSave.itemsDone,
            hightlightIndex: 0
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Delete done tasks */
    clearDone = () => {
        let dataToSave = this.prepareClone();

        dataToSave.itemsDone = [];

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsDone: dataToSave.itemsDone,
            hightlightIndex: null
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Remove task from list */
    removeTask = (i) => {
        let dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.removeItem(this.state.itemsToDo, i);

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            hightlightIndex: null
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Move task to top position */
    toTop = (i) => {
        let dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.moveToTop(this.state.itemsToDo, i);

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            hightlightIndex: 0
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Toggle immutable. No checking if changed */
    mark = () => {
        let dataToSave = this.prepareClone();

        dataToSave.immutable = !this.state.immutable;

        this.setState({
            lastAction: dataToSave.lastAction,
            immutable: dataToSave.immutable,
            hightlightIndex: null
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    moveOutside(i) {
        console.log("moveOutside", i);
    }


    procrastinateTask = (i) => {
        let dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.moveToEnd(this.state.itemsToDo, i);

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            hightlightIndex: this.state.itemsToDo.length
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Move task to the middle of the list */
    postponeTask = (i) => {
        let dataToSave = this.prepareClone();

        dataToSave.itemsToDo = Utils.moveFromTo(
            this.state.itemsToDo, 
            i, 
            i + this.calculatePostponePosition(this.state.itemsToDo.length)
        );

        let hightlightIndex = Math.min(
            this.state.itemsToDo.length - 1, 
            i + this.calculatePostponePosition(this.state.itemsToDo.length)
        );

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            hightlightIndex: hightlightIndex
        });

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Change list name */
    changeListName = (e) => {
        let dataToSave = this.prepareClone();

        dataToSave.listName = e.target.value;

        this.setState({
            lastAction: dataToSave.lastAction,
            listName: dataToSave.listName,
            hightlightIndex: null
        });

        console.log("changeListName", e);
        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* Go to another list */
    listChanger = (listName) => {
        this.props.actions.addOrOpenAList(listName);
    };

    /* Reload this list*/
    reload = () => {
        this.props.actions.getAList(this.props.list._id);
    };

    /* Mode: List name is on edit */
    editListName = () => {
        this.setState({
            listNameOnEdit: true
        });
    };

    /* Edit header keypress */
    onKeyDown =(e) => {
        console.log("onKeyDown(e):", e);
        switch(e.key) {
            case 'Enter':
            case 'Tab':
                this.changeListName(e);
                break;
            case 'Escape':
                this.setState({listNameOnEdit: false});
                break;
            default:
                break;
        }
    };

    checkKeyPressed = (e) => {
        let key = String.fromCharCode(e.which);
        if ('alrp<'.indexOf(key) !== -1) playSound();

        switch(String.fromCharCode(e.which))
        {
            case 'a':
                e.preventDefault();
                this.nameInput.focus();
                break;
            case 'l':
                e.preventDefault();
                this.props.actions.getListOfLists();
                break;
            case 'r':
                e.preventDefault();
                this.reload();
                break;
            case 'p':
                e.preventDefault();
                this.mark();
                break;
            case '<':
                e.preventDefault();
                if (this.props.previousList) this.listChanger();
                break;
            default:
                break;
        }
    };

    /* Edit header submit */
    handleNameSubmit = (e) => {
        e.preventDefault();
    };

    /* New task submit */
    handleSubmit = (e) => {
        e.preventDefault();

        let dataToSave = this.prepareClone(),
            hightlightIndex = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1);

        dataToSave.itemsToDo = this.state.itemsToDo;
        dataToSave.itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));
        dataToSave.itemsToDo = _.unique(dataToSave.itemsToDo);

        this.setState({
            lastAction: dataToSave.lastAction,
            itemsToDo: dataToSave.itemsToDo,
            hightlightIndex: hightlightIndex,
            task: ''
        });
        Utils.registerHotKeys();

        this.props.actions.checkAndSave(this.serialize(dataToSave));
    };

    /* User input */
    onChange = (e) => {
        this.setState({ task: e.target.value });
    };

    prependAnotherList = (listId) => {
        console.log("Load " + listId);
        let data = {
            listId: this.props.list._id,
            prepend: ["aha, šitą"]
        };
        this.props.actions.prependToAList(data);

    };

    /* Button for loading tasks from another list */
    displayLoadFromButton = (item) => {
        if (this.state.immutable) return null;

        return (
            <button key={'btn'+item._id}
                    disabled={this.state.reloadNeeded || this.state.task.trim()}
                    onClick={this.prependAnotherList.bind(this, item._id)} >
                <span className={'glyphicon glyphicon-upload'} aria-hidden="true">
                </span> <i>{ item.name }</i>
            </button>
        );
    };

    /* Header - edit mode or not */
    manageHeader = () => {
        if (!this.state.listNameOnEdit) return (
            <div>
                <h1>{this.state.listName}</h1>
                {' '}{' '}
                <span className={"small action-button glyphicon glyphicon glyphicon-pencil"}
                      aria-hidden="true"
                      onClick={this.editListName}>
                </span>
            </div>
        );

        return (
            <h1>
                <form onSubmit={this.handleNameSubmit}>
                    <input
                        className="task-input"
                        defaultValue={this.state.listName}
                        onFocus={Utils.disableHotKeys}
                        onKeyDown={this.onKeyDown}
                        onBlur={this.changeListName}
                    />
                </form>
            </h1>
        );
    };

    /* The Renderer */
    render() {
        let markTitle = this.state.immutable ? <span>Un<u>p</u>rotect</span> : <span><u>P</u>rotect</span>,
            markGlyphicon = this.state.immutable ? 'screen-shot' : 'exclamation-sign',
            expandToDoGlyphicon = this.state.expandToDo ? "glyphicon-resize-small" : "glyphicon-resize-full",
            expandDoneGlyphicon = this.state.expandDone ? "glyphicon-resize-small" : "glyphicon-resize-full";

        return (
            <div>
                { this.manageHeader() }
                <h3>
                    Finished ({this.state.itemsDone.length})
                    {Utils.overLength("displayDoneLength", this.state.itemsDone) &&
                        <span className={"small action-button glyphicon " + expandDoneGlyphicon}
                              aria-hidden="true"
                              onClick={this.expand.bind('expandDone')}>
                        </span>
                    }
                    {'  '}
                    {this.state.itemsDone.length > 0 &&
                        <span className="small action-button glyphicon glyphicon-trash"
                              aria-hidden="true"
                              onClick={this.clearDone.bind(this)}>
                        </span>
                    }
                </h3>
                <TasksDoneList
                    items={this.state.itemsDone}
                    undone={this.unDoneTask}
                    expand={this.state.expandDone}
                />
                <hr />
                <h3>
                    Remaining ({this.state.itemsToDo.length})
                    {Utils.overLength("displayListLength", this.state.itemsToDo) &&
                        <span className={"small list-item action-button glyphicon " + expandToDoGlyphicon}
                              aria-hidden="true"
                              onClick={this.expand.bind('expandToDo')}>
                        </span>
                    }
                </h3>
                <TasksList
                    items={this.state.itemsToDo}
                    hightlightIndex={this.state.hightlightIndex}
                    immutable={this.state.immutable}
                    delete={this.removeTask}
                    move={this.moveOutside}
                    toTop={this.toTop}
                    postpone={this.postponeTask}
                    procrastinate={this.procrastinateTask}
                    openListByName={this.listChanger}
                    reloadNeeded={this.state.reloadNeeded}
                    done={this.doneTask}
                    expand={this.state.expandToDo}
                />

                {!this.state.immutable &&
                    <div>
                    <hr />
                    <h3>Add new:</h3>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            className="task-input"
                            ref={(input) => { this.nameInput = input; }}
                            onFocus={Utils.disableHotKeys.bind(this)}
                            onBlur={Utils.registerHotKeys.bind(this, this.checkKeyPressed)}
                            value={this.state.task}
                            onChange={this.onChange}
                        />
                        <button disabled={!this.state.task.trim()}>Add task</button>
                    </form>
                    </div>
                }
                <hr />
                {this.props.immutables.map((list) => this.displayLoadFromButton(list)) }
                <br />
                <button disabled={this.state.task.trim()} onClick={this.mark}>
                    <span className={'glyphicon glyphicon-' + markGlyphicon}
                          aria-hidden="true">
                    </span> {markTitle}
                </button>
                <button onClick={this.reload}>
                    <span className={'glyphicon glyphicon-refresh'}
                          aria-hidden="true">
                    </span> <u>R</u>eload
                </button>
                {this.props.previousList &&
                    <button disabled={this.state.task.trim()} onClick={this.listChanger}>
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true">
                        </span> {this.props.previousList.name}
                    </button>
                }
                <button disabled={this.state.task.trim()} onClick={this.props.actions.getListOfLists}>
                    <span className="glyphicon glyphicon-tasks" aria-hidden="true">
                    </span> <u>L</u>ists
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            getAList: bindActionToPromise(dispatch, getAList),
            getListOfLists: bindActionToPromise(dispatch, getListOfLists),
            checkAndSave: bindActionToPromise(dispatch, checkAndSave),
            addOrOpenAList: bindActionToPromise(dispatch, addOrOpenAList),
            prependToAList: bindActionToPromise(dispatch, prependToAList),
        }
    }
};

export default connect(
    null,
    mapDispatchToProps
)(TasksApp);
