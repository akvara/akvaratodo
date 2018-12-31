import * as React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect, Dispatch } from 'react-redux';

import CONFIG from '../config.js';
import * as listActions from '../store/actions/list-actions';
import * as appActions from '../store/actions/app-actions';
import { RootState } from '../store/reducers';
import { ListCreds, TodoList } from '../store/types';

export interface MovePageProps {
  task: string;
  lists: TodoList[];
  fromList: ListCreds;
  getAList: typeof listActions.getAListAction.started;
  moveToList: typeof appActions.moveToListAction;
  moveToListByName: typeof appActions.moveToListByNameAction;
  copyToAList: typeof appActions.copyToListAction;
}

export class MovePageState {
  readonly newListName: string = '';
}

class MovePage extends React.PureComponent<MovePageProps, MovePageState> {
  readonly state = new MovePageState();

  /* Returns back to the same list with no changes */
  readonly back = () => {
    this.props.getAList(this.props.fromList.listId);
  };

  /* Moves item to another list */
  readonly move = (toListId: string) => {
    this.props.moveToList({
      toListId,
      fromListId: this.props.fromList.listId,
      task: this.props.task,
    });
  };

  /* Copies item to another list byt its id */
  readonly copy = (toListId: string) => {
    this.props.copyToAList({ toListId, task: this.props.task });
  };

  /* To List */
  readonly displayToButton = (list: TodoList) => {
    if (list._id === this.props.fromList.listId) {
      return null;
    }
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

  readonly handleNewListClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    this.props.moveToListByName({
      fromListId: this.props.fromList.listId,
      task: this.props.task,
      listName: this.state.newListName,
      // @ts-ignore
      move: e.target.value === 'move',
    });
  };

  readonly onListInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newListName: e.target.value });
  };

  render(): React.ReactNode {
    return (
      <div>
        <hr />
        <h2>{this.props.task.substring(0, CONFIG.maxTaskLength)}</h2>
        <table className="table table-hover">
          <tbody>{this.props.lists.map((list) => this.displayToButton(list))}</tbody>
        </table>
        <hr />
        <form >
          <input className="list-input" value={this.state.newListName} onChange={this.onListInputChange} />
          <button disabled={!this.state.newListName.trim()} value="move" type="submit" onClick={this.handleNewListClick} >
            Move to new list
          </button>
          <button disabled={!this.state.newListName.trim()} value="copy" type="submit" onClick={this.handleNewListClick} >
            Copy
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
