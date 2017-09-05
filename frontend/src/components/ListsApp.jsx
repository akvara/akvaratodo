import React, { Component } from 'react';
import ListOfLists from './ListOfLists';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionToPromise} from '../utils/redux-form';
import {addOrOpenAList, getAList, removeList, getListOfLists} from '../actions/list-actions';
import {playSound} from '../utils/hotkeys';
import * as Utils from '../utils/utils.js';

class ListsApp extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            lists: this.props.lists || null,
            listName: '',
        };

        this.hotKeys = [ // reserved hotkeys
            { key: 'a'},
            { key: 'r'},
        ];
    }

    componentWillUnmount() {
        Utils.disableHotKeys();
    }

    componentDidMount() {
        document.title = "ToDo lists";
        Utils.registerHotKeys(this.checkKeyPressed);
    }

    checkKeyPressed = (e) => {
        let pressed = String.fromCharCode(e.which);
        if (pressed === 'a') {
            playSound();
            e.preventDefault();
            this.nameInput.focus();
            return;
        }
        if (pressed === 'r') {
            playSound();
            e.preventDefault();
            this.openLists();
            return;
        }
        this.hotKeys.forEach(function (k) {
                if (k.key === pressed) {
                    playSound();
                    this.openAList(k.listId);
                }
            }.bind(this)
        );
    };

    addHotKeys = () => {
        this.state.lists.forEach((list) => {
            let newKey = this.findFreeKey(list.name);
            if (newKey) this.hotKeys.push({key: newKey, listId: list._id, listName: list.name})
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
    openLists = () => {
        this.props.actions.getListOfLists();
    };

    onNameChange = (e) => {
        this.setState({ listName: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.actions.addOrOpenAList(this.state.listName);
    };

    openAList = (listId) => {
        this.props.actions.getAList(listId);
    };

    listChanger = (listName) => {
        this.props.actions.addOrOpenAList(listName);
    };

    removeList = (listId) => {
        this.props.actions.removeList(listId);
    };

    render = () => {
        this.addHotKeys();
        return (
            <div>
                <h1>Lists</h1>
                <ListOfLists
                    lists={this.state.lists.filter(list => !list.immutable)}
                    openList={this.openAList}
                    removeList={this.removeList}
                    hotKeys={this.hotKeys}
                />
                <h3>Protected</h3>
                <ListOfLists
                    lists={this.state.lists.filter(list => list.immutable)}
                    openList={this.openAList}
                />
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="list-input"
                        ref={(input) => { this.nameInput = input; }}
                        value={this.state.listName}
                        onBlur={Utils.registerHotKeys.bind(this, this.checkKeyPressed)}
                        onFocus={Utils.disableHotKeys}
                        onChange={this.onNameChange}
                    />
                    <button disabled={!this.state.listName.trim()}>Create new list</button>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            addOrOpenAList: bindActionToPromise(dispatch, addOrOpenAList),
            removeList: bindActionToPromise(dispatch, removeList),
            getAList: bindActionToPromise(dispatch, getAList),
            getListOfLists: bindActionToPromise(dispatch, getListOfLists),
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(ListsApp);
