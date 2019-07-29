import * as React from 'react';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { disableHotKeys, playSound, registerHotKeys } from '../../utils/hotkeys';

import { ListCreds, TodoList } from '../../store/types';
import { appActions } from '../../store/actions';
import { config } from '../../config/config';
import ListsFilter from './ListsFilter';
import { restrictions } from '../../config/constants';

export interface MovePageProps {
  task: string;
  lists: TodoList[];
  fromList: ListCreds;
  openAList: typeof appActions.openAList;
  moveToList: typeof appActions.moveToListAction;
  moveToListByName: typeof appActions.moveToListByNameAction;
  copyToAList: typeof appActions.copyToListAction;
  reloadListOfListsPage: typeof appActions.reloadListOfLists;
  newListName: string;
}

interface MovePagePrivateProps extends MovePageProps {
  onMove: (toListId: string) => void;
  onCopy: (toListId: string) => void;
  onMoveToNewList: () => void;
  onCopyToNewList: () => void;
  onBack: () => void;
  onReload: () => void;
  pageHotKeys: (e: any) => void;
}

const ref = React.createRef();

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
    pageHotKeys,
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
      <ListsFilter pageHotKeys={pageHotKeys} />
      <button disabled={!newListName} onClick={onMoveToNewList}>
        Move to new list
      </button>{' '}
      <button disabled={!newListName} onClick={onCopyToNewList}>
        Copy to new list
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
    onBack: ({ openAList, fromList }: MovePagePrivateProps) => () => {
      openAList(fromList.listId);
    },
    onReload: ({ reloadListOfListsPage }: MovePagePrivateProps) => () => {
      reloadListOfListsPage();
    },
  }),
  withProps(({ onReload, onBack }: MovePagePrivateProps) => ({
    pageHotKeys: (e) => {
      const pressed = String.fromCharCode(e.which);

      if (pressed === 'r') {
        e.preventDefault();
        playSound();
        onReload();
        return;
      }
      if (pressed === '<') {
        e.preventDefault();
        playSound();
        onBack();
        return;
      }
    },
  })),
  lifecycle<MovePagePrivateProps, {}>({
    componentDidMount() {
      registerHotKeys(this.props.pageHotKeys);
    },
    componentWillUnmount() {
      disableHotKeys();
    },
  }),
)(MovePage);
