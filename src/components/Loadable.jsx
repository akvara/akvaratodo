import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import CONFIG from '../config.js';
import * as Utils from '../utils/utils.js';
import * as UrlUtils from '../utils/urlUtils.js';
import $ from 'jquery';
import _ from 'underscore';

class Loadable extends Component {
	constructor(props, context) {
	    super(props, context);

//	    this.state = {
//          Must be set in inherited classes
//	    };

        this.notYetLoadedReturn = <div><h1>...</h1></div>;
        this.loaderNode = document.getElementById('loading');
        this.appNode = document.getElementById('app');
	}

    componentWillMount() {
        this.loadData();
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

    /* callback for Loading lists */
    loadListsCallback(data) {
        this.setState({
            lists: Utils.sortArrOfObjectsByParam(data, 'updatedAt', true),
            notYetLoaded: false
        });
    }

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

    addAListCallback(lists, data) {
        this.setState({
            lists: lists.concat(data),
            notYetLoaded: false
        });
        return this.goToList(lists, data._id, data.name);
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
        dataToSave.lastAction = data.lastAction; // data.updatedAt; //      new Date();

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
            itemsToDo: dataToSave.itemsToDo,
            itemsDone: dataToSave.itemsDone, // ? dataToSave.itemsDone : [],
            immutable: dataToSave.immutable,
            updatedAt: dataToSave.lastAction,
            hightlightIndex: highlightPosition,

            prepend: null,
            notYetLoaded: false,
            task: ''
        });
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
                tasks: JSON.stringify(dataToSave.itemsToDo),
                done: JSON.stringify(dataToSave.itemsDone),
                immutable: dataToSave.immutable,
                lastAction: dataToSave.lastAction
            }
        })
        .done((data) => {
// console.log('Resolving with ', data);
            resolve(data)
        })
        .fail((err) => { reject(err) });
    }

    /* The Renderer */
    render() {
        return null;
	}
}

export default Loadable;
