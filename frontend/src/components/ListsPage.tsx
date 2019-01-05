import * as React from "react";
import { bindActionCreators } from 'redux';
import { connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';

import ListOfLists from './ListOfLists';
import * as listActions from '../store/actions/list-actions';
import * as appActions from '../store/actions/app-actions';

import { makeContractableList } from '../utils/listUtils';
import { disableHotKeys, playSound, registerHotKeys } from '../utils/hotkeys';
import { RootState } from '../store/reducers';
import { compose, lifecycle, withProps } from 'recompose';
import { TodoList } from '../store/types';
import { dayString } from '../utils/calendar';

export interface ListsAppPrivateProps {
  lists: TodoList[];
}

export interface ListsAppProps extends ListsAppPrivateProps {
  getAList: typeof listActions.getAListAction.started;
  getListOfLists: typeof listActions.getListOfListsAction.started;
  addOrOpenAList: typeof appActions.addOrOpenListByNameAction;
  removeList: typeof listActions.removeListAction.started;
  planWeek: typeof appActions.planWeekAction;
}

class
class ListsPage extends React.PureComponent {
  constructor(props:ListsAppProps ) {
    super(props);
    this.state = {
      lists: makeContractableList(props.lists.filter((list) => !list.immutable)),
      immutableLists: props.lists.filter((list) => list.immutable),
      listName: '',
    };

    this.hotKeys = [
      // reserved hotkeys
      { key: 'a' },
      { key: 'r' },
    ];
  }

  componentWillUnmount() {
    disableHotKeys();
  }

  componentDidMount() {
    document.title = 'ToDo lists';
    registerHotKeys(this.checkKeyPressed.bind(this));
  }

  checkKeyPressed = (e) => {
    const pressed = String.fromCharCode(e.which);
    if (pressed === 'a') {
      playSound();
      e.preventDefault();
      this.listNameInput.focus();
      return;
    }
    if (pressed === 'r') {
      playSound();
      e.preventDefault();
      this.reload();
      return;
    }
    this.hotKeys.forEach(
      function(k) {
        if (k.key === pressed) {
          playSound();
          this.openAList(k.listId);
        }
      }.bind(this),
    );
  };

  addHotKeys = () => {
    this.state.lists.forEach((list) => {
      if (!list.isList) {
        let newKey = this.findFreeKey(list.name);
        if (newKey) this.hotKeys.push({ key: newKey, listId: list._id, listName: list.name });
      }
    });
  };

  keyIsNotOccupied = (key) => !this.hotKeys.filter((elem) => elem.key === key).length;

  findFreeKey = (str) => {
    for (let i = 0, len = str.length; i < len; i++) {
      let pretender = str[i].toLowerCase();
      if ('abcdefghijklmnopqrstuvwxyz'.indexOf(pretender) !== -1 && this.keyIsNotOccupied(pretender)) return pretender;
    }
    return null;
  };

  /* Go to list of lists */
  reload = () => {
    this.props.getListOfLists();
  };

  onNameChange = (e) => {
    this.setState({ listName: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addOrOpenAList({listName: this.state.listName});
  };

  openAList = (listId) => {
    this.props.getAList(listId);
  };

  toggleContracted = (listTitle, beContracted) => {
    let newList = this.state.lists.map((list) => {
      if (list.isList && list.contractedTitle === listTitle) {
        return {
          ...list,
          isContracted: beContracted,
        };
      } else {
        return list;
      }
    });
    this.setState({ lists: newList });
  };

  removeList = (listId) => {
    this.props.removeList(listId);
  };

  handleKeyDownAtListInput = (e) => {
    if (e.keyCode === 27) {
      this.listNameInput.blur();
      this.setState({
        listName: '',
      });
    }
  };

  /* The Renderer */
  render() {
    this.addHotKeys();
    return (
      <div>
        <h1>Lists</h1>
        <span >
          <button onClick={()=>this.props.addOrOpenAList({listName: dayString(new Date())})}>
            Today
          </button>
        </span>
        <ListOfLists
          lists={this.state.lists}
          openList={this.openAList}
          toggleContracted={this.toggleContracted}
          removeList={this.removeList}
          hotKeys={this.hotKeys}
        />
        <h3>Protected</h3>
        <ListOfLists lists={this.state.immutableLists} openList={this.openAList} />
        <form onSubmit={this.handleSubmit}>
          <input
            className="list-input"
            ref={(input) => {
              this.listNameInput = input;
            }}
            value={this.state.listName}
            onFocus={disableHotKeys.bind(this)}
            onBlur={registerHotKeys.bind(this, this.checkKeyPressed)}
            onKeyDown={this.handleKeyDownAtListInput}
            onChange={this.onNameChange}
          />
          <button disabled={!this.state.listName.trim()}>Create new list</button>
        </form>
        <hr />
        <button onClick={this.props.planWeek}>Plan week</button>
        <button onClick={this.reload}>
          <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
        </button>
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<ListsAppPrivateProps, void, RootState> = (state: RootState) => ({
  lists: state.app.lists,
});

const mapDispatchToProps: MapDispatchToProps<any, ListsAppProps> = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAList: listActions.getAListAction.started,
      getListOfLists: listActions.getListOfListsAction.started,
      removeList: listActions.removeListAction.started,
      addOrOpenAList: appActions.addOrOpenListByNameAction,
      planWeek: appActions.planWeekAction,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  // withProps({
  //   listNameInput: undefined,
  //   hotKeys: []
  //   }
  // )
)(ListsPage);
