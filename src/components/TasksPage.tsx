import * as React from 'react';
import _ from 'underscore';

import TasksList from './TasksList';
import TasksDoneList from './TasksDoneList';
import CONFIG from '../config/config.js';
import { disableHotKeys, playSound, registerHotKeys } from '../utils/hotkeys';
import * as Utils from '../utils/utils.js';
import { ListCreds, SerializedTodoList, TodoList } from '../store/types';
import { appActions } from '../store/actions';
import { dayString } from '../utils/calendar';

export interface TaskPageProps {
  lists: TodoList[];
  aList: TodoList;
  task: string;
  fromList: string;
  immutables: TodoList[];
  exportables: TodoList[];
  previousList: ListCreds;
  reloadAList: typeof appActions.reloadAList;
  startupRequest: typeof appActions.startup;
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
  highlightIndex: number | null;
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
      listName: props.aList.name,
      itemsToDo: JSON.parse(props.aList.tasks),
      itemsDone: props.aList.done ? JSON.parse(props.aList.done) : [],
      prepend: props.prepend,
      highlightIndex: props.prepend ? 0 : null,
      lastAction: props.aList.lastAction,
      immutable: props.aList.immutable,
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

  prepareClone(newProps: any) {
    return {
      lastAction: new Date().toISOString(),
      listId: this.props.aList.id,
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

  readonly calculatePostponePosition = (pos: number) => Math.floor(pos / 2);

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
      highlightIndex: null,
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
      highlightIndex: 0,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  /* Delete done tasks */
  clearDone = () => {
    const dataToSave = this.prepareClone({ itemsDone: [] });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsDone: dataToSave.itemsDone,
      highlightIndex: null,
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
      highlightIndex: null,
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
      highlightIndex: 0,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  mark = () => {
    const dataToSave = this.prepareClone({ immutable: !this.state.immutable });

    this.setState({
      lastAction: dataToSave.lastAction,
      immutable: dataToSave.immutable,
      highlightIndex: null,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  moveOutside = (task: string) => {
    const data = {
      fromList: { listId: this.props.aList.id, name: this.state.listName },
      task,
    };
    this.props.moveOutside(data);
  };

  readonly procrastinateTask = (fromPos: number) => {
    const itemsToDo = Utils.moveToEnd(this.state.itemsToDo, fromPos);

    const dataToSave = this.prepareClone({ itemsToDo });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex: this.state.itemsToDo.length,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  readonly postponeTask = (fromPos: number) => {
    const itemsToDo = Utils.moveFromTo(
      this.state.itemsToDo,
      fromPos,
      fromPos + this.calculatePostponePosition(this.state.itemsToDo.length),
    );
    const dataToSave = this.prepareClone({ itemsToDo });

    const highlightIndex = Math.min(
      this.state.itemsToDo.length - 1,
      fromPos + this.calculatePostponePosition(this.state.itemsToDo.length),
    );

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex,
    });

    this.props.checkAndSave(this.serialize(dataToSave));
  };

  readonly changeListName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataToSave = this.prepareClone({ name: e.target.value.trim() });

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
  listChanger = (listName: string) => {
    this.props.addOrOpenAList({ listName });
  };

  reload = () => {
    this.props.reloadAList(this.props.aList.id);
  };

  goToday = () => {
    this.props.addOrOpenAList({ listName: dayString(new Date()) });
  };

  goLists = () => {
    this.props.startupRequest();
  };

  goPrevious = () => {
    this.listChanger(this.props.previousList.name);
  };

  editListName = () => {
    this.setState({
      listNameOnEdit: true,
    });
  };

  checkKeyPressed = (e) => {
    switch (String.fromCharCode(e.which)) {
      case 'a':
        playSound();
        e.preventDefault();
        // @ts-ignore
        this.taskInput.focus();
        break;
      case 'l':
        playSound();
        this.goLists();
        break;
      case 'r':
        playSound();
        this.reload();
        break;
      case 'p':
        playSound();
        this.mark();
        break;
      case 't':
        playSound();
        this.goToday();
        break;
      case '<':
        if (this.props.previousList.listId) {
          playSound();
          this.goPrevious();
        }
        break;
      default:
        break;
    }
  };

  handleHeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  handleKeyDownAtTask = (e: React.KeyboardEvent) => {
    if (e.keyCode === 27) {
      // @ts-ignore
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
    // @ts-ignore
    this.taskInput.blur();

    const highlightIndex = Math.min(this.state.itemsToDo.length, CONFIG.user.settings.addNewAt - 1);
    const taskToAdd = this.state.task.replace(/(^\s+|\s+$)/g, '');
    let itemsToDo = this.state.itemsToDo;
    itemsToDo.splice(CONFIG.user.settings.addNewAt - 1, 0, taskToAdd);
    itemsToDo = _.unique(itemsToDo);
    const dataToSave = this.prepareClone({ itemsToDo, taskToAdd });

    this.setState({
      lastAction: dataToSave.lastAction,
      itemsToDo: dataToSave.itemsToDo,
      highlightIndex,
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
      toListId: this.props.aList.id,
    });
  };

  exportList = (listId: string) => {
    this.props.exportList({
      fromListId: this.props.aList.id,
      toListId: listId,
    });
  };

  makeListOption = (list: TodoList) => (
    <option key={'o-' + list.id} value={list.id}>
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
        className="rounded-button import-select"
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
        className="rounded-button import-select"
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
              // @ts-ignore
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
    const inputDirty = !!this.state.task.trim();
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
            <form onSubmit={this.handleSubmit} className="input-row">
              <input
                className="input"
                ref={(input) => {
                  // @ts-ignore
                  this.taskInput = input;
                }}
                value={this.state.task}
                onFocus={disableHotKeys}
                onBlur={() => registerHotKeys(this.checkKeyPressed)}
                onKeyDown={this.handleKeyDownAtTask}
                onChange={this.onChange}
              />
              <button className="rounded-button" disabled={!this.state.task.trim()}>
                Add task
              </button>
            </form>
          </div>
        )}
        <hr />
        <div className="actions-row">
          {this.displayImportBlock()}
          {this.displayExportBlock()}
        </div>
        <br />
        <div className="actions-row">
          <button className="rounded-button" disabled={inputDirty} onClick={this.reload}>
            <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
          </button>
          <button className="rounded-button" disabled={inputDirty} onClick={this.mark}>
            <span className={'glyphicon glyphicon-' + markGlyphicon} aria-hidden="true" /> {markTitle}
          </button>
          <button className="rounded-button" disabled={inputDirty} onClick={this.goLists}>
            <span className="glyphicon glyphicon-tasks" aria-hidden="true" /> <u>L</u>ists
          </button>
          <button className="rounded-button" disabled={inputDirty} onClick={this.goToday}>
            <span className="glyphicon glyphicon-subscript" aria-hidden="true" /> <u>T</u>oday
          </button>
          {this.props.previousList && this.props.previousList.listId && (
            <button className="rounded-button" disabled={inputDirty} onClick={this.goPrevious}>
              <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" /> {this.props.previousList.name}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default TasksPage;
