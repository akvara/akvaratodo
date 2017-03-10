import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import Messenger from './Messenger';
import ListList from './ListList';
import TaskApp from './TaskApp';
import config from '../config.js';
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
// console.log('React.findDOMNode', ReactDOM.findDOMNode(document.getElementById('app')));
	 //    this.loadingNode = React.findDOMNode();
	}

    componentWillMount() {
console.log('List App Will Mount');
    }

    componentDidMount() {
console.log('List App Did Mount');
        this.loadData();
    }

    componentWillUnmount() {
console.log('List App Did Un');
    }

    loadData() {
        ReactDOM.render(
            <LoadingDecorator 
                request={this.loadListsRequest} 
                callback={this.loadListsCallback.bind(this)} 
                action='Loading ToDo lists' 
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

	handleSubmit(e) {
 		e.preventDefault(); 	

		var list = this.state.lists.find(list => list.name === this.state.listName)

		if (list) {
			return this.loadList(list._id)
		}
        this.setState({
            listName: '',
            // notYetLoaded: true
        }); 

        ReactDOM.render(
            <LoadingDecorator 
                request={this.addAListRequest.bind(this)} 
                callback={this.addAListCallback.bind(this)} 
                action='Adding' 

            />, this.loaderNode
        );
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

	loadList(listId) {
// var immutables = this.state.lists.filter((item) => item.immutable);
// console.log('immutables ', immutables);		
		ReactDOM.render(<TaskApp 
			listId={listId} 
			immutables={this.state.lists.filter((item) => item.immutable)}
			itemsDone={this.state.itemsDone} 
		/>, document.getElementById("app"));
	}

	render() {
		if (this.state.notYetLoaded) {
			return (<div id="l"><h1>Lists</h1></div>);
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