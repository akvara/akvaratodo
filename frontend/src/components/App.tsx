import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps, Dispatch } from 'react-redux';

import CONST from '../utils/constants.js';
import { Spinner } from './Spinner';
import * as listActions from '../store/actions/list-actions';
import ListsApp from './ListsApp';
import TasksApp from './TasksApp';
import Move from './Move';
import Failure from './Failure';
import { RootState } from '../store/reducers';
import { compose, lifecycle } from 'recompose';
import { bindActionCreators } from 'redux';

export interface AppProps {
  mode: string;
  lists: [];
  a_list: string;
  task: string;
  from_list: string;
  getListOfLists: typeof listActions.getListOfLists.started,
}

const App: React.FunctionComponent<AppProps> = (props) => {

  const { mode, lists, a_list, from_list } = props;

  if (!mode) {
    return <div className="error">mode undefined!</div>;
  }

  if (mode === CONST.mode.MODE_LOADING) {
    return Spinner();
  }

  if (mode === CONST.mode.MODE_LIST_OF_LISTS) {
    return <ListsApp  />;
  }

  if (mode === CONST.mode.MODE_A_LIST) {
    return (
      <TasksApp
        list={a_list}
        immutables={lists.filter((item) => item.immutable)}
        exportables={lists.filter((item) => item._id !== a_list._id && !item.immutable).slice(0, 20)}
        previous_list={
          from_list && a_list._id === from_list.listId ? null : from_list
        }
      />
    );
  }

  if (mode === CONST.mode.MODE_MOVE) {
    return (
      <Move lists={lists.filter((item) => !item.immutable)} task={this.props.task} from_list={this.props.from_list} />
    );
  }

  if (mode === CONST.mode.DATA_CONFLICT) {
    return <Failure msg="Data conflict" />;
  }

  if (mode === CONST.mode.MODE_ERROR) {
    return <Failure onClick={window.location.reload} />;
  }

  return <div className="error">Mode {mode} not impelemented</div>;
};

const mapStateToProps: MapStateToProps<AppProps, void, RootState> = (state: RootState) => ({
  mode: state.app.mode,
  lists: state.app.lists,
  a_list: state.app.a_list,
  task: state.app.task,
  from_list: state.app.from_list,
});

const mapDispatchToProps: MapDispatchToProps<any, AppProps> = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getListOfLists: listActions.getListOfLists.started,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle<AppProps, {}>({
    componentDidMount() {
      if (!this.props.mode) {
        //     if (this.props.openAtStartup) {
        //       // Uncomment when opening list at startup is back in fashion
        //       // this.props.dispatch(listActions.addOrOpenAList(this.props.openAtStartup));
        //     }
        this.props.getListOfLists({});
      }
    },
  }),
)(App);
