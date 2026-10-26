import * as React from 'react';
import { useEffect } from 'react';

import Spinner from '../shared/Spinner';
import { appModes } from '../config/constants';
import { appActions } from '../store/actions';
import Failure from './Failure';
import MovePage from './MovePage';
import ListsApp from './ListsApp';
import TasksApp from './TasksApp';
import { TodoList } from '../store/types';

export interface AppProps {
  mode: string;
  lists: TodoList[];
  aList: TodoList;
  startupRequest: typeof appActions.startup;
}

const App: React.FunctionComponent<AppProps> = (props) => {
  const { mode, startupRequest } = props;

  useEffect(() => {
    startupRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mode) {
    return <div className="error">Mode undefined!</div>;
  }

  if (mode === appModes.MODE_LOADING) {
    return <Spinner />;
  }

  if (mode === appModes.MODE_LIST_OF_LISTS) {
    return <ListsApp />;
  }

  if (mode === appModes.MODE_A_LIST) {
    return <TasksApp />;
  }

  if (mode === appModes.MODE_MOVE) {
    return <MovePage />;
  }

  if (mode === appModes.DATA_CONFLICT) {
    return <Failure msg="Data conflict" />;
  }

  if (mode === appModes.MODE_ERROR) {
    return <Failure />;
  }

  return <div className="error">Mode {mode} not implemented</div>;
};

export default App;
