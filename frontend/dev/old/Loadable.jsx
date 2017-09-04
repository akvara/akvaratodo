import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import CONFIG from '../config.js';
import * as Utils from '../utils/utils.js';
import * as UrlUtils from '../utils/urlUtils.js';
import $ from 'jquery';
import _ from 'underscore';
import { Spinner } from './Spinner';

class Loadable extends Component {
	constructor(props, context) {
	    super(props, context);

        this.notYetLoadedReturn = Spinner();
        this.loaderNode = document.getElementById('loading');
        this.appNode = document.getElementById('app');
        this.tmpNode = document.getElementById('tmp');
	}

    /* Entry point for children classes */
    componentWillMount() {
        this.loadData();
    }

    registerHotKeys() {
        // console.log("hotkeys ENabled");
        $(document).on("keypress", (e) => this.checkKeyPressed(e) );
    }

    disableHotKeys() {
        // console.log("hotkeys disabled");
        $(document).off("keypress");
    }

    // ----- ListApp part -----

    /* Loading lists */
    loadLists(request, callback, actionMessage, finishedMessage) {
        ReactDOM.render(
            <LoadingDecorator
                request={request}
                callback={callback}
                actionMessage={actionMessage}
                finishedMessage={finishedMessage}
            />, this.loaderNode
        );
    }

    /* Request for Loading lists */
    loadListsRequest(resolve, reject) {
        return $.get(UrlUtils.getListsUrl())
            .done((data) => {
                resolve(data);
            })
            .fail((err) => {
                reject(err)
            });
    }

    /* Callback for Loading lists */
    loadListsCallback(data) {
        this.setState({
            lists: Utils.sortArrOfObjectsByParam(data, 'updatedAt', true),
            notYetLoaded: false
        });
    }

    /* Request for Loading lists */
    addAListRequest(resolve, reject) {
        return $.post(
            UrlUtils.getListsUrl(),
            {
                'name': this.state.listName,
                'userId': CONFIG.user.id
            })
            .done((data) => {
                resolve(data);
            })
            .fail((err) => {
                reject(err)
            });
    }

    /* Callback for Loading lists */
    addAListCallback(lists, data) {
        this.setState({
            lists: lists.concat(data),
            notYetLoaded: false
        });
        return this.openList(lists, data._id, data.name);
    }

    removeListRequest(listId, resolve, reject) {
        return $.ajax({
            url: UrlUtils.getAListUrl(listId),
            type: 'DELETE'
        })
        .done((data) => {
            resolve(data);
        })
        .fail((err) => {
            reject(err)
        });
    }

    removeListCallback(listId) {
        this.setState({ lists: this.state.lists.filter(list => list._id !== listId) });
    }

    removeList(listId) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.removeListRequest.bind(this, listId)}
                callback={this.removeListCallback.bind(this, listId)}
                action='Removing'
                finishedMessage='Removed.'

            />, this.loaderNode);
    }

    // ----- TaskApp part -----
    loadAListRequest(listId, resolve, reject) {
        return $.get(UrlUtils.getAListUrl(listId))
            .done((data) => { resolve(data) })
            .fail((err) => { reject(err) });
    }

    /* Result from get(listId) */
    loadAListCallback(data) {
        var dataToSave = {};
        dataToSave.itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];
        dataToSave.itemsDone = data.done ? JSON.parse(data.done) : [];
        dataToSave.immutable = data.immutable;
        dataToSave.list = { id: data._id, name: data.name };
        dataToSave.lastAction = data.lastAction;

        if (this.props.prepend) {
            dataToSave.itemsToDo = _.unique([this.state.prepend].concat(dataToSave.itemsToDo));
            let callback = this.callbackForSettingState.bind(this, 0, dataToSave);
            this.saveTaskList(data._id, dataToSave, callback);
        } else {
            this.callbackForSettingState(null, dataToSave, data);
        }
    }

    /* Data for setState */
    callbackForSettingState(highlightPosition, dataToSave, responseData) {
        this.setState({
            listName:  dataToSave.list.name,
            itemsToDo: dataToSave.itemsToDo,
            itemsDone: dataToSave.itemsDone,
            immutable: dataToSave.immutable,
            updatedAt: dataToSave.lastAction,
            hightlightIndex: highlightPosition,

            prepend: null,
            listNameOnEdit: false,
            notYetLoaded: false,
            task: ''
        });
        return null;
    };

    /* Request putting task data and call callback on success */
    saveTaskList(listId, dataToSave, callback) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.saveTaskListRequest.bind(this, listId, dataToSave)}
                callback={callback.bind(this)}
                actionMessage='Saving'
                finishedMessage='Saved'
            />, this.loaderNode
        )
    }

    checkWrapper(dataToSave, callback) {
        this.checkIfSame(this.props.list.id, this.state.updatedAt, this.saveTaskList.bind(this, this.props.list.id, dataToSave, callback));
    }

    checkIfSame(listId, lastAction, callback) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.loadAListRequest.bind(this, listId)}
                callback={this.checkCallback.bind(this, lastAction, callback)}
                actionMessage='Checking'
                finishedMessage='Data conflict, please reload'
            />, this.loaderNode
        );
    }

    /* Callback after date check() */
    checkCallback(lastAction, callback, data, other) {
        if (data.lastAction === undefined || lastAction === data.lastAction ) {
            callback(data);
        }  else {
            console.log('Sombeody has altered task list!');
        }
    }

    /* cloning State */
    prepareClone() {
        var clone = {};
        clone.list = this.props.list;
        clone.itemsToDo = this.state.itemsToDo.slice();
        clone.itemsDone = this.state.itemsDone.slice();
        clone.immutable = this.state.immutable;
        clone.lastAction = new Date().toISOString();

        return clone;
    }

    /* Request to PUT task data */
    saveTaskListRequest(listId, dataToSave, resolve, reject) {
        $.ajax({
            url: UrlUtils.getAListUrl(listId),
            type: 'PUT',
            data: {
                // Saving tasks as string
                name: dataToSave.list.name.trim(),
                tasks: JSON.stringify(dataToSave.itemsToDo),
                done: JSON.stringify(dataToSave.itemsDone),
                immutable: dataToSave.immutable,
                lastAction: dataToSave.lastAction
            }
        })
        .done((data) => {
            resolve(data)
        })
        .fail((err) => { reject(err) });
    }

    playSound() {
        var sound = document.getElementById('clickSound');
        sound.play()
    }

    /* The Renderer */
    render() {
        return null;
	}
}

export default Loadable;