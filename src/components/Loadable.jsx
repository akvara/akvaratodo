import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import Messenger from './Messenger';
import sortArrOfObjectsByParam from '../utils/utils.js';
import config from '../config.js';
import $ from 'jquery';

class Loadable extends Component {
	constructor(props, context) {
	    super(props, context);

//	    this.state = {
//          Must be set in inherited classes
//	    };

        this.loaderNode = document.getElementById('loading');
        this.appNode = document.getElementById('app');

     // console.log('React.findDOMNode', ReactDOM.findDOMNode(document.getElementById('loading')));
	 //    this.loadingNode = React.findDOMNode();
	}

    componentWillMount() {
        this.loadData();
    }

    load(request, callback, actionMessage) {
        ReactDOM.render(
            <LoadingDecorator
                request={request}
                callback={callback}
                actionMessage={actionMessage}
            />, this.loaderNode
        );
    }

    loadListsRequest(resolve, reject) {
// console.log("loadListsRequest", config.apiHost + config.listsAddon)
        return $.get(config.apiHost + config.listsAddon)
            .done((data) => {
                resolve(data);
            })
            .fail((err) => {
                reject(err)
            });
    }

    loadListsCallback(data) {
// console.log("loadListsCallback result", data);
        this.setState({
            lists: sortArrOfObjectsByParam(data, 'updatedAt', true),
            notYetLoaded: false
        });
        ReactDOM.render(<Messenger info="Lists loaded." />, this.loaderNode);
    }

    addAListRequest(resolve, reject) {
        return $.post(
            config.apiHost + config.listsAddon,
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
        ReactDOM.render(<Messenger info="Added." />, this.loaderNode);
        return this.loadList(lists, [' Transferring of ItemsDone -> To Be Done'], data._id, data.name);
    }

    removeListRequest(listId, resolve, reject) {
        return $.ajax({
            url: config.apiHost + config.listAddon + listId,
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
        ReactDOM.render(<Messenger info="Removed." />, this.loaderNode);
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
        return $.get(config.apiHost + config.listsAddon + "/" + listId)
            .done((data) => { resolve(data) })
            .fail((err) => { reject(err) });
    }

    loadAListCallback(data) {
        let itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];

        if (this.state.prepend) {
            itemsToDo = [this.state.prepend].concat(itemsToDo);
        }

        this.setState({
            listName: data.name,
            immutable: data.immutable,
            itemsToDo: itemsToDo,
            prepend: null,
            notYetLoaded: false,
        }, this.state.prepend ? this.save : null);

        ReactDOM.render(<Messenger info="Loaded." />, this.loaderNode);
    }

    render() {
        return null;
	}

}

export default Loadable;
