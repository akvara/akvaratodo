import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';
import _ from 'underscore';

import TasksList from './TasksList';
import TasksDoneList from './TasksDoneList';
import CONFIG from '../config.js';
import * as listActions from '../store/actions/list-actions';
import * as appActions from '../store/actions/app-actions';
import { disableHotKeys, playSound, registerHotKeys } from '../utils/hotkeys';
import * as Utils from '../utils/utils.js';
import { RootState } from '../store/reducers';
import { SerializedTodoList, TodoList } from '../store/types';

export interface TaskPageProps {
  lists: TodoList[];
  list: TodoList;
  task: string;
  fromList: string;
  immutables: TodoList[];
  exportables: TodoList[];
  previousList: string;
  getAList: typeof listActions.getAListAction.started;
  getListOfLists: typeof listActions.getListOfListsAction.started;
  checkAndSave: typeof appActions.checkAndSaveAction;
  importList: typeof appActions.importListAction;
  exportList: typeof appActions.exportListAction;
  addOrOpenAList: typeof appActions.addOrOpenListByNameAction;
  moveOutside: typeof appActions.moveInitiationAction;
}

interface TasksPageState {
  listName: string;
  itemsToDo: string[];
  itemsDone: string[];
  prepend: boolean;
  highLightIndex: number | null;
  lastAction: string;
  immutable: boolean;
  task: string;
  reloadNeeded: boolean;
  expandToDo: boolean;
  listNameOnEdit: boolean;
  expandDone: boolean;
}

class TasksPage extends React.PureComponent<TaskPageProps, TasksPageState> {
  constructor(props: any) {
    super(props);
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
      listNameOnEdit: false,
      expandToDo: false,
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
  prepareClone(newProps: any) {
    return {
      lastAction: new Date().toISOString(),
      listId: this.props.list._id,
      previousAction: this.state.lastAction,
      ...newProps,
    };
  }

  serialize(entity: SerializedTodoList) {
    const res: SerializedTodoList = {
      listId: entity.listId,
      previousAction: entity.previousAction,
      listData: {
        lastAction: entity.lastAction,
        immutable: !!entity.immutable,
      },
    };
    if (entity.name) {
      res.listData.name = entity.name;
    }
    if (entity.itemsToDo) {
      res.listData.tasks = JSON.stringify(entity.itemsToDo);
    }
    if (entity.itemsDone) {
      res.listData.done = JSON.stringify(entity.itemsDone);
    }
    if (entity.taskToAdd) {
      res.taskToAdd = entity.taskToAdd;
    }
    return res;
  }

  /* Calculations */
  readonly calculatePostponePosition = (pos: number) => Math.floor(pos / 2);

  /* Show full/contracted ist */
  readonly expand = (which: 'expandToDo' | 'expandDone') => {
    this.setState({
      [which]: !this.state[which],
    } as any);
  };

  /* Move task to Done tasks array */
  doneTask = (fromPos: number) => {
    const moved = Utils.moveToAnother(this.state.itemsToDo, this.state.itemsDone, fromPos, false);
    const itemsToDo = moved.A;
    const itemsDone = moved.B;
    const dataToSave = this.prepareClone({ itemsToDo, itemsDone });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      itemsDone: dataToSave.itemsDone,
      highLightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task back from Done tasks array */
  unDoneTask = (atPos: number) => {
    const moved = Utils.moveToAnother(this.state.itemsDone, this.state.itemsToDo, atPos, true);
    const dataToSave = this.prepareClone({ itemsToDo: moved.B, itemsDone: moved.A });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      itemsDone: dataToSave.itemsDone,
      highLightIndex: 0,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Delete done tasks */
  clearDone = () => {
    const dataToSave = this.prepareClone({ itemsDone: [] });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsDone: dataToSave.itemsDone,
      highLightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Remove task from list */
  removeTask = (atPos: number) => {
    const itemsToDo = Utils.removeItem(this.state.itemsToDo, atPos);
    const dataToSave = this.prepareClone({ itemsToDo });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highLightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task to top position */
  toTop = (fromPos: number) => {
    const itemsToDo = Utils.moveToTop(this.state.itemsToDo, fromPos);
    const dataToSave = this.prepareClone({ itemsToDo });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highLightIndex: 0,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Toggle immutable. No checking if changed */
  mark = () => {
    const dataToSave = this.prepareClone({ immutable: !this.state.immutable });

    this.setState({
      lastAction: dataToSave.lastAction,
      immutable: dataToSave.immutable,
      highLightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task to another list */
  moveOutside = (task: string) => {
    const data = {
      fromList: { listId: this.props.list._id, name: this.state.listName },
      task,
    };
    this.props.moveOutside(data);
  };

  /* Move task to the end of the list */
  readonly procrastinateTask = (fromPos: number) => {
    const itemsToDo = Utils.moveToEnd(this.state.itemsToDo, fromPos);

    const dataToSave = this.prepareClone({ itemsToDo });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highLightIndex: this.state.itemsToDo.length,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Move task to the middle of the list */
  readonly postponeTask = (fromPos: number) => {
    const itemsToDo = Utils.moveFromTo(
      this.state.itemsToDo,
      fromPos,
      fromPos + this.calculatePostponePosition(this.state.itemsToDo.length),
    );
    const dataToSave = this.prepareClone({ itemsToDo });

    const highLightIndex = Math.min(
      this.state.itemsToDo.length - 1,
      fromPos + this.calculatePostponePosition(this.state.itemsToDo.length),
    );

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highLightIndex,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Change list name */
  readonly changeListName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataToSave = this.prepareClone({ name: e.target.value.trim() });

    this.setState({
      lastAction: dataToSave.lastAction,
      listName: dataToSave.name,
      listNameOnEdit: false,
      highLightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
    registerHotKeys(this.checkKeyPressed.bind(this));
  };

  /* Go to another list */
  listChanger = (listName: string) => {
    this.props.addOrOpenAList({ listName });
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
    const key = String.fromCharCode(e.which);
    if ('alrp<'.indexOf(key) !== -1) {
      playSound();
    }

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
        if (this.props.previousList) {
          this.listChanger(this.props.previousList.name);
        }
        break;
      default:
        break;
    }
  };

  /* Edit header submit */
  handleHeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  handleKeyDownAtTask = (e: React.KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.taskInput.blur();
      this.setState({
        task: '',
      });
    }
  };

  /* Edit header keypress */
  handleKeyDownAtHeader = (e: React.KeyboardEvent) => {
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
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.taskInput.blur();

    const highLightIndex = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1);
    const taskToAdd = this.state.task.replace(/(^\s+|\s+$)/g, '');
    const itemsToDo = _.unique(this.state.itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, taskToAdd));
    const dataToSave = this.prepareClone({ itemsToDo, taskToAdd });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highLightIndex,
      task: '',
    });
    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* User input */
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ task: e.target.value });
  };

  importList = (listId: string) => {
    this.props.importList({
      fromListId: listId,
      toListId: this.props.list._id,
    });
  };

  exportList = (listId: string) => {
    this.props.exportList({
      fromListId: this.props.list._id,
      toListId: listId,
    });
  };

  makeListOption = (list: TodoList) => (
    <option key={'o-' + list._id} value={list._id}>
      {list.name}
    </option>
  );

  /* Select for loading tasks from another list */
  displayImportBlock = () => {
    if (this.state.immutable) {
      return null;
    }

    return (
      <select
        className="import-select"
        onChange={(e) => {
          if (e.target.value) {
            this.importList(e.target.value);
          }
        }}
      >
        <option value="">Import list</option>
        {this.props.immutables.map((list) => this.makeListOption(list))}
      </select>
    );
  };

  /* Select for exporting tasks to another list */
  displayExportBlock = () => {
    if (this.state.immutable) {
      return null;
    }

    return (
      <select
        className="import-select"
        onChange={(e) => {
          if (e.target.value) {
            this.exportList(e.target.value);
          }
        }}
      >
        <option value="">Export to</option>
        {this.props.exportables.map((list) => this.makeListOption(list))}
      </select>
    );
  };

  /* Header - edit mode or not */
  manageHeader = () => {
    if (!this.state.listNameOnEdit) {
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
    }

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
    const markTitle = this.state.immutable ? (
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
          highLightIndex={this.state.highLightIndex}
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
                onFocus={disableHotKeys}
                onBlur={() => registerHotKeys(this.checkKeyPressed)}
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
        <button disabled={!!this.state.task.trim()} onClick={this.mark}>
          <span className={'glyphicon glyphicon-' + markGlyphicon} aria-hidden="true" /> {markTitle}
        </button>
        <button onClick={this.reload}>
          <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
        </button>
        {this.props.previousList && (
          <button
            disabled={!!this.state.task.trim()}
            onClick={this.listChanger.bind(this, this.props.previousList.name)}
          >
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" /> {this.props.previousList.name}
          </button>
        )}
        <button disabled={!!this.state.task.trim()} onClick={() => this.props.getListOfLists}>
          <span className="glyphicon glyphicon-tasks" aria-hidden="true" /> <u>L</u>ists
        </button>
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  lists: state.app.lists,
  list: state.app.aList,
  task: state.app.task,
  fromList: state.app.fromList,
  immutables: state.app.lists.filter((item) => item.immutable),
  exportables: state.app.lists.filter((item) => item._id !== state.app.aList._id && !item.immutable).slice(0, 20),
  previousList: state.app.fromList && state.app.aList._id === state.app.fromList.listId ? null : state.app.fromList,
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
)(TasksPage);
