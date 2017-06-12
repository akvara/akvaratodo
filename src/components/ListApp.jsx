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

        this.hotKeys = [{ key: 'A', listId: null, listName: null }]; // reserved hotkey
	}

    componentWillUnmount() {
        this.disableHotKeys();
    }


    loadData() {
        document.title = "ToDo lists";
        if (!this.state.lists) this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.');
    }

    addHotKeys() {
        this.state.lists.forEach((list) => {
            var newKey = this.findFreeKey(list.name);
            if (newKey) this.hotKeys.push({key: newKey, listId: list._id, listName: list.name})
        });

        this.registerHotKeys();
    }

    keyIsNotOccupied(key) {
        return !this.hotKeys.filter((elem) => elem.key === key).length;
    }

    findFreeKey(str) {
        for (var i = 0, len = str.length; i < len; i++) {
            var pretender = str[i].toUpperCase();
            if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(pretender) !== -1 && this.keyIsNotOccupied(pretender)) return pretender;
        }
        return null;
    }

    checkKeyPressed(e) {
        var pressed = String.fromCharCode(e.which);
        if (pressed === 'A') {
            e.preventDefault();
            this.nameInput.focus();
            return;
        }
        this.hotKeys.forEach(function (k) {
                if (k.key === pressed) this.openList(this.state.lists, k.listId, k.listName);
            }.bind(this)
        );
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

        this.registerHotKeys();

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
        this.addHotKeys();

    		return (
			<div>
				<h1>Lists</h1>
                <ListList
                    lists={this.state.lists.filter(list => !list.immutable)}
                    openList={this.openList.bind(this, this.state.lists)}
                    hotKeys={this.hotKeys}
                    moveToList={this.openList.bind(this, this.state.lists)}
                    removeList={this.removeList.bind(this)}
                />
                <h3>Protected</h3>
                <ListList
                    lists={this.state.lists.filter(list => list.immutable)}
                    openList={this.openList.bind(this, this.state.lists)}
                    moveToList={this.openList.bind(this, this.state.lists)}
                    removeList={this.removeList.bind(this)}
                />
				<form onSubmit={this.handleSubmit.bind(this)}>
					<input
                        ref={(input) => { this.nameInput = input; }}
                        onFocus={this.disableHotKeys.bind(this)}
                        onBlur={this.registerHotKeys.bind(this)}
                        className="list-input"
                        value={this.state.listName}
                        onChange={this.onNameChange.bind(this)}
                    />
					<button disabled={!this.state.listName.trim()}>Create new list</button>
				</form>
			</div>
		);
	}
}

export default ListApp;

