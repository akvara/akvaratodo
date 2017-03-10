import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import Messenger from './Messenger';
import ListList from './ListList';
import TaskApp from './TaskApp';
import config from '../config.js';
import $ from 'jquery';

class Loadable extends Component {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: [],
			listName: '',
			notYetLoaded: true
	    };

        this.loaderNode = document.getElementById('loading');
// console.log('React.findDOMNode', ReactDOM.findDOMNode(document.getElementById('app')));
	 //    this.loadingNode = React.findDOMNode();
	}

    componentDidMount() {
        this.loadData();
    }

    load(request, callback, message) {
        ReactDOM.render(
            <LoadingDecorator 
                request={request} 
                callback={callback} 
                action={message} 
            />, this.loaderNode
        ).bind(this);
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
        this.setState({ 
            lists: data, 
            notYetLoaded: false 
        });
        ReactDOM.render(<Messenger info="Lists loaded." />, this.loaderNode);    
    }

	onNameChange(e) {
		this.setState({ listName: e.target.value });
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

	addAListCallback(data) { 
        this.setState({ 
            lists: this.state.lists.concat(data), 
            notYetLoaded: false 
        });
        ReactDOM.render(<Messenger info="Added." />, this.loaderNode);
        this.loadList(data._id);    
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

	render() {
        return null;
	}

}

export default Loadable;