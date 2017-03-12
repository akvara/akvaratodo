import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';
import TaskApp from './TaskApp';
import LoadingDecorator from './LoadingDecorator';
import ListList from './ListList';

class ListApp extends Loadable {
	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: [],
			listName: '',
			notYetLoaded: true
	    };
	}

    componentDidMount() {
console.log('ListApp Did Mount');
    }

    componentWillUnmount() {
console.log('ListApp Did Un');
    }

    loadData() {
        document.title = "ToDo lists";
        this.load(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists');
    }

	handleSubmit(e) {
 		e.preventDefault();

		var list = this.state.lists.find(list => list.name === this.state.listName)

		if (list) {
			// (lists, itemsDone, listId, listName)
			return this.loadList(this.state.lists, this.state.itemsDone, list._id, list.name)
		}
        this.setState({
            listName: '',
            // notYetLoaded: true
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
		if (this.state.notYetLoaded) {
			return (<div id="l"><h1>Lists</h1></div>);
        }

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
