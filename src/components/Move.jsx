import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import TaskApp from './TaskApp';
import config from '../config.js';

class Move extends Component {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: [],
			loaded: false
	    };
	}

	toAnoter (listId) {
		ReactDOM.render(<TaskApp 
			listId={listId} 
			receiving={this.props.item} 
			immutables={this.state.lists.filter((item) => item.immutable)}
			itemsDone={this.props.itemsDone} 
		/>, document.getElementById("app"));
	}

  	displayToButton (item) {
  		var listName = item.name;
  		var id = item._id;

  		return <button onClick={this.toAnoter.bind(this, id)} >To { listName }</button>
  	}

	loadData () {
		$.get(config.listsapi + "lists")
		.done(function(data, textStatus, jqXHR) {
			this.setState({ 
				lists: data,
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
// console.log("move", this.props.item);		
		return (
			<div>
				<h2>{this.props.item}</h2>
				{ this.state.lists.map((list) => this.displayToButton(list)) }
			</div>
		);
	}
}

export default Move;
