import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';
import TaskApp from './TaskApp';
import * as Utils from '../utils/utils.js';

class Move extends Loadable {
	constructor(props, context) {
	    super(props, context);

        this.state = props.state;
	    this.state.notYetLoaded = true;

	    this.movingItem = this.state.itemsToDo[props.itemIndex];
	}

	/* Entry point */
    loadData() {
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading lists', 'Lists loaded');
    }

	/* Moves item back to the same list (actually, changes nothing) or to another list */
	toAnoter(toListId, listName) {
  		var list = {id: toListId, name: listName};
		if (toListId === this.props.fromList.id) {
			ReactDOM.render(<TaskApp
				list={list}
				immutables={this.state.lists.filter((list) => list.immutable)}
				itemsDone={this.state.itemsDone}
			/>, this.appNode);
		} else {
            var dataToSave = this.prepareClone();
            dataToSave.list = {id: toListId, name: listName};;
            dataToSave.itemsToDo = Utils.removeItem(this.state.itemsToDo, this.props.itemIndex);

            // saving donor list. Need Check here !!!
       		this.saveTaskList(this.props.fromList.id, dataToSave, this.saveTaskListCallback.bind(this, list));
		}
	}

	/* Callback for save task request */
    saveTaskListCallback(list) {
		ReactDOM.render(<TaskApp
			list={list}
			prepend={this.movingItem}
			immutables={this.state.lists.filter((aList) => aList.immutable)}
			itemsDone={this.state.itemsDone}
		/>, this.appNode);
	}

	/* To List */
  	displayToButton(list) {
  		var btnMsg = "To";
  		if (list._id === this.props.fromList.id) btnMsg = "Back to";
  		return <button key={'btn'+list._id} onClick={this.toAnoter.bind(this, list._id, list.name)} >{btnMsg} <strong>{ list.name }</strong></button>
  	}

  	/* The Renderer */
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
