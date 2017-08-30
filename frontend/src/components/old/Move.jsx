import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';
import TaskApp from './TaskApp';
import LoadingDecorator from './LoadingDecorator';
import * as Utils from '../utils/utils.js';

class Move extends Loadable {
	constructor(props, context) {
	    super(props, context);

        this.state = props.state;
	    this.state.notYetLoaded = true;
        this.state.listName = '';

	    this.movingItem = this.state.itemsToDo[props.itemIndex];
	}

	/* Entry point */
    loadData() {
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading lists', 'Lists loaded');
    }

    /* Returns back to the same list */
    back() {
        ReactDOM.render(<TaskApp
            list={this.props.fromList}
            immutables={this.state.lists.filter((list) => list.immutable)}
            itemsDone={this.state.itemsDone}
        />, this.appNode);
    }

	/* Moves item to another list */
	move(toListId, listName, copy) {
  		var list = {id: toListId, name: listName};
        if (copy) {
            this.saveTaskListCallback(list)
        } else {
            var dataToSave = this.prepareClone();
            dataToSave.list = {id: this.props.fromList.id, name: this.props.fromList.name};;
            dataToSave.itemsToDo = Utils.removeItem(this.state.itemsToDo, this.props.itemIndex);
            // saving donor list. Need Check here !!!
            this.saveTaskList(this.props.fromList.id, dataToSave, this.saveTaskListCallback.bind(this, list));
        }
	}

	/* Callback for save task request */
    saveTaskListCallback(list) {
		ReactDOM.render(<TaskApp
			list={list}
            previousList={this.props.fromList}
			prepend={this.movingItem}
			immutables={this.state.lists.filter((aList) => aList.immutable)}
			itemsDone={this.state.itemsDone}
		/>, this.appNode);
	}

	/* To List */
  	displayToButton(list) {
  		if (list._id === this.props.fromList.id) return null;
  		return <tr key={'tr' + list._id}>
            <td>
                To: <strong>{ list.name }</strong>
            </td>
            <td>
                <button onClick={this.move.bind(this, list._id, list.name, false)} >Move</button>
                &nbsp;
                <button onClick={this.move.bind(this, list._id, list.name, true)} >Copy</button>
            </td>
        </tr>
  	}

    toNewListCallback(data) {
        this.move(data._id, data.name, false);
    }

    handleSubmit(e) {
        e.preventDefault();

        var list = this.state.lists.find(list => list.name === this.state.listName)

        if (list) {
            return this.move(list._id, list.name, false)
        }

        this.setState({
            listName: ''
        });

        ReactDOM.render(
            <LoadingDecorator
                request={this.addAListRequest.bind(this)}
                callback={this.toNewListCallback.bind(this)}
                action='Adding'
            />, this.loaderNode
        );
    }

    onNameChange(e) {
        this.setState({ listName: e.target.value });
    }

  	/* The Renderer */
	render() {
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

		return (
			<div>
                <hr />
                <h2>{this.movingItem}</h2>
                <table className="table table-hover">
                    <tbody>
                        { this.state.lists.filter((list) => !list.immutable).map((list) => this.displayToButton(list)) }
                    </tbody>
                </table>
                <hr />
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input className="list-input" value={this.state.listName} onChange={this.onNameChange.bind(this)} />
                    <button disabled={!this.state.listName.trim()}>Create new list</button>
                </form>
				<hr />
                <button onClick={this.back.bind(this)} >Back</button>
			</div>
		);
	}
}

export default Move;