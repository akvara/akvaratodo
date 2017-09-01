import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TasksList from './TasksList';
import TasksDoneList from './TasksDoneList';
import {getAList, getListOfLists} from '../actions/list-actions';
import * as Utils from '../utils/utils.js';
import {playSound} from '../utils/hotkeys';
import {bindActionToPromise} from '../utils/redux-form';

class TasksApp extends Component {

    static propTypes = {
        list: PropTypes.object.isRequired,
        previousList: PropTypes.object
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
            hightlightIndex: props.prepend ? 0 : null,
            immutable: false,
            task: '',
            // notYetLoaded: true,
            // reloadNeeded: false,
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
    
    /* Show full/contracted ist */
    expand = (which) => {
        this.setState({
            [which]: !this.state[which]
        });
    };

    /* Delete done tasks */
    clearDone =() => {
        // ToDo : this is data saving

        // var dataToSave = this.prepareClone();
        // dataToSave.itemsDone = [];
        // let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        // this.saveTaskList(this.props.list.id, dataToSave, callback);
    };


    /* Move task back from Done tasks array */
    unDoneTask = (i) => {

    };

    /* Toggle immutable. No checking if changed */
    mark = () => {
        // ToDo : this is data saving
        // this.setState({ notYetLoaded: true });
        // var dataToSave = this.prepareClone();
        // dataToSave.immutable = !this.state.immutable;
        // let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        // this.saveTaskList(this.props.list.id, dataToSave, callback);
    };

    /* Reload this list*/
    reload = () => {
        // console.log('this.props.list:', this.props.list);
        this.props.actions.getAList(this.props.list._id);
    };

    /* Mode: List name is on edit */
    editListName = () => {
        this.setState({
            listNameOnEdit: true
        });
    };

    /* Edit header keypress */
    onKeyDown(e) {
        switch(e.key) {
            case 'Enter':
            case 'Tab':
                this.saveEditedHeader(e);
                break;
            case 'Escape':
                this.setState({listNameOnEdit: false});
                break;
            default:
                break;
        }
    }

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
                        onBlur={this.saveEditedHeader}
                    />
                </form>
            </h1>
        );
    };

    /* Save new header to DB */
    saveEditedHeader = (e) => {
        // ToDo : this is data saving
        // var dataToSave = this.prepareClone();
        // let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        // dataToSave.list.name = e.target.value;
        // this.checkWrapper(dataToSave, callback);
        Utils.registerHotKeys(this.checkKeyPressed);
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
                    openListByName={this.openListByName}
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
                            onFocus={Utils.disableHotKeys}
                            onBlur={Utils.registerHotKeys(this.checkKeyPressed)}
                            value={this.state.task}
                            onChange={this.onChange}
                        />
                        <button disabled={!this.state.task.trim()}>Add task</button>
                    </form>
                    </div>
                }
                <hr />
                [Load From Select Button]
                <button disabled={this.state.task.trim()} onClick={this.mark}>
                    <span className={'glyphicon glyphicon-' + markGlyphicon} aria-hidden="true"></span> {markTitle}
                </button>
                <button onClick={this.reload}>
                    <span className={'glyphicon glyphicon-refresh'} aria-hidden="true"></span> <u>R</u>eload
                </button>
                {this.props.previousList &&
                    <button disabled={this.state.task.trim()} onClick={this.listChanger}>
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> {this.props.previousList.name}
                    </button>
                }
                <button disabled={this.state.task.trim()} onClick={this.props.actions.getListOfLists}>
                    <span className="glyphicon glyphicon-tasks" aria-hidden="true"></span> <u>L</u>ists
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
        }
    }
};

export default connect(
    null,
    mapDispatchToProps
)(TasksApp);
