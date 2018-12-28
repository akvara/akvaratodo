import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect, MapDispatchToProps, MapStateToProps, Dispatch } from 'react-redux';

import CONFIG from '../config.js';
import {
  addOrOpenListAction,
  copyOrMoveToNewListAction,
  getAListAction, getListOfLists,
  moveToListAction, planWeekAction,
  prependToAListAction, removeListAction,
} from '../store/actions/list-actions';
import { RootState } from '../store/reducers';
import { TodoList } from '../core/types';

export interface MovePrivateProps {
  lists: TodoList[];
}

export interface MoveProps extends MovePrivateProps {
  getAList: typeof getAListAction.started,
  getListOfLists: typeof getListOfLists.started,
  addOrOpenAList: typeof addOrOpenListAction.started,
  removeList: typeof removeListAction.started,
  planWeek: typeof planWeekAction.started,
}

class Move extends Component {
  constructor(props, context) {
    super(props, context);
    console.log('lll', props);

    this.state = {
      newListName: '',
      movingItem: props.task,
    };
  }

  /* Returns back to the same list with no changes */
  back = () => {
    this.props.getAList(this.props.from_list.listId);
  };

  /* Moves or copies item to new list */
  // copyOrMoveToNewListAction = (toListName, move) => {};

  /* Moves item to another list */
  move = (toListId) => {
    this.props.moveToList({
      listId: toListId,
      fromListId: this.props.from_list.listId,
      task: this.props.task,
    });
  };

  /* Copies item to another list byt its id*/
  copy = (toListId) => {
    this.props.prependToAList({ listId: toListId, task: this.props.task });
  };

  /* To List */
  displayToButton = (list) => {
    if (list._id === this.props.from_list.listId) return null;
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
      fromListId: this.props.from_list.listId,
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
        <button onClick={this.back}>Back to {this.props.from_list.name}</button>
      </div>
    );
  }
}

// const mapStateToProps: MapStateToProps<MovePrivateProps, void, RootState> = (state: RootState) => ({
//   lists: state.app.lists,
// });

const mapDispatchToProps: MapDispatchToProps<any, MoveProps> = (dispatch: Dispatch<RootState>) => {
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
    null,
    mapDispatchToProps,
  ),
  // withProps(({ listName }) => ({
  //   listName,
  // })),
)(Move);
