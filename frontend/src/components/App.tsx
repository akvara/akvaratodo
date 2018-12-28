import * as React from 'react';
import { connect } from 'react-redux';

import CONST from '../utils/constants.js';
import { Spinner } from './Spinner';
import * as listActions from '../store/actions/list-actions';
import ListsApp from './ListsApp';
import TasksApp from './TasksApp';
import Move from './Move';
import Failure from './Failure';

class App extends React.PureComponent {

  componentDidMount() {
    if (!this.props.mode) {
      if (this.props.openAtStartup) {
        // Uncomment when opening list at startup is back in fashion
        // this.props.dispatch(listActions.addOrOpenAList(this.props.openAtStartup));
      }
      this.props.dispatch(listActions.getListOfLists());
    }
  }

  switcher = () => {
    if (!this.props.mode) {
      return <div className="error">mode undefined!</div>;
    }

    if (this.props.mode === CONST.mode.MODE_LOADING) {
      return Spinner();
    }

    if (this.props.mode === CONST.mode.MODE_LIST_OF_LISTS) {
      return <ListsApp lists={this.props.lists} />;
    }

    if (this.props.mode === CONST.mode.MODE_A_LIST) {
      return (
        <TasksApp
          list={this.props.a_list}
          immutables={this.props.lists.filter((item) => item.immutable)}
          exportables={this.props.lists
            .filter((item) => item._id !== this.props.a_list._id && !item.immutable)
            .slice(0, 20)}
          previous_list={
            this.props.from_list && this.props.a_list._id === this.props.from_list.listId ? null : this.props.from_list
          }
        />
      );
    }

    if (this.props.mode === CONST.mode.MODE_MOVE) {
      return (
        <Move
          lists={this.props.lists.filter((item) => !item.immutable)}
          task={this.props.task}
          from_list={this.props.from_list}
        />
      );
    }

    if (this.props.mode === CONST.mode.DATA_CONFLICT) {
      return <Failure msg="Data conflict" />;
    }

    if (this.props.mode === CONST.mode.MODE_ERROR) {
      return <Failure onClick={window.location.reload} />;
    }

    return <div className="error">Mode {this.props.mode} not impelemented</div>;
  };

  render() {
    return this.switcher();
  }
}

export default connect((state) => ({
  mode: state.app.mode,
  lists: state.app.lists,
  a_list: state.app.a_list,
  task: state.app.task,
  from_list: state.app.from_list,
}))(App);
