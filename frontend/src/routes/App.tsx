import * as React from 'react';
import { compose, lifecycle } from 'recompose';

import CONST from '../utils/constants.js';
import { Spinner } from '../components/Spinner';
import * as listActions from '../store/list/list.actions';
import ListsApp from '../components/ListsPage';
import TasksApp from '../components/TasksPage';
import MovePage from '../components/MovePage';
import Failure from '../components/Failure';

export interface AppPrivateProps {
  mode: string;
}

interface AppContainerProps extends AppPrivateProps {
  getListOfLists: typeof listActions.getListOfListsAction.started;
}

const App: React.FunctionComponent<AppPrivateProps> = (props) => {
  const { mode } = props;

  if (!mode) {
    return <div className="error">mode undefined!</div>;
  }

  if (mode === CONST.mode.MODE_LOADING) {
    return <Spinner />;
  }

  if (mode === CONST.mode.MODE_LIST_OF_LISTS) {
    return <ListsApp />;
  }

  if (mode === CONST.mode.MODE_A_LIST) {
    return <TasksApp />;
  }

  if (mode === CONST.mode.MODE_MOVE) {
    return <MovePage />;
  }

  if (mode === CONST.mode.DATA_CONFLICT) {
    return <Failure msg="Data conflict" />;
  }

  if (mode === CONST.mode.MODE_ERROR) {
    return <Failure />;
  }

  return <div className="error">Mode {mode} not impelemented</div>;
};

export default compose(
  lifecycle<AppContainerProps, {}>({
    componentDidMount() {
      if (!this.props.mode) {
        //     if (this.props.openAtStartup) {
        //       // Uncomment when opening list at startup is back in fashion
        //       // this.props.dispatch(listActions.addOrOpenListByNameAction(this.props.openAtStartup));
        //     }
        this.props.getListOfLists();
      }
    },
  }),
)(App);
