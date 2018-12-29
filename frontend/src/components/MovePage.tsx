import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect, Dispatch } from 'react-redux';

import CONFIG from '../config.js';
import {
  copyOrMoveToNewListAction,
  getAListAction,
  moveToListAction,
  prependToAListAction,
} from '../store/actions/list-actions';
import { RootState } from '../store/reducers';
import { ListCreds, TodoList } from '../core/types';

export interface MoveProps {
  task: string;
  lists: TodoList[];
  fromList: ListCreds;
  getAList: typeof getAListAction.started;
  moveToList: typeof moveToListAction;
  copyOrMoveToNew: typeof copyOrMoveToNewListAction;
  prependToAList: typeof prependToAListAction;
}

class MovePage extends Component {
  constructor(props: MoveProps) {
    super(props);
    console.log('lll', props);

    this.state = {
      newListName: '',
      movingItem: props.task,
    };
  }

  /* Returns back to the same list with no changes */
  back = () => {
    this.props.getAList(this.props.fromList.listId);
  };

  /* Moves or copies item to new list */
  // copyOrMoveToNewListAction = (toListName, move) => {};

  /* Moves item to another list */
  move = (toListId) => {
    this.props.moveToList({
      listId: toListId,
      fromListId: this.props.fromList.listId,
      task: this.props.task,
    });
  };

  /* Copies item to another list byt its id*/
  copy = (toListId: string) => {
    this.props.prependToAList({ listId: toListId, task: this.props.task });
  };

  /* To List */
  displayToButton = (list:TodoList) => {
    if (list._id === this.props.fromList.listId) return null;
    return (
      <tr key={'tr' + list._id}>
        <td>
          To: <strong>{list.name}</strong>
        </td>
        <td>
          <button onClick={this.move.bind(this, list._id, list.name, false)}>Move</button>{' '}
          <button onClick={this.copy.bind(this, list._id)}>Copy</button>
        </td>
      </tr>
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.copyOrMoveToNew({
      fromListId: this.props.fromList.listId,
      task: this.props.task,
      listName: this.state.newListName,
      move: true,
    });
  };

  onListInputChange = (e) => {
    this.setState({ newListName: e.target.value });
  };

  render() {
    return (
      <div>
        <hr />
        <h2>{this.state.movingItem.substring(0, CONFIG.maxTaskLength)}</h2>
        <table className="table table-hover">
          <tbody>{this.props.lists.map((list) => this.displayToButton(list))}</tbody>
        </table>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <input className="list-input" value={this.state.newListName} onChange={this.onListInputChange} />
          <button disabled={!this.state.newListName.trim()} type="submit">
            Move to new list
          </button>
        </form>
        <hr />
        <button onClick={this.back}>Back to {this.props.fromList.name}</button>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  lists: state.app.lists.filter((item: TodoList) => !item.immutable),
  task: state.app.task,
  fromList: state.app.fromList,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAList: getAListAction.started,
      moveToList: moveToListAction,
      copyOrMoveToNew: copyOrMoveToNewListAction,
      prependToAList: prependToAListAction,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MovePage);
