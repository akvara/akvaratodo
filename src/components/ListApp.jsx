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

    componentDidMount() {
// console.log('ListApp Did Mount');
    }

    componentWillUnmount() {
// console.log('ListApp Did Un');
    }
    componentDidUpdate() {
// console.log('ListApp Did Update');
    }

    loadData() {
        document.title = "ToDo lists";
        if (!this.state.lists) this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.');
    }

	handleSubmit(e) {
 		e.preventDefault();

		var list = this.state.lists.find(list => list.name === this.state.listName)

		if (list) {
			return this.loadList(this.state.lists, this.state.itemsDone, list._id, list.name)
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

	loadList(lists, itemsDone, listId, listName) {
        ReactDOM.render(<TaskApp
            listId={listId}
            listName={listName}
            immutables={lists.filter((item) => item.immutable)}
            itemsDone={itemsDone}
        />, this.appNode);
    }

	render() {
		if (this.state.notYetLoaded) return this.notYetLoadedReturn;

		return (
			<div>
				<h1>Lists</h1>
				<hr />
				<ListList
					lists={this.state.lists}
					loadList={this.loadList.bind(this, this.state.lists, this.state.itemsDone)}
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
