import React from 'react';
import ReactDOM from 'react-dom';
import CONFIG from '../config.js';
import Loadable from './Loadable';
import User from './User';
import Settings from './Settings';
import ListApp from './ListApp';
import TaskApp from './TaskApp';
import * as Utils from '../utils/utils.js';
import * as UrlUtils from '../utils/urlUtils.js';
import $ from 'jquery';

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
        var current = lists.find((item)  => item.name === CONFIG.user.settings.loadListIfExists);
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

    setUserSettings(settings) {
        console.log("gavau", settings);

        if (settings.length===0) {
            settings = this.getDefaultSettings();
            settings.userId = CONFIG.user.id;
            this.saveSettings(settings);
        }
        console.log("atiduodu", settings);
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.');

    }

    getDefaultSettings() {
        var obj = {};
        Object.keys(CONFIG.settingsConfig).map((property) => obj[property] = CONFIG.settingsConfig[property].default);
        return obj;
    }

    loadUserSettings(userId) {
        return $.get(UrlUtils.getUserSettingsUrl(userId))
            .done((data) => { this.setUserSettings(data) })
            .fail((err) => { 
                console.log(err); 
                this.setUserSettings([]) 
            });
    }

    saveSettings(settings) {
        $.post(
            UrlUtils.getUserSettingsUrl(settings.userId), settings)
            .fail((err) => {
                console.log(err); 
            });
    }

    aIsPressed() {
        alert("A is pressed");
        $(document).off("keydown");
    }

    registerAPress() {
        $(document).on("keydown", () => this.aIsPressed() )
    }

    loadData() {
        // this.registerAPress();
        console.log("AAAAAAA", CONFIG.user.id)
        this.loadUserSettings(CONFIG.user.id)
    }

    settings(lists) {
        ReactDOM.render(<Settings lists={lists} back={this.loadData.bind(this)}/>, this.appNode);
    }

    render() {
        return null;
    }
}

export default App;
