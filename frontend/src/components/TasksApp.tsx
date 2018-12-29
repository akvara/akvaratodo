import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose, withProps } from 'recompose';
import _ from 'underscore';

import TasksList from './TasksList';
import TasksDoneList from './TasksDoneList';
import CONFIG from '../config.js';
import * as listActions from '../store/actions/list-actions';
import * as appActions from '../store/actions/app-actions';
import { disableHotKeys, playSound, registerHotKeys } from '../utils/hotkeys';
import * as Utils from '../utils/utils.js';
import { RootState } from '../store/reducers';

class TasksApp extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      listName: props.list.name,
      itemsToDo: JSON.parse(props.list.tasks),
      itemsDone: props.list.done ? JSON.parse(props.list.done) : [],
      prepend: props.prepend,
      highLightIndex: props.prepend ? 0 : null,
      lastAction: props.list.lastAction,
      immutable: props.list.immutable,
      task: '',
      reloadNeeded: false,
      expandToDo: false,
      listNameOnEdit: false,
      expandDone: false,
    };
  }

  componentWillUnmount() {
    disableHotKeys();
  }

  componentDidMount() {
    document.title = 'ToDo lists';
    registerHotKeys(this.checkKeyPressed.bind(this));
  }

  /* cloning State */
  prepareClone() {
    let clone = {};
    clone.lastAction = new Date().toISOString();
    clone.listId = this.props.list._id;
    clone.previousAction = this.state.lastAction;

    return clone;
  }

  serialize(object) {
    let res = {
      listId: object.listId,
      previousAction: object.previousAction,
      listData: {
        lastAction: object.lastAction,
        immutable: !!object.immutable,
      },
    };
    if (object.name) res.listData.name = object.name;
    if (object.itemsToDo) res.listData.tasks = JSON.stringify(object.itemsToDo);
    if (object.itemsDone) res.listData.done = JSON.stringify(object.itemsDone);
    if (object.taskToAdd) res.taskToAdd = object.taskToAdd;
    return res;
  }

  /* Calculations */
  calculatePostponePosition = (number) => Math.floor(number / 2);

  /* Show full/contracted ist */
  expand = (which) => {
    this.setState({
      [which]: !this.state[which],
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
      highlightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
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
      highlightIndex: 0,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Delete done tasks */
  clearDone = () => {
    let dataToSave = this.prepareClone();

    dataToSave.itemsDone = [];

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsDone: dataToSave.itemsDone,
      highlightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Remove task from list */
  removeTask = (i) => {
    let dataToSave = this.prepareClone();

    dataToSave.itemsToDo = Utils.removeItem(this.state.itemsToDo, i);

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task to top position */
  toTop = (i) => {
    let dataToSave = this.prepareClone();

    dataToSave.itemsToDo = Utils.moveToTop(this.state.itemsToDo, i);

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex: 0,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Toggle immutable. No checking if changed */
  mark = () => {
    let dataToSave = this.prepareClone();

    dataToSave.immutable = !this.state.immutable;

    this.setState({
      lastAction: dataToSave.lastAction,
      immutable: dataToSave.immutable,
      highlightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task to another list */
  moveOutside = (task) => {
    let data = {
      fromList: { listId: this.props.list._id, name: this.state.listName },
      task: task,
    };
    this.props.moveOutside(data);
  };

  /* Move task to the end of the list */
  procrastinateTask = (i) => {
    let dataToSave = this.prepareClone();

    dataToSave.itemsToDo = Utils.moveToEnd(this.state.itemsToDo, i);

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex: this.state.itemsToDo.length,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task to the middle of the list */
  postponeTask = (i) => {
    let dataToSave = this.prepareClone();

    dataToSave.itemsToDo = Utils.moveFromTo(
      this.state.itemsToDo,
      i,
      i + this.calculatePostponePosition(this.state.itemsToDo.length),
    );

    let highlightIndex = Math.min(
      this.state.itemsToDo.length - 1,
      i + this.calculatePostponePosition(this.state.itemsToDo.length),
    );

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex: highlightIndex,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Change list name */
  changeListName = (e) => {
    let dataToSave = this.prepareClone();

    dataToSave.name = e.target.value.trim();

    this.setState({
      lastAction: dataToSave.lastAction,
      listName: dataToSave.name,
      listNameOnEdit: false,
      highlightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
    registerHotKeys(this.checkKeyPressed.bind(this));
  };

  /* Go to another list */
  listChanger = (listName) => {
    this.props.addOrOpenAList(listName);
  };

  /* Reload this list*/
  reload = () => {
    this.props.getAList(this.props.list._id);
  };

  /* Mode: List name is on edit */
  editListName = () => {
    this.setState({
      listNameOnEdit: true,
    });
  };

  checkKeyPressed = (e) => {
    let key = String.fromCharCode(e.which);
    if ('alrp<'.indexOf(key) !== -1) playSound();

    switch (String.fromCharCode(e.which)) {
      case 'a':
        e.preventDefault();

        this.taskInput.focus();
        break;
      case 'l':
        e.preventDefault();
        this.props.getListOfLists();
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
        if (this.props.previous_list) this.listChanger(this.props.previous_list.name);
        break;
      default:
        break;
    }
  };

  /* Edit header submit */
  handleHeaderSubmit = (e) => {
    e.preventDefault();
  };

  handleKeyDownAtTask = (e) => {
    if (e.keyCode === 27) {
      this.taskInput.blur();
      this.setState({
        task: '',
      });
    }
  };

  /* Edit header keypress */
  handleKeyDownAtHeader = (e) => {
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        this.changeListName(e);
        break;
      case 'Escape':
        this.setState({ listNameOnEdit: false });
        break;
      default:
        break;
    }
  };

  /* New task submit */
  handleSubmit = (e) => {
    e.preventDefault();
    this.taskInput.blur();

    let dataToSave = this.prepareClone(),
      highlightIndex = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1),
      taskToAdd = this.state.task.replace(/(^\s+|\s+$)/g, '');

    dataToSave.itemsToDo = this.state.itemsToDo;
    dataToSave.itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, taskToAdd);
    dataToSave.itemsToDo = _.unique(dataToSave.itemsToDo);
    dataToSave.taskToAdd = taskToAdd;

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex: highlightIndex,
      task: '',
    });
    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* User input */
  onChange = (e) => {
    this.setState({ task: e.target.value });
  };

  importList = (listId) => {
    let data = {
      firstListId: listId,
      secondListId: this.props.list._id,
    };
    this.props.importList(data);
  };

  exportList = (listId) => {
    let data = {
      listId: this.props.list._id,
      toListId: listId,
    };
    this.props.exportList(data);
  };

  makeListOption = (list) => (
    <option key={'o-' + list._id} value={list._id}>
      {list.name}
    </option>
  );

  /* Select for loading tasks from another list */
  displayImportBlock = () => {
    if (this.state.immutable) return null;

    return (
      <select
        className="import-select"
        onChange={(e) => {
          if (e.target.value) this.importList(e.target.value);
        }}
      >
        <option value="">Import list</option>
        {this.props.immutables.map((list) => this.makeListOption(list))}
      </select>
    );
  };

  /* Select for exporting tasks to another list */
  displayExportBlock = () => {
    if (this.state.immutable) return null;

    return (
      <select
        className="import-select"
        onChange={(e) => {
          if (e.target.value) this.exportList(e.target.value);
        }}
      >
        <option value="">Export to</option>
        {this.props.exportables.map((list) => this.makeListOption(list))}
      </select>
    );
  };

  /* Header - edit mode or not */
  manageHeader = () => {
    if (!this.state.listNameOnEdit)
      return (
        <div>
          <h1>{this.state.listName}</h1>{' '}
          <span
            className={'small action-button glyphicon glyphicon glyphicon-pencil'}
            aria-hidden="true"
            onClick={this.editListName}
          />
        </div>
      );

    return (
      <h1>
        <form onSubmit={this.handleHeaderSubmit}>
          <input
            ref={(input) => {
              this.headerInput = input;
            }}
            className="task-input"
            defaultValue={this.state.listName}
            onFocus={disableHotKeys}
            onKeyDown={this.handleKeyDownAtHeader}
            onBlur={this.changeListName}
          />
        </form>
      </h1>
    );
  };

  render() {
    let markTitle = this.state.immutable ? (
        <span>
          Un<u>p</u>rotect
        </span>
      ) : (
        <span>
          <u>P</u>rotect
        </span>
      ),
      markGlyphicon = this.state.immutable ? 'screen-shot' : 'exclamation-sign',
      expandToDoGlyphicon = this.state.expandToDo ? 'glyphicon-resize-small' : 'glyphicon-resize-full',
      expandDoneGlyphicon = this.state.expandDone ? 'glyphicon-resize-small' : 'glyphicon-resize-full';

    return (
      <div>
        {this.manageHeader()}
        <h3>
          Finished ({this.state.itemsDone.length})
          {Utils.overLength('displayDoneLength', this.state.itemsDone) && (
            <span
              className={'small action-button glyphicon ' + expandDoneGlyphicon}
              aria-hidden="true"
              onClick={this.expand.bind(this, 'expandDone')}
            />
          )}
          {'  '}
          {this.state.itemsDone.length > 0 && (
            <span
              className="small action-button glyphicon glyphicon-trash"
              aria-hidden="true"
              onClick={this.clearDone}
            />
          )}
        </h3>
        <TasksDoneList items={this.state.itemsDone} undone={this.unDoneTask} expand={this.state.expandDone} />
        <hr />
        <h3>
          Remaining ({this.state.itemsToDo.length})
          {Utils.overLength('displayListLength', this.state.itemsToDo) && (
            <span
              className={'small list-item action-button glyphicon ' + expandToDoGlyphicon}
              aria-hidden="true"
              onClick={this.expand.bind(this, 'expandToDo')}
            />
          )}
        </h3>
        <TasksList
          items={this.state.itemsToDo}
          highlightIndex={this.state.highlightIndex}
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

        {!this.state.immutable && (
          <div>
            <hr />
            <h3>Add new:</h3>
            <form onSubmit={this.handleSubmit}>
              <input
                className="task-input"
                ref={(input) => {
                  this.taskInput = input;
                }}
                value={this.state.task}
                onFocus={disableHotKeys.bind(this)}
                onBlur={registerHotKeys.bind(this, this.checkKeyPressed)}
                onKeyDown={this.handleKeyDownAtTask}
                onChange={this.onChange}
              />
              <button disabled={!this.state.task.trim()}>Add task</button>
            </form>
          </div>
        )}
        <hr />
        {this.displayImportBlock()}
        {this.displayExportBlock()}
        <button disabled={this.state.task.trim()} onClick={this.mark}>
          <span className={'glyphicon glyphicon-' + markGlyphicon} aria-hidden="true" /> {markTitle}
        </button>
        <button onClick={this.reload}>
          <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
        </button>
        {this.props.previous_list && (
          <button
            disabled={this.state.task.trim()}
            onClick={this.listChanger.bind(this, this.props.previous_list.name)}
          >
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" /> {this.props.previous_list.name}
          </button>
        )}
        <button disabled={this.state.task.trim()} onClick={this.props.getListOfLists}>
          <span className="glyphicon glyphicon-tasks" aria-hidden="true" /> <u>L</u>ists
        </button>
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  mode: state.app.mode,
  lists: state.app.lists,
  list: state.app.aList,
  task: state.app.task,
  fromList: state.app.fromList,
  immutables: state.app.lists.filter((item) => item.immutable),
  exportables: state.app.lists.filter((item) => item._id !== state.app.aList._id && !item.immutable).slice(0, 20),
  previous_list: state.app.fromList && state.app.aList._id === state.app.fromList.listId ? null : state.app.fromList,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAList: listActions.getAListAction.started,
      getListOfLists: listActions.getListOfListsAction.started,
      checkAndSave: appActions.checkAndSaveAction,
      importList: appActions.importListAction,
      exportList: appActions.exportListAction,
      addOrOpenAList: appActions.addOrOpenListByNameAction,
      moveOutside: appActions.moveInitiationAction,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ listName }) => ({
    listName,
  })),
)(TasksApp);
