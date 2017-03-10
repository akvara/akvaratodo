import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import config from '../config.js';
import Loadable from './Loadable';

import LoadingDecorator from './LoadingDecorator';
import ListList from './ListList';
import TaskApp from './TaskApp';
import Messenger from './Messenger';
import $ from 'jquery';

class ListApp extends Component {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: [],
			listName: '',
			notYetLoaded: true
	    };
        this.loaderNode = document.getElementById('loading');
	}

    componentDidMount() {
        this.load();
    }

    loadData() {        
        this.load(this.loadListsRequest, this.loadListsCallback, 'Loading ToDo lists');
    }

    load(request, callback, message) {
        ReactDOM.render(
            <LoadingDecorator 
                request={this.loadListsRequest} 
                callback={this.loadListsCallback} 
                action={'Loading ToDo lists'} 
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


	loadList(listId, name) {
		document.title = name;
		ReactDOM.render(<TaskApp 
			listId={listId} 
			immutables={this.state.lists.filter((item) => item.immutable)}
			itemsDone={this.state.itemsDone} 
		/>, document.getElementById("app"));
	}

	render() {
		if (this.state.notYetLoaded) {
			return (<div id="l"><h1>Lists</h1>v{config.version}</div>);
        }

		return (
			<div>
				<h1>Lists</h1>
				<hr />
				<ListList 
					lists={this.state.lists}
					loadList={this.loadList.bind(this)} 
					removeList={this.removeList.bind(this)} 
				/>
				<hr />
				<form onSubmit={this.handleSubmit.bind(this)}>
					<input value={this.state.listName} onChange={this.onNameChange.bind(this)} />
					<button disabled={!this.state.listName.trim()}>Add list</button>
				</form>
				<hr />
			</div>
		);
	}

}

export default ListApp;