import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ListOfLists from './ListOfLists';
import {addOrOpenAList, getAList, removeList, getListOfLists, planWeek} from '../actions/list-actions';
import {playSound} from '../utils/hotkeys';
import * as Utils from '../utils/utils.js';

class ListsApp extends Component {
    static propTypes = {
        lists: PropTypes.array.isRequired,
        actions: PropTypes.shape({
            getAList: PropTypes.func.isRequired,
            getListOfLists: PropTypes.func.isRequired,
            addOrOpenAList: PropTypes.func.isRequired,
            removeList: PropTypes.func.isRequired,
            planWeek: PropTypes.func.isRequired,
        }).isRequired
    };

    constructor(props, context) {
        super(props, context);
        let contractedList = [];
        let workingList = this.props.lists.filter(list => !list.immutable);
        workingList.map(list => {
                let dashPos = list.name.indexOf(' - ');
                if (dashPos > -1) {
                    let contractedTitle = list.name.substring(0, dashPos);
                    if (!contractedList[contractedTitle]) {
                        contractedList[contractedTitle] = {used: false, list: []}
                    }
                    contractedList[contractedTitle].list.push(list)
                }
                return null;
        });
        let displayList = [];
        workingList.map((list) => {
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
                                list: contractedList[contractedTitle].list
                            });
                        }
                    } else {
                        displayList.push(list)
                    }
                } else {
                    displayList.push(list)
                }
            return null;
        });

        console.log(displayList);

        this.state = {
            lists: displayList,
            immutableLists: this.props.lists.filter(list => list.immutable),
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
            this.listNameInput.focus();
            return;
        }
        if (pressed === 'r') {
            playSound();
            e.preventDefault();
            this.reload();
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
            console.log("********", list)
            if (!list.isList) {
                let newKey = this.findFreeKey(list.name);
                if (newKey) this.hotKeys.push({key: newKey, listId: list._id, listName: list.name})
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

    removeList = (listId) => {
        this.props.actions.removeList(listId);
    };

    handleKeyDownAtListInput = (e) => {
        if (e.keyCode === 27) {
            this.listNameInput.blur();
            this.setState({
                listName: ''
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
                        ref={(input) => { this.listNameInput = input; }}
                        value={this.state.listName}
                        onFocus={Utils.disableHotKeys.bind(this)}
                        onBlur={Utils.registerHotKeys.bind(this, this.checkKeyPressed)}
                        onKeyDown={this.handleKeyDownAtListInput}
                        onChange={this.onNameChange}
                    />
                    <button disabled={!this.state.listName.trim()}>Create new list</button>
                </form>
                <hr />
                <button onClick={this.props.actions.planWeek}>Plan week</button>
                <button onClick={this.reload}>
                    <span className={'glyphicon glyphicon-refresh'}
                          aria-hidden="true">
                    </span> <u>R</u>eload
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            getAList: getAList,
            getListOfLists: getListOfLists,
            addOrOpenAList: addOrOpenAList,
            removeList: removeList,
            planWeek: planWeek
        }, dispatch),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(ListsApp);
