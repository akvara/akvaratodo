import React, { Component } from 'react';
import TasksDoneList from './TasksDoneList';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {playSound} from '../utils/hotkeys';
import * as listActions from '../actions/list-actions';
import * as Utils from '../utils/utils.js';
import $ from 'jquery';

class TasksApp extends Component {
    static propTypes = {
        list: PropTypes.object.isRequired,
        previousList: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
console.log('TasksApp constructed. this.props.list:', this.props.list);
        this.immutables = props.immutables || [];

        this.state = {
            listName: this.props.list.name,
            itemsToDo: [],
            itemsDone: [],
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

    /* Go to list of lists */
    openLists = () => {
        this.props.dispatch(listActions.getListOfLists());
    }

    /* Move task back from Done tasks array */
    unDoneTask = (i) => {

    }

    /* Disable hot keys */
    disableHotKeys = () => {
        $(document).off("keypress");
    }

    /* Toggle immutable. No checking if changed */
    mark = () => {
        // ToDo : this is data saving
        // this.setState({ notYetLoaded: true });
        // var dataToSave = this.prepareClone();
        // dataToSave.immutable = !this.state.immutable;
        // let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        // this.saveTaskList(this.props.list.id, dataToSave, callback);
    }

    /* Reload this list*/
    reload = () => {
        // console.log('this.props.list:', this.props.list);
        this.props.dispatch(this.props.actions.getAList(this.props.list._id));
    }

    /* Mode: List name is on edit */
    editListName = () => {
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
                this.setState({listNameOnEdit: false});
                break;
            default:
                break;
        }
    }

    checkKeyPressed = (e) => {
        console.log('checkKeyPressed in TasksApp');
        var key = String.fromCharCode(e.which)
        if ('alrp<'.indexOf(key) !== -1) playSound()

        switch(String.fromCharCode(e.which))
        {
            case 'a':
                e.preventDefault();
                this.nameInput.focus();
                break;
            case 'l':
                e.preventDefault();
                this.openLists();
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
    }


    /* Edit header submit */
    handleNameSubmit = (e) => {
        e.preventDefault();
    }

    /* Header - edit mode or not */
    manageHeader() {
        if (!this.state.listNameOnEdit)
            return <div>
                <h1>{this.state.listName}</h1>
            {' '}{' '}
            <span className={"small action-button glyphicon glyphicon glyphicon-pencil"} aria-hidden="true"  onClick={this.editListName}></span>
        </div>

        return <h1>
            <form onSubmit={this.handleNameSubmit}>
                <input
                    className="task-input"
                    defaultValue={this.state.listName}
                    onFocus={this.disableHotKeys}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.saveEditedHeader}
                />
            </form>
        </h1>
    }

    /* Save new header to DB */
    saveEditedHeader = (e) => {
        // ToDo : this is data saving
        // var dataToSave = this.prepareClone();
        // let callback = this.callbackForSettingState.bind(this, null, dataToSave);
        // dataToSave.list.name = e.target.value;
        // this.checkWrapper(dataToSave, callback);
        this.registerHotKeys();
    }

    /* The Renderer */
    render() {

        let markTitle = this.state.immutable ? <span>Un<u>p</u>rotect</span> : <span><u>P</u>rotect</span>,
            markGlyphicon = this.state.immutable ? 'screen-shot' : 'exclamation-sign',

            expandDoneGlyphicon = this.state.expandDone ? "glyphicon-resize-small" : "glyphicon-resize-full";

        return (
            <div>
                { this.manageHeader() }
                <h3>
                    Finished ({this.state.itemsDone.length})
                    {Utils.overLength("displayDoneLength", this.state.itemsDone) &&
                        <span className={"small action-button glyphicon " + expandDoneGlyphicon} aria-hidden="true" onClick={this.expand.bind(this, 'expandDone')}></span>
                    }
                    {'  '}
                    {this.state.itemsDone.length > 0 &&
                        <span className="small action-button glyphicon glyphicon-trash" aria-hidden="true" onClick={this.clearDone.bind(this)}></span>
                    }
                </h3>
                <TasksDoneList
                    items={this.state.itemsDone}
                    undone={this.unDoneTask}
                    expand={this.state.expandDone}
                />
                <hr />



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
                <button disabled={this.state.task.trim()} onClick={this.openLists}>
                    <span className="glyphicon glyphicon-tasks" aria-hidden="true"></span> <u>L</u>ists
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: listActions,
        dispatch
    };
};

export default connect(
    null,
    mapDispatchToProps
)(TasksApp);
