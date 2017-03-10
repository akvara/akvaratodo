import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';

import LoadingDecorator from './LoadingDecorator';
// import Messenger from './Messenger';
import ListList from './ListList';
import TaskApp from './TaskApp';
// import config from '../config.js';
// import $ from 'jquery';

class ListApp extends Loadable {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: [],
			listName: '',
	    };
        console.log('this.state', this.state);        
	}

    loadData() {
console.log('this.loadListsRequest', this.loadListsRequest);               
console.log('this.loadListsCallback', this.loadListsCallback);               
        this.load(this.loadListsRequest, this.loadListsCallback, 'Loading ToDo lists');
    }

	handleSubmit(e) {
 		e.preventDefault(); 	

		var list = this.state.lists.find(list => list.name === this.state.listName)

		if (list) {
			return this.loadList(list._id)
		}
        this.setState({
            listName: '',
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


	loadList(listId) {
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