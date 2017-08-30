import React, { Component } from 'react';
import ListOfLists from './ListOfLists';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as listActions from '../actions/list-actions';
import {playSound} from '../utils/hotkeys';
import $ from 'jquery';

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

        this.hotKeys = [{ key: 'a', listId: null, listName: null }]; // reserved hotkey
    }

    componentWillUnmount() {
        this.disableHotKeys();
    }

    componentDidMount() {
        document.title = "ToDo lists";
        this.registerHotKeys();
    }

    registerHotKeys = () => {
        $(document).on("keypress", (e) => this.checkKeyPressed(e));
    }

    disableHotKeys = () => {
        $(document).off("keypress");
    }

    checkKeyPressed = (e) => {
        var pressed = String.fromCharCode(e.which);
        if (pressed === 'a') {
            this.playSound()
            e.preventDefault();
            this.nameInput.focus();
            return;
        }
        this.hotKeys.forEach(function (k) {
                if (k.key === pressed) {
                    // this.playSound();
                    this.openAList(k.listId);
                }
            }.bind(this)
        );
    }

    addHotKeys = () => {
        this.state.lists.forEach((list) => {
            var newKey = this.findFreeKey(list.name);
            if (newKey) this.hotKeys.push({key: newKey, listId: list._id, listName: list.name})
        });
        console.log('this.hotKeys:', this.hotKeys);
    }

    keyIsNotOccupied = (key) => !this.hotKeys.filter((elem) => elem.key === key).length;

    findFreeKey = (str) => {
        for (var i = 0, len = str.length; i < len; i++) {
            var pretender = str[i].toLowerCase();
            if ('abcdefghijklmnopqrstuvwxyz'.indexOf(pretender) !== -1 && this.keyIsNotOccupied(pretender)) return pretender;
        }
        return null;
    }

    /* Go to list of lists */
    openLists = () => {
        this.props.dispatch(listActions.getListOfLists());
    }

    onNameChange = (e) => {
        this.setState({ listName: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.dispatch(this.props.actions.addOrOpenAList(this.state.listName));
    }

    openAList = (listId) => {
        this.props.dispatch(this.props.actions.getAList(listId));
    }

    listChanger = (listName) => {
        this.props.dispatch(this.props.actions.addOrOpenAList(listName));
    }

    render = () => {
        this.addHotKeys();
        return (
            <div>
                <h1>Lists</h1>
                <ListOfLists
                    lists={this.state.lists.filter(list => !list.immutable)}
                    openList={this.openAList}
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
                        onBlur={this.registerHotKeys}
                        onFocus={this.disableHotKeys}
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
        actions: listActions,
        dispatch
    };
};

export default connect(
    null,
    mapDispatchToProps
)(ListsApp);
