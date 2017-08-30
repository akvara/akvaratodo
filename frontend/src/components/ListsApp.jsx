import React, { Component } from 'react';
import ListOfLists from './ListOfLists';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as listActions from '../actions/list-actions';
import {playSound} from '../utils/hotkeys';
import $ from 'jquery';

class ListsApp extends Component {
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
        console.log('this.props:', this.props);
        this.registerHotKeys();
    }

    registerHotKeys = () => {
        $(document).on("keypress", (e) => this.checkKeyPressed(e));
    }

    disableHotKeys = () => {
        $(document).off("keypress");
    }

    checkKeyPressed(e) {
        var key = String.fromCharCode(e.which)
        if ('alrp<'.indexOf(key) !== -1) playSound()

        switch(String.fromCharCode(e.which))
        {
            case 'a':
                e.preventDefault();
                this.nameInput.focus();
                break;
            case 'l':
                e.preventDefault();
                this.openLists.call(this);
                break;
            case 'r':
                e.preventDefault();
                this.reload.call(this);
                break;
            case 'p':
                e.preventDefault();
                this.mark.call(this);
                break;
            case '<':
                e.preventDefault();
                if (this.props.previousList) this.listChanger.call(this);
                break;
            default:
                break;
        }
    }

    addHotKeys =() => {
        this.state.lists.forEach((list) => {
            var newKey = this.findFreeKey(list.name);
            if (newKey) this.hotKeys.push({key: newKey, listId: list._id, listName: list.name})
        });
    }

    keyIsNotOccupied = (key) => !this.hotKeys.filter((elem) => elem.key === key).length;

    findFreeKey = (str) => {
        for (var i = 0, len = str.length; i < len; i++) {
            var pretender = str[i].toLowerCase();
            if ('abcdefghijklmnopqrstuvwxyz'.indexOf(pretender) !== -1 && this.keyIsNotOccupied(pretender)) return pretender;
        }
        return null;
    }

    onNameChange = (e) => {
        this.setState({ listName: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.dispatch(this.props.actions.addAList(this.state.listName));


        // var list = this.state.lists.find(list => list.name === this.state.listName)

        // if (list) {
        //     return this.openList(this.state.lists, list._id, list.name)
        // }

        // this.setState({
            // listName: ''
        // });

        // ReactDOM.render(
        //     <LoadingDecorator
        //         request={this.addAListRequest.bind(this)}
        //         callback={this.addAListCallback.bind(this, this.state.lists)}
        //         action='Adding'
        //     />, this.loaderNode
        // );

        // this.registerHotKeys();
    }

    openThisList = (listId, listName) => {
        this.props.dispatch(this.props.actions.getAList(listId));
    }

    render = () => {
        this.addHotKeys();
        return (
            <div>
                <h1>Lists</h1>
                <ListOfLists
                    lists={this.state.lists.filter(list => !list.immutable)}
                    openList={this.openThisList}
                    hotKeys={this.hotKeys}
                />
                <h3>Protected</h3>
                <ListOfLists
                    lists={this.state.lists.filter(list => list.immutable)}
                    openList={this.openThisList}
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

// export default ListsApp;

// ListsApp.propTypes = {
//     actions: PropTypes.func
// };

// const mapStateToProps = (state) => {
//     // return {
//         // mode: state.app.mode,
//         // lists: state.app.lists
//     // };
// };

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