import * as React from 'react';
import { compose, lifecycle } from 'recompose';

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
}

interface AppContainerProps extends AppProps {
  startupRequest: typeof appActions.startup;
}

const App: React.FunctionComponent<AppProps> = (props) => {
  const { mode } = props;

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

export default compose(
  lifecycle<AppContainerProps, {}>({
    componentDidMount() {
      //     if (this.props.openAtStartup) {
      //       // Uncomment when opening list at startup is back in fashion
      //       // this.props.dispatch(listActions.addOrOpenListByNameAction(this.props.openAtStartup));
      //     }
      this.props.startupRequest();
    },
  }),
)(App);
