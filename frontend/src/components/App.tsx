import * as React from 'react';
import { connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';

import CONST from '../utils/constants.js';
import { Spinner } from './Spinner';
import * as listActions from '../store/actions/list-actions';
import ListsApp from './ListsPage';
import TasksApp from './TasksPage';
import MovePage from './MovePage';
import Failure from './Failure';
import { RootState } from '../store/reducers';
import { compose, lifecycle } from 'recompose';
import { bindActionCreators } from 'redux';

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

const mapStateToProps: MapStateToProps<AppPrivateProps, void, RootState> = (state: RootState) => ({
  mode: state.app.mode,
});

const mapDispatchToProps: MapDispatchToProps<any, AppPrivateProps> = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getListOfLists: listActions.getListOfListsAction.started,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle<AppContainerProps, {}>({
    componentDidMount() {
      if (!this.props.mode) {
        //     if (this.props.openAtStartup) {
        //       // Uncomment when opening list at startup is back in fashion
        //       // this.props.dispatch(listActions.addOrOpenListByNameAction(this.props.openAtStartup));
        //     }
        this.props.getListOfLists({});
      }
    },
  }),
)(App);
