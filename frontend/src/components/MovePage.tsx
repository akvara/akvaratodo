import * as React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import CONFIG from '../config.js';
import * as listActions from '../store/actions/list-actions';
import * as appActions from '../store/actions/app-actions';

class MovePage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newListName: '',
      movingItem: props.task,
    };
  }

  /* Returns back to the same list with no changes */
  back = () => {
    this.props.getAList(this.props.fromList.listId);
  };

  /* Moves item to another list */
  move = (toListId) => {
    this.props.moveToList({
      toListId,
      fromListId: this.props.fromList.listId,
      task: this.props.task,
    });
  };

  /* Copies item to another list byt its id */
  copy = (toListId) => {
    this.props.copyToAList({ toListId, task: this.props.task });
  };

  /* To List */
  displayToButton = (list) => {
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
    this.props.moveToListByName({
      fromListId: this.props.fromList.listId,
      task: this.props.task,
      listName: this.state.newListName,
      // move: true, //??
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

const mapStateToProps = (state) => ({
  lists: state.app.lists.filter((item) => !item.immutable),
  task: state.app.task,
  fromList: state.app.fromList,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getAList: listActions.getAListAction.started,
      moveToListByName: appActions.moveToListByNameAction,
      moveToList: appActions.moveToListAction,
      copyToAList: appActions.copyToListAction,
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
