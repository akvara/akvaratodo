import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';

import ListOfLists from './ListOfLists';
import { addOrOpenListAction, getAListAction, getListOfLists, planWeekAction, removeListAction } from '../store/actions/list-actions';
import { makeContractableList } from '../utils/listUtils';
import { playSound, disableHotKeys, registerHotKeys } from '../utils/hotkeys';
import { RootState } from '../store/reducers';
import { compose, lifecycle, withProps } from 'recompose';
import { TodoList } from '../core/types';

export interface ListsAppPrivateProps {
  lists: TodoList[];
}

export interface ListsAppProps extends ListsAppPrivateProps {
  getAList: typeof getAListAction.started,
  getListOfLists: typeof getListOfLists.started,
  addOrOpenAList: typeof addOrOpenListAction.started,
  removeList: typeof removeListAction.started,
  planWeek: typeof planWeekAction.started,
}

class ListsApp extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      lists: makeContractableList(this.props.lists.filter(list => !list.immutable)),
      immutableLists: this.props.lists.filter(list => list.immutable),
      listName: '',
    };

    this.hotKeys = [ // reserved hotkeys
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
    let pressed = String.fromCharCode(e.which);
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
    this.hotKeys.forEach(function(k) {
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
    this.props.addOrOpenAList(this.state.listName);
  };

  openAList = (listId) => {
    this.props.getAList(listId);
  };

  toggleContracted = (listTitle, beContracted) => {
    let newList = this.state.lists.map(list => {
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
        <ListOfLists
          lists={this.state.lists}
          openList={this.openAList}
          toggleContracted={this.toggleContracted}
          removeList={this.removeList}
          hotKeys={this.hotKeys}
        />
        <h3>Protected</h3>
        <ListOfLists
          lists={this.state.immutableLists}
          openList={this.openAList}
        />
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
        <button onClick={this.props.planWeek}>Plan week</button>
        <button onClick={this.reload}>
                    <span className={'glyphicon glyphicon-refresh'}
                          aria-hidden="true">
                    </span> <u>R</u>eload
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
      getAList: getAListAction.started,
      getListOfLists: getListOfLists.started,
      addOrOpenAList: addOrOpenListAction,
      removeList: removeListAction.started,
      planWeek: planWeekAction,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ listName }) => ({
    listName,
  })),
)(ListsApp);
