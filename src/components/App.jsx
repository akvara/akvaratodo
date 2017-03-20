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

        this.user = {id: CONFIG.user.id};

        // this.state = {
            // lists: [],
        // };

        this.userNode = document.getElementById('user');
    }

    loadData() {
        this.loadUserSettings(this.user.id)
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
        var saving = this.user;

        saving.settings = this.extractSettings(settings);// : this.getDefaultSettings();

        this.loadMainView(CONFIG.user);
    }

    loadMainView(user) {
        this.loadLists(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading ToDo lists', 'Lists loaded.')
    }

    loadListsCallback(data) {
        var lists = Utils.sortArrOfObjectsByParam(data, 'updatedAt', true);

        ReactDOM.render(<User lists={lists} renderSettings={this.renderSettings.bind(this)} />, this.userNode);
        var current = lists.find((item) => item.name === CONFIG.user.settings.openListIfExists);

        if (current) {
            var list = { id: current._id, name: current.name }
            ReactDOM.render(<TaskApp
                list={list}
                immutables={lists.filter((item) => item.immutable)}
            />, this.appNode);
        } else {
            ReactDOM.render(<ListApp lists={lists} action='open'/>, this.appNode);
        }
    }

    /* Get settings from db or set default */
    extractSettings(fromObj) {
        var obj = {};
        Object.keys(CONFIG.settingsConfig).map(
            (property) =>
                obj[property] = fromObj[property] ? fromObj[property] : CONFIG.settingsConfig[property].default
// console.log('property', property);
// console.log('obj[property]', obj[property]);
// console.log('fromObj[property]', fromObj[property]);
// console.log(' CONFIG.settingsConfig[property].default', CONFIG.settingsConfig[property].default);

        );
        return obj;
    }

    saveSettings(settings) {
        console.log("App saveSettings:", settings);
        this.setUserSettings(settings);
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
                user={this.user}
                extractSettings={this.extractSettings}
                saveSettings={this.saveSettings.bind(this)}
            />, this.appNode
        );
    }

    /* The Renderer */
    render() {
        return null;
    }
}

export default App;

