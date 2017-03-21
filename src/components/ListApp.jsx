import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';
import LoadingDecorator from './LoadingDecorator';
import TaskApp from './TaskApp';
import ListList from './ListList';

class ListApp extends Loadable {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: this.props.lists || null,
			listName: '',
			notYetLoaded: !this.props.lists
	    };
	}

    loadData() {
        document.title = "ToDo lists";
        if (!this.state.lists) this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.');
    }

	handleSubmit(e) {
 		e.preventDefault();

		var list = this.state.lists.find(list => list.name === this.state.listName)

		if (list) {
			return this.openList(this.state.lists, list._id, list.name)
		}

        this.setState({
            listName: ''
        });

        ReactDOM.render(
            <LoadingDecorator
                request={this.addAListRequest.bind(this)}
                callback={this.addAListCallback.bind(this, this.state.lists)}
                action='Adding'
            />, this.loaderNode
        );
	}

	onNameChange(e) {
		this.setState({ listName: e.target.value });
	}

    /* Go to selected list */
	openList(lists, listId, listName) {
        var list = {id: listId, name: listName};
        ReactDOM.render(<TaskApp
            list={list}
            immutables={lists.filter((item) => item.immutable)}
        />, this.appNode);
    }

    /* The Renderer */
	render() {
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

    		return (
			<div>
				<h1>Lists</h1>
                <ListList
                    lists={this.state.lists.filter(list => !list.immutable)}
                    openList={this.openList.bind(this, this.state.lists)}
                    moveToList={this.openList.bind(this, this.state.lists)}
                    removeList={this.removeList.bind(this)}
                    action={this.props.action}
                />
                <h3>Protected</h3>
                <ListList
                    lists={this.state.lists.filter(list => list.immutable)}
                    openList={this.openList.bind(this, this.state.lists)}
                    moveToList={this.openList.bind(this, this.state.lists)}
                    removeList={this.removeList.bind(this)}
                    action={this.props.action}
                />
				<form onSubmit={this.handleSubmit.bind(this)}>
					<input className="list-input" value={this.state.listName} onChange={this.onNameChange.bind(this)} />
					<button disabled={!this.state.listName.trim()}>Create new list</button>
				</form>
			</div>
		);
	}
}

export default ListApp;
