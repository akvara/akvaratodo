import * as React from 'react';
import { compose, lifecycle } from 'recompose';

import Spinner from '../shared/Spinner';
import { listActions } from '../store/actions';
import ListsApp from '../components/ListsPage';
import TasksApp from '../components/TasksPage';
import Failure from './Failure';
import MovePage from './MovePage';
import { appModes } from '../config/constants';

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
