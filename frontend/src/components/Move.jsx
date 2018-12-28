import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CONFIG from '../config.js';
import { copyOrMoveToNew, getAList, moveToList, prependToAList } from '../store/actions/list-actions';

class Move extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newListName: '',
      movingItem: props.task,
    };
  }

  /* Returns back to the same list with no changes */
  back = () => {
    this.props.actions.getAList(this.props.from_list.listId);
  };

  /* Moves or copies item to new list */
  // copyOrMoveToNew = (toListName, move) => {};

  /* Moves item to another list */
  move = (toListId) => {
    this.props.actions.moveToList({
      listId: toListId,
      fromListId: this.props.from_list.listId,
      task: this.props.task,
    });
  };

  /* Copies item to another list byt its id*/
  copy = (toListId) => {
    this.props.actions.prependToAList({ listId: toListId, task: this.props.task });
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
    this.props.actions.copyOrMoveToNew({
      fromListId: this.props.from_list.listId,
      task: this.props.task,
      listName: this.state.newListName,
      move: true,
    });
  };
  //
  // copyToNew = () => {
  //     this.props.actions.copyOrMoveToNew({
  //         fromListId: this.props.from_list.listId,
  //         task: this.props.task,
  //         listName: this.state.newListName,
  //         move: false
  //     });
  // };
  //
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

export default connect(
  null,
  (dispatch) => ({
    actions: bindActionCreators(
      {
        getAList: getAList,
        moveToList: moveToList,
        copyOrMoveToNew: copyOrMoveToNew,
        prependToAList: prependToAList,
      },
      dispatch,
    ),
  }),
)(Move);
