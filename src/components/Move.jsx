import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';
import TaskApp from './TaskApp';
import * as Utils from '../utils/utils.js';

class Move extends Loadable {

	constructor(props, context) {
	    super(props, context);
	    this.state = props.state;

	    this.movingItem = props.state.itemsToDo[props.itemIndex];
	    this.state.itemsToDo = Utils.removeItem(props.state.itemsToDo, props.itemIndex);
	    this.state.notYetLoaded = true;
	    this.state.finishedSaving = false;
	}

    componentDidUpdate() {
    	if (this.state.finishedSaving) {
    		this.props.callback(this.state.val);
    	}
    }

	componentDidMount() {
// console.log('Move Did Mount');

    }

    componentWillUnmount() {
// console.log('Move Did Un');
    }

	toAnoter(toListId, listName) {
		if (toListId === this.props.fromList) {
			ReactDOM.render(<TaskApp
				listId={this.props.fromList}
				immutables={this.state.lists.filter((list) => list.immutable)}
				itemsDone={this.props.itemsDone}
			/>, this.appNode);
		} else {
			this.toListId = toListId;
			this.saveTaskList();
		}
	}

    saveTaskListCallback() {
		ReactDOM.render(<TaskApp
			listId={this.toListId}
			prepend={this.movingItem}
			immutables={this.state.lists.filter((list) => list.immutable)}
			itemsDone={this.state.itemsDone}
		/>, this.appNode);
	}


    loadData() {
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading lists', 'Lists loaded');
    }

  	displayToButton(list) {
  		var btnMsg = "To";
  		if (list._id === this.props.fromList) btnMsg = "Back to";
  		return <button key={'btn'+list._id} onClick={this.toAnoter.bind(this, list._id, list.name)} >{btnMsg} <strong>{ list.name }</strong></button>
  	}

	render() {
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

		return (
			<div>
				<h2>{this.movingItem}</h2>
				<hr />
				{ this.state.lists.filter((list) => !list.immutable).map((list) => this.displayToButton(list)) }
			</div>
		);
	}
}

export default Move;
