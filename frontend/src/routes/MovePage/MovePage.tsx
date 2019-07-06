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
  reloadListOfListsPage: typeof appActions.reloadListOfListsPageAction;
  newListName: string;
}

interface MovePagePrivateProps extends MovePageProps {
  onMove: (toListId: string) => void;
  onCopy: (toListId: string) => void;
  onMoveToNewList: () => void;
  onCopyToNewList: () => void;
  onBack: () => void;
  onReload: () => void;
}

const MovePage: React.FunctionComponent<MovePagePrivateProps> = (props) => {
  const {
    task,
    newListName,
    lists,
    fromList,
    onMoveToNewList,
    onCopyToNewList,
    onMove,
    onCopy,
    onBack,
    onReload,
  } = props;
  return (
    <>
      <hr />
      <h2>{task.substring(0, restrictions.maxTaskLength)}</h2>
      <hr />
      <button onClick={onBack}>
        {'<'} Back to {fromList.name}
      </button>{' '}
      <button onClick={onReload}>
        <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
      </button>
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

    </>
  );
};

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
    onReload: ({ reloadListOfListsPage }: MovePagePrivateProps) => () => {
      reloadListOfListsPage();
    },
  }),
)(MovePage);
