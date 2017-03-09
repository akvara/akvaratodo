import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import config from './config.js';
import ListList from './ListList';
import TaskApp from './TaskApp';

class ListApp extends Component {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
	        lists: [], // generate with: Array.from(Array(40)).map((e,i)=>(i).toString()),
			listName: '',
			listContent: '', 
			loaded: false,
			loadingString: ''
	    };
	}

	handleSubmit(e) {
 		e.preventDefault(); 	

		var list = this.state.lists.find(list => list.name === this.state.listName)

		if (list) {
			return this.loadList(list._id)
		}

 		$.post(
 			config.listsapi + "lists",
 			{
 				'name': this.state.listName,
 				'tasks': this.state.listContent,
 			}
 		)
		.done((data, textStatus, jqXHR) => this.loadList(data._id))
        .fail((jqXHR, textStatus, errorThrown) => console.log(textStatus));
	}

    removeList(id) {
		$.ajax({
			url: config.listsapi + "lists/" + id,
			type: 'DELETE'
		})
		.done((result) => this.loadData())
        .fail((jqXHR, textStatus, errorThrown) => console.log(textStatus));
   	}	

   	loadList(listId) {
var immutables = this.state.lists.filter((item) => item.immutable);
console.log('immutables ', immutables);		
		ReactDOM.render(<TaskApp 
			listId={listId} 
			immutables={this.state.lists.filter((item) => item.immutable)}
			itemsDone={this.state.itemsDone} 
		/>, document.getElementById("app"));
	}

	onNameChange(e) {
		this.setState({ listName: e.target.value });
	}

	onContentChange(e) {
		this.setState({ listContent: e.target.value });
	}

	tick() {
		var loadingString = '.' + this.state.loadingString.length < 40 ? this.state.loadingString : '';
		this.setState({loadingString});
	}

	loadData() {
		this.interval = setInterval(this.tick.bind(this, this.loadingString), 100);

		$.get(config.listsapi + "lists")
		.done((data, textStatus, jqXHR) =>
			this.setState({ 
				lists: data,
				loaded: true,
				loadingString: ''
			})
        )
        .fail((jqXHR, textStatus, errorThrown) => {
        	console.log(textStatus);			
        	this.setState({ 
				loadingString: ' error'
			})
        })
        .always(() => clearInterval(this.interval));
	}

	componentWillMount() {
    	this.loadData();
  	}

	render() {

// console.log('ListApp items done~', this.props.itemsDone);
		if (!this.state.loaded)	{
			return (<div>Loading {this.state.loadingString}</div>);
		}	

		return (
			<div>
				<h1>Lists</h1>
				<hr />
				<ListList 
					lists={this.state.lists} 
					removeList={this.removeList.bind(this)} 
					loadList={this.loadList.bind(this)} 
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
