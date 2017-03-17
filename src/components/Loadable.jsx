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

    loadListsRequest(resolve, reject) {
        return $.get(UrlUtils.getListsUrl())
            .done((data) => {
                resolve(data);
            })
            .fail((err) => {
                reject(err)
            });
    }

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

    addAListCallback(lists, doneItems, data) {
        this.setState({
            lists: lists.concat(data),
            notYetLoaded: false
        });
        return this.loadList(lists, doneItems, data._id, data.name);
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

    loadAListRequest(listId, resolve, reject) {
        return $.get(UrlUtils.getAListUrl(listId))
            .done((data) => { resolve(data) })
            .fail((err) => { reject(err) });
    }

    /* Result from get(listId) */
    loadAListCallback(data) {
        var dataToSave = this.state; //{};// this.prepareClone();
        var itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];
            dataToSave.itemsToDo = itemsToDo;
            dataToSave.immutable = data.immutable;
            dataToSave.updatedAt = data.updatedAt;
            dataToSave.lastAction = data.lastAction;
        if (this.props.prepend) {
            itemsToDo = _.unique([this.state.prepend].concat(itemsToDo));
            dataToSave.itemsToDo = itemsToDo;
            let callback = this.callbackForSettingState.bind(this, 0, dataToSave, data);
            this.saveTaskList(data._id, dataToSave, callback);
        } else {
            this.callbackForSettingState(null, dataToSave, data);
        }
    }

    /* Data for setState */
    callbackForSettingState(highlightPosition, data, other) {
console.log('data', data.updatedAt);
console.log('other', other.updatedAt);
        this.setState({
            itemsToDo: data.itemsToDo,
            itemsDone: data.itemsDone,
            hightlightIndex: highlightPosition,
            immutable: data.immutable,
            updatedAt: data.updatedAt,
            lastAction: data.lastAction,

            prepend: null,
            notYetLoaded: false,
            task: ''
        });
    };


    /* Request putting task data and call callback on success */
    saveTaskList(listId, dataToSave, callback) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.saveTaskListRequest.bind(this, listId, dataToSave) }
                callback={callback.bind(this, dataToSave)}
                actionMessage='Saving'
                finishedMessage='Saved'
            />, this.loaderNode
        )
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
    checkCallback(lastAction, callback, data) {

                    // callback(data);


        var dataLast = data.lastAction ? data.lastAction.substr(11, 8) : ' '

console.log('check1: param', lastAction.substr(11, 8));
console.log('check1: data.lastAction', dataLast);
console.log('check3: data.updatedAt',  data.updatedAt.substr(11, 8));
// console.log('check4:', lastAction, last);
        if (lastAction === data.lastAction) {
console.log('goooooood', callback);
                    callback(data);
        }  else {
console.log('wrong!!!!');
//                     console.log('lastAction', lastAction);
                    // console.log('===?', lastAction === data.lastAction);
                    /////// Reload list and then add
                  // this.reloadData();
        }
    }

    /* cloning State */
    prepareClone() {
        var clone = {};
        clone.list = this.props.list;
        clone.itemsToDo = this.state.itemsToDo.slice();
        clone.itemsDone = this.state.itemsDone.slice();
        clone.immutable = this.state.immutable;
        clone.updatedAt = this.state.updatedAt;
        clone.lastAction = new Date().toISOString();

        return clone;
    }

    /* Request to PUT task data */
    saveTaskListRequest(listId, dataToSave, resolve, reject) {
        console.log("saveTaskListRequest", dataToSave);
        $.ajax({
            url: UrlUtils.getAListUrl(listId),
            type: 'PUT',
            data: {
                // Saving tasks as string
                tasks: JSON.stringify(dataToSave.itemsToDo),
                immutable: dataToSave.immutable,
                lastAction: dataToSave.lastAction
            }
        })
        .done((data) => { resolve(data) })
        .fail((err) => { reject(err) });
    }

    render() {
        return null;
	}

}

export default Loadable;
