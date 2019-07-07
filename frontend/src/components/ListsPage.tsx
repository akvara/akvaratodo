import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { compose } from 'recompose';

import ListsTable from './ListsTable';

import { disableHotKeys, playSound, registerHotKeys } from '../utils/hotkeys';
import { RootState } from '../store/reducers';
import { TodoList } from '../store/types';
import { dayString } from '../utils/calendar';
import { appActions, listActions } from '../store/actions';

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

const makeContractableList = (listOfLists) => {
  let contractedList = [];

  listOfLists.map((list) => {
    let dashPos = list.name.indexOf(' - ');
    if (dashPos > -1) {
      let contractedTitle = list.name.substring(0, dashPos);
      if (!contractedList[contractedTitle]) {
        contractedList[contractedTitle] = { used: false, list: [] };
      }
      contractedList[contractedTitle].list.push(list);
    }
    return null;
  });

  let displayList = [];

  listOfLists.map((list) => {
    let dashPos = list.name.indexOf(' - ');
    if (dashPos > -1) {
      let contractedTitle = list.name.substring(0, dashPos);
      if (contractedList[contractedTitle].list.length > 1) {
        if (!contractedList[contractedTitle].used) {
          contractedList[contractedTitle].used = true;
          displayList.push({
            isList: true,
            isContracted: true,
            contractedTitle: contractedTitle,
            list: contractedList[contractedTitle].list,
          });
        }
      } else {
        displayList.push(list);
      }
    } else {
      displayList.push(list);
    }
    return null;
  });
  return displayList;
};


class ListsPage extends React.PureComponent {
  constructor(props: ListsAppProps) {
    super(props);
    this.state = {
      lists: makeContractableList(props.lists.filter((list) => !list.immutable)),
      immutableLists: props.lists.filter((list) => list.immutable),
      listName: '',
    };

    this.hotKeys = [
      // reserved hotkeys
      { key: 'a' }, // "Add"
      { key: 'r' }, // "Refresh"
      { key: 't' }, // "Today"
      { key: 'p' }, // "Plan"
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
    if (pressed === 't') {
      playSound();
      this.goToday();
      return;
    }
    if (pressed === 'p') {
      playSound();
      this.props.planWeek();
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
    this.props.addOrOpenAList({ listName: this.state.listName });
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

  goToday = () => this.props.addOrOpenAList({ listName: dayString(new Date()) });

  render() {
    const yesterdayString = dayString(new Date(Date.now() - 864e5)); // 864e5 == 86400000 == 24*60*60*1000);
    const filtered = this.props.lists.filter((list: TodoList) => list.name === yesterdayString);
    this.addHotKeys();
    return (
      <div>
        <table width="100%">
          <tbody>
          <tr>
            <td>
              <h1>Lists</h1>
            </td>
            <td className="right-align">
              {filtered.length > 0 &&
              <button onClick={() => this.props.addOrOpenAList({ listName: yesterdayString })}>
                Yesterday
              </button>
              }
              <button onClick={this.goToday}>
                <u>T</u>oday
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <ListsTable
          lists={this.state.lists}
          openList={this.openAList}
          toggleContracted={this.toggleContracted}
          removeList={this.removeList}
          hotKeys={this.hotKeys}
        />
        <h3>Protected</h3>
        <ListsTable lists={this.state.immutableLists} openList={this.openAList}/>
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
        <hr/>
        <button onClick={this.props.planWeek}><u>P</u>lan week</button>
        <button onClick={this.reload}>
          <span className={'glyphicon glyphicon-refresh'} aria-hidden="true"/> <u>R</u>eload
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
)(ListsPage);
