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
            user: {id: CONFIG.user.id}
        };
        this.userNode = document.getElementById('user');
    }

    loadData() {
        this.loadUserSettings(this.state.user.id)
    }

    loadUserSettings(userId) {
        return $.get(UrlUtils.getUserSettingsUrl(userId))
            .done((data) => { this.setUserSettings(data) })
            .fail((err) => {
                console.log(err);
                this.setUserSettings([])
            });
    }

    setUserSettings(settings) {
        var saving = this.state.user;

        console.log("settings", settings);
        saving.settings = settings ? this.extractSettings(settings) : this.getDefaultSettings();
        console.log("setUserSettings", saving);

        // Session.set('someVar', "Perduodu");
        // this.setState({ user: saving });

        this.loadMainView();
    }

    loadMainView(user) {
        console.log("loadMainView. User, state", this.state.user);
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.')
    }

    loadListsCallback(data) {
        var lists = Utils.sortArrOfObjectsByParam(data, 'updatedAt', true);

        ReactDOM.render(<User lists={lists} renderSettings={this.renderSettings.bind(this)} />, this.userNode);
        var current = lists.find((item)  => item.name === CONFIG.user.settings.loadListIfExists);
        if (current) {
            ReactDOM.render(<TaskApp
                listId={current._id}
                listId={current._id}
                listName={current.name}
                immutables={lists.filter((item) => item.immutable)}
            />, this.appNode);
        } else {
            ReactDOM.render(<ListApp lists={lists}/>, this.appNode);
        }
    }

    extractSettings(fromObj) {
        var obj = {};
        Object.keys(CONFIG.settingsConfig).map((property) => obj[property] = fromObj[property]);
        return obj;
    }

    getDefaultSettings() {
        var obj = {};
        Object.keys(CONFIG.settingsConfig).map((property) => obj[property] = CONFIG.settingsConfig[property].default);
        return obj;
    }

    saveSettings(settings) {
        console.log("App saveSettings:", settings); this.setUserSettings(settings);
        $.post(
            UrlUtils.getUserSettingsUrl(settings.userId), settings)
            .done(this.setUserSettings(settings))
            .fail((err) => {
                console.log(err);
            })
    }

    renderSettings(lists) {
        ReactDOM.render(
            <Settings
                lists={lists}
                user={this.state.user}
                extractSettings={this.extractSettings}
                saveSettings={this.saveSettings.bind(this)}
            />, this.appNode
        );
    }

    render() {
        return null;
    }
}

export default App;

//