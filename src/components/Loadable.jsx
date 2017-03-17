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

    loadAListCallback(data) {
        let itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];
        if (this.state.prepend) {
            itemsToDo = _.unique([this.state.prepend].concat(itemsToDo));
        }

        this.setState({
            listId: data._id,
            listName: data.name,
            immutable: data.immutable,
            itemsToDo: itemsToDo,
            lastAction: data.lastAction,
            prepend: null,
            notYetLoaded: false,
        }, this.state.prepend ? this.saveTaskList : null);

        document.title = data.name;
    }

    loadAForeignListCallback(data) {
        let loadedItems = data.tasks ? JSON.parse(data.tasks) : [];
        this.setState({
            itemsToDo: _.unique(loadedItems.concat(this.state.itemsToDo)),
            prepend: null,
            notYetLoaded: false,
        }, this.saveTaskList);
    }

    saveTaskList(dataToSave, callback) {
        ReactDOM.render(
            <LoadingDecorator
                request={this.saveTaskListRequest.bind(this, dataToSave) }
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
                finishedMessage='Ok'
            />, this.loaderNode
        );
    }

    checkCallback(lastAction, callback, data) {
        if (data.lastAction===undefined || this.state.lastAction === data.lastAction) {
                    console.log('goooooood', callback);
                    callback(data);
        }  else {
                    console.log('wrong!!!!');
                    /////// Reload list and then add
                    // this.reloadData();
        }
    }

    saveTaskListRequest(dataToSave, resolve, reject) {
        $.ajax({
            url: UrlUtils.getAListUrl(dataToSave.listId),
            type: 'PUT',
            data: {
                tasks: JSON.stringify(dataToSave.tasks),
                immutable: dataToSave.immutable,
                lastAction: dataToSave.lastAction,
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
