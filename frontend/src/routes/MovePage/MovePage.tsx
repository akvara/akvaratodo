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
  newListName: string;
}

interface MovePageHandlers {
  moveHandler: (toListId: string) => void;
  copyHandler: (toListId: string) => void;
  moveToNewListHandler: () => void;
  copyToNewListHandler: () => void;
  backHandler: () => void;
  reloadHandler: () => void;
}

interface MovePagePrivateProps extends MovePageProps, MovePageHandlers {
  pageHotKeys: (e: any) => void;
  openAList: typeof appActions.openAList;
  moveToList: typeof appActions.moveToListAction;
  moveToListByName: typeof appActions.moveToListByNameAction;
  copyToAList: typeof appActions.copyToListAction;
  reloadListOfListsRequest: typeof appActions.reloadListOfLists;
  ref: any;
}

// const ref = React.createRef();

const MovePage: React.FunctionComponent<MovePagePrivateProps> = (props) => {
  const {
    task,
    newListName,
    lists,
    fromList,
    moveToNewListHandler,
    copyToNewListHandler,
    moveHandler,
    copyHandler,
    backHandler,
    reloadHandler,
    pageHotKeys,
  } = props;

  return (
    <>
      <hr />
      <h2>{task.substring(0, restrictions.maxTaskLength)}</h2>
      <hr />
      <button onClick={backHandler}>
        {'<'} Back to {fromList.name}
      </button>{' '}
      <button onClick={reloadHandler}>
        <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
      </button>
      <hr />
      <ListsFilter pageHotKeys={pageHotKeys} />
      <button disabled={!newListName} onClick={moveToNewListHandler}>
        Move to new list
      </button>{' '}
      <button disabled={!newListName} onClick={copyToNewListHandler}>
        Copy to new list
      </button>
      <hr />
      <table className="table table-hover">
        <tbody>
          {lists.map((list) =>
            list._id === fromList.listId ? null : (
              <tr key={list._id}>
                <td>
                  To: <strong>{list.name}</strong>
                </td>
                <td>
                  <button onClick={() => moveHandler(list._id)}>Move</button>{' '}
                  <button onClick={() => copyHandler(list._id)}>Copy</button>
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
  withHandlers<MovePagePrivateProps, MovePageHandlers>({
    moveHandler: ({ moveToList, fromList, task }: MovePagePrivateProps) => (toListId) => {
      moveToList({ fromListId: fromList.listId, toListId, task });
    },
    copyHandler: ({ copyToAList, task }: MovePagePrivateProps) => (toListId) => {
      copyToAList({ toListId, task });
    },
    moveToNewListHandler: ({ moveToListByName, fromList, task, newListName }: MovePagePrivateProps) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: newListName,
        move: true,
      });
    },
    copyToNewListHandler: ({ moveToListByName, fromList, task, newListName }: MovePagePrivateProps) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: newListName,
        move: false,
      });
    },
    backHandler: ({ openAList, fromList }: MovePagePrivateProps) => () => {
      openAList(fromList.listId);
    },
    reloadHandler: ({ reloadListOfListsRequest }: MovePagePrivateProps) => () => {
      reloadListOfListsRequest();
    },
  }),
  withProps(({ reloadHandler, backHandler }: MovePagePrivateProps) => ({
    pageHotKeys: (e) => {
      const pressed = String.fromCharCode(e.which);
      if (pressed === 'r') {
        e.preventDefault();
        playSound();
        reloadHandler();
        return;
      }
      if (pressed === '<') {
        e.preventDefault();
        playSound();
        backHandler();
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
