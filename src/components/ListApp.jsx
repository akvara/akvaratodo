import React, { Component } from 'react';
import $ from 'jquery';
import config from './config.js';
import ListList from './ListList';

class ListApp extends Component {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
	        lists: [], // generate with: Array.from(Array(40)).map((e,i)=>(i).toString()),
			listName: '',
			listContent: '', 
			loaded: false
	    };
	}

	handleSubmit(e) {
 		e.preventDefault(); 		

 		$.post(
 			config.listsapi + "lists",
 			{
 				'name': this.state.listName,
 				'tasks': this.state.listContent,
 			}
 		)
		.done(function(data, textStatus, jqXHR) {
			this.loadData();
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});

    	this.setState({ 
			listName: '',
			listContent: ''
		});
	}

    removeList(id) {
		$.ajax({
			url: config.listsapi + "lists/" + id,
			type: 'DELETE'
		})
		.success(function(result) {
			this.loadData();
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
   	}	

	onNameChange(e) {
		this.setState({ listName: e.target.value });
	}

	onContentChange(e) {
		this.setState({ listContent: e.target.value });
	}

	loadData() {
		$.get(config.listsapi + "lists")
		.done(function(data, textStatus, jqXHR) {
			this.setState({ 
				lists: data ,
				loaded: true
			});
         	// console.log(data, textStatus);
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
	}

	componentWillMount() {
    	this.loadData();
  	}

	render() {

// console.log('ListApp items done~', this.props.itemsDone);
		if (!this.state.loaded)	{
			return (<div>Loading...</div>);
		}	

		return (
			<div>
				<h1>Lists</h1>
				<hr />
				<ListList 
					lists={this.state.lists} 
					delete={this.removeList.bind(this)} 
					itemsDone={this.props.itemsDone}
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
