import * as React from 'react';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';

import { disableHotKeys, playSound, registerHotKeys } from '../../utils/hotkeys';
import { ListCreds, TodoList } from '../../store/types';
import { appActions } from '../../store/actions';
import { config } from '../../config/config';
import ListsFilter from './ListsFilter';
import { restrictions } from '../../config/constants';
import { dayString } from '../../utils/calendar';

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
  tomorrowListName: string;
}

interface MovePageHandlers {
  moveHandler: (toListId: string) => void;
  copyHandler: (toListId: string) => void;
  moveToNewListHandler: () => void;
  moveToTomorrowHandler: () => void;
  copyToNewListHandler: () => void;
  backHandler: () => void;
  reloadHandler: () => void;
  pageHotKeys: (e: any) => void;
}

interface MovePagePrivateProps extends MovePageProps, MovePageHandlers {
  pageHotKeys: (e: any) => void;
}

const MovePage: React.FunctionComponent<MovePagePrivateProps> = (props) => {
  const {
    task,
    newListName,
    tomorrowListName,
    lists,
    fromList,
    moveToNewListHandler,
    moveToTomorrowHandler,
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
      </button>{' '}
      <button onClick={moveToTomorrowHandler}>
        {tomorrowListName}
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
            list.id === fromList.listId ? null : (
              <tr key={'tr' + list.id}>
                <td>
                  To: <strong>{list.name}</strong>
                </td>
                <td>
                  <button onClick={() => moveHandler(list.id)}>Move</button>{' '}
                  <button onClick={() => copyHandler(list.id)}>Copy</button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
};

export default compose<MovePagePrivateProps, MovePageProps>(
  withHandlers<MovePagePrivateProps, MovePageHandlers>({
    moveHandler: ({ moveToList, fromList, task }) => (toListId) => {
      moveToList({ fromListId: fromList.listId, toListId, task });
    },
    copyHandler: ({ copyToAList, task }) => (toListId) => {
      copyToAList({ toListId, task });
    },
    moveToNewListHandler: ({ moveToListByName, fromList, task, newListName }) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: newListName,
        move: true,
      });
    },
    moveToTomorrowHandler: ({ moveToListByName, fromList, task }) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: dayString(new Date(new Date().setDate(new Date().getDate() + 1))),
        move: true,
        backToOldList: true,
      });
    },
    copyToNewListHandler: ({ moveToListByName, fromList, task, newListName }) => () => {
      moveToListByName({
        fromListId: fromList.listId,
        task,
        listName: newListName,
        move: false,
      });
    },
    backHandler: ({ openAList, fromList }) => () => {
      openAList(fromList.listId);
    },
    reloadHandler: ({ reloadListOfListsPage }) => () => {
      reloadListOfListsPage();
    },
  }),
  withProps(({ reloadHandler, backHandler }) => ({
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
