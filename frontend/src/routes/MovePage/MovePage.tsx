import * as React from 'react';
import { compose, withProps, withHandlers } from 'recompose';

import { ListCreds, TodoList } from '../../store/types';
import { appActions, listActions } from '../../store/actions';
import { config } from '../../config/config';
import ListsFilter from './ListsFilter/ListsFilter';
import { restrictions } from '../../config/constants';

export interface MovePageProps {
  task: string;
  lists: TodoList[];
  fromList: ListCreds;
  getAList: typeof listActions.getAListAction.started;
  moveToList: typeof appActions.moveToListAction;
  moveToListByName: typeof appActions.moveToListByNameAction;
  copyToAList: typeof appActions.copyToListAction;
  newListName: string;
}

interface MovePagePrivateProps extends MovePageProps {
  onMove: (toListId: string) => void;
  onCopy: (toListId: string) => void;
  onMoveToNewList: () => void;
  onCopyToNewList: () => void;
  onBack: () => void;
}

const MovePage: React.FunctionComponent<MovePagePrivateProps> = (props) => {
  const { task, newListName, lists, fromList, onMoveToNewList, onCopyToNewList, onMove, onCopy, onBack } = props;
  return (
    <>
      <hr />
      <h2>{task.substring(0, restrictions.maxTaskLength)}</h2>
      <hr />
      <ListsFilter />
      <button disabled={!newListName} onClick={onMoveToNewList}>
        Move to new list
      </button>
      <button disabled={!newListName} onClick={onCopyToNewList}>
        Copy
      </button>
      <hr />
      <table className="table table-hover">
        <tbody>
          {lists.map((list) =>
            list._id === fromList.listId ? null : (
              <tr key={'tr' + list._id}>
                <td>
                  To: <strong>{list.name}</strong>
                </td>
                <td>
                  <button onClick={() => onMove(list._id)}>Move</button>{' '}
                  <button onClick={() => onCopy(list._id)}>Copy</button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <hr />
      <button onClick={onBack}>Back to {fromList.name}</button>
    </>
  );
};

// class MovePageOld extends React.PureComponent<MovePageProps, any> {
//   /* Returns back to the same list with no changes */
//   readonly back = () => {
//     this.props.getAList(this.props.fromList.listId);
//   };
//
//   /* Moves item to another list */
//   readonly move = (toListId: string) => {
//     this.props.moveToList({
//       toListId,
//       fromListId: this.props.fromList.listId,
//       task: this.props.task,
//     });
//   };
//
//   /* Copies item to another list by its id */
//   readonly copy = (toListId: string) => {
//     this.props.copyToAList({ toListId, task: this.props.task });
//   };
//
//   /* To List */
//   readonly displayToButton = (list: TodoList) => {
//     if (list._id === this.props.fromList.listId) {
//       return null;
//     }
//     return (
//       <tr key={'tr' + list._id}>
//         <td>
//           To: <strong>{list.name}</strong>
//         </td>
//         <td>
//           <button onClick={this.move.bind(this, list._id, list.name, false)}>Move</button>{' '}
//           <button onClick={this.copy.bind(this, list._id)}>Copy</button>
//         </td>
//       </tr>
//     );
//   };
//
//   readonly handleNewListClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//
//     this.props.moveToListByName({
//       fromListId: this.props.fromList.listId,
//       task: this.props.task,
//       listName: this.props.newListName,
//       // @ts-ignore
//       move: e.target.value === 'move',
//     });
//   };
//
//   readonly onListInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ newListName: e.target.value });
//   };
//
//   render(): React.ReactNode {
//     console.log('-****- newListName', this.props.newListName);
//     return (
//       <div>
//         <hr />
//         <h2>{this.props.task.substring(0, restrictions.maxTaskLength)}</h2>
//         <hr />
//         <ListsFilter />
//         <button disabled={!this.props.newListName} value="move" type="submit" onClick={this.handleNewListClick}>
//           Move to new list
//         </button>
//         <button disabled={!this.props.newListName} value="copy" type="submit" onClick={this.handleNewListClick}>
//           Copy
//         </button>
//         <hr />
//         <table className="table table-hover">
//           <tbody>{this.props.lists.map((list) => this.displayToButton(list))}</tbody>
//         </table>
//         <hr />
//         <button onClick={this.back}>Back to {this.props.fromList.name}</button>
//       </div>
//     );
//   }
// }

export default compose(
  withHandlers({
    onMove: ({ moveToList, fromList, task }: MovePagePrivateProps) => (toListId) => {
      moveToList({ fromListId: fromList.listId, toListId, task });
    },
    onCopy: ({ copyToAList, task }: MovePagePrivateProps) => (toListId) => {
      copyToAList({ toListId, task });
    },
    onMoveToNewList: ({ moveToListByName, fromList, task, newListName }: MovePagePrivateProps) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: newListName,
        move: true,
      });
    },
    onCopyToNewList: ({ moveToListByName, fromList, task, newListName }: MovePagePrivateProps) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: newListName,
        move: false,
      });
    },
    onBack: ({ getAList, fromList }: MovePagePrivateProps) => () => {
      getAList(fromList.listId);
    },
  }),
)(MovePage);
