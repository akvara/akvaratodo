import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import Messenger from './Messenger';
import TaskApp from './TaskApp';
import config from '../config.js';
import $ from 'jquery';

class Loadable extends Component {
	constructor(props, context) {
	    super(props, context);

//	    this.state = {
//          Must be set in inherited classes
//	    };

        this.loaderNode = document.getElementById('loading');
     // console.log('React.findDOMNode', ReactDOM.findDOMNode(document.getElementById('loading')));
	 //    this.loadingNode = React.findDOMNode();
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
        return $.get(config.apiHost + config.listsAddon)
            .done((data) => {
                resolve(data);
            })
            .fail((err) => {
                reject(err)
            });
    }

    loadListsCallback(data) { 
        console.log('loadListsCallback ', data);        
        this.setState({ 
            lists: data, 
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

    loadList(lists, itemsDone, listId, listName) {
        document.title = listName;
        ReactDOM.render(<TaskApp 
            listId={listId} 
            immutables={lists.filter((item) => item.immutable)}
            itemsDone={itemsDone} 
        />, document.getElementById("app"));
    }

    render() {
        return null;
	}

}

export default Loadable;
