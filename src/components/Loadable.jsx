import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import * as Utils from '../utils/utils.js';
import CONFIG from '../config.js';
import $ from 'jquery';
import _ from 'underscore';

class Loadable extends Component {
	constructor(props, context) {
	    super(props, context);

//	    this.state = {
//          Must be set in inherited classes
//	    };

        this.loaderNode = document.getElementById('loading');
        this.appNode = document.getElementById('app');
        this.notYetLoadedReturn = <div><h1>...</h1></div>;

     // console.log('React.findDOMNode', ReactDOM.findDOMNode(document.getElementById('loading')));
	 //    this.loadingNode = React.findDOMNode();
	}

    componentWillMount() {
        this.loadData();
    }

    componentDidUpdate() {
// console.log('Loadable Did Update', this.state);
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
        return $.get(CONFIG.apiHost + CONFIG.listsAddon)
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
        // ReactDOM.render(<Messenger info="Lists loaded." />, this.loaderNode);
    }

    addAListRequest(resolve, reject) {
        return $.post(
            CONFIG.apiHost + CONFIG.listsAddon,
            {
                'name': this.state.listName
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
        // ReactDOM.render(<Messenger info="Added." />, this.loaderNode);
        return this.loadList(lists, [' Transferring of ItemsDone -> To Be Done'], data._id, data.name);
    }

    removeListRequest(listId, resolve, reject) {
        return $.ajax({
            url: CONFIG.apiHost + CONFIG.listAddon + listId,
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
        // ReactDOM.render(<Messenger info="Removed." />, this.loaderNode);
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
        return $.get(CONFIG.apiHost + CONFIG.listsAddon + "/" + listId)
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
            prepend: null,
            notYetLoaded: false,
        }, this.state.prepend ? this.saveTask : null);

        document.title = data.name;
        // ReactDOM.render(<Messenger info={data.name + " loaded."} />, this.loaderNode);
    }

    loadAForeignListCallback(data) {
        let loadedItems = data.tasks ? JSON.parse(data.tasks) : [];
        this.setState({
            itemsToDo: _.unique(loadedItems.concat(this.state.itemsToDo)),
            prepend: null,
            notYetLoaded: false,
        });

        // ReactDOM.render(<Messenger info={data.name + " loaded."} />, this.loaderNode);
    }


    saveTask() {
        ReactDOM.render(
            <LoadingDecorator
                request={this.saveTaskRequest.bind(this, this.state.listId)}
                callback={this.saveTaskCallback.bind(this)}
                actionMessage='Saving'
                finishedMessage='Saved'
            />, this.loaderNode
        );
    }

    saveTaskRequest(listId, resolve, reject) {
        return $.ajax({
            url: CONFIG.apiHost + CONFIG.listsAddon + "/" + listId,
            type: 'PUT',
            data: {
                tasks: JSON.stringify(this.state.itemsToDo),
                immutable: this.state.immutable,
            }
        })
        .done((data) => { resolve(data) })
        .fail((err) => { reject(err) });
    }

    saveTaskCallback() {
        // ReactDOM.render(<Messenger info="Saved." />, this.loaderNode);
    }

    render() {
        return null;
	}

}

export default Loadable;
