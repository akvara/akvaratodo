import React from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';
import Loadable from './Loadable';
import User from './User';
import Settings from './Settings';
import ListApp from './ListApp';
import TaskApp from './TaskApp';
import * as Utils from '../utils/utils.js';

class App extends Loadable {
    constructor(props, context) {
        super(props, context);

        this.state = {
            lists: [],
        };
        this.userNode = document.getElementById('user');
    }

    loadListsCallback(data) {
        var lists = Utils.sortArrOfObjectsByParam(data, 'updatedAt', true);

        ReactDOM.render(<User lists={lists} settings={this.settings.bind(this)} />, this.userNode);

        var current = lists.find((item)  => item.name === CONFIG.user.loadListIfExists);
        if (current) {
            ReactDOM.render(<TaskApp
                listId={current._id}
                listName={current.name}
                immutables={lists.filter((item) => item.immutable)}
            />, this.appNode);
        } else {
            ReactDOM.render(<ListApp lists={lists}/>, this.appNode);
        }
   }

    loadData() {
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.');
    }

    settings(lists) {
        ReactDOM.render(<Settings lists={lists} back={this.loadData.bind(this)}/>, this.appNode);
    }

    render() {
        return null;
    }
}

export default App;
