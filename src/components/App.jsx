import React from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';
import Loadable from './Loadable';
import ListApp from './ListApp';
import TaskApp from './TaskApp';
import * as Utils from '../utils/utils.js';
import Messenger from './Messenger';

class App extends Loadable {
    constructor(props, context) {
        super(props, context);

        this.state = {
            lists: [],
        };
    }

    loadListsCallback(data) {
        var lists = Utils.sortArrOfObjectsByParam(data, 'updatedAt', true);

        // ReactDOM.render(<Messenger info={"Lists loaded."} />, this.loaderNode);
        var current = lists.find((item)  => item.name === CONFIG.loadListIfExists);
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
        this.load(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists');
    }

    render() {
        return null;
    }
}

export default App;
