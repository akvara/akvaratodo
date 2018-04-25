import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as Utils from '../utils/utils.js';
import CONFIG from '../config.js';

class ListOfLists extends Component {
    static propTypes = {
        hotKeys: PropTypes.array,
        lists: PropTypes.array,
        openList: PropTypes.func.isRequired,
        removeList: PropTypes.func,
    };

    hotKeyedListName = (listName) => {
        if (!this.props.hotKeys) return listName;
        let corresponding = this.props.hotKeys.filter((elem) => elem.listName === listName);
        if (!corresponding.length) return listName;

        return this.strongify(listName, corresponding[0].key)
    };

    /* underline first of given letters */
    strongify = (str, letter) => {
        let n = str.toLowerCase().indexOf(letter);
        if (n === -1) return str;

        return <span>{str.substring(0, n)}<u>{str.substring(n, n + 1)}</u>{str.substring(n + 1, str.length)}</span>;
    };

    contractedListItemHeader = (list, i) => {
        let sign = "glyphicon-minus";
        if (list.isContracted) sign = "glyphicon-plus";
        return (
            <tr key={'tr' + i}>
                <td colSpan={2}
                    onClick={this.props.toggleContracted.bind(this, list.contractedTitle, !list.isContracted)}>
					<span className={"glyphicon list-item list-item-glyph glyphicon " + sign}
                          aria-hidden="true">
					</span>
                    {list.contractedTitle}
                </td>
                <td className="right-align">
                    (<strong>{list.list.length}</strong>)
                </td>
            </tr>
        );
    };

    contractedListItems = (list, i) => {
        if (list.isContracted) return null;
        return list.list.map(this.displayIndentedListRow);
    };

    contractedList = (list, i) => {
        return [
            this.contractedListItemHeader(list, i),
            this.contractedListItems(list, i)
        ]
    };

    displayIndentedListRow = (list, i) => {
        let item = this.prepareListForDisplaying(list);
        item.indent = true;
        return this.displayListRow(item, i);
    };


    displayListRow = (list, i) => (
        <tr key={'tr' + i}>
            <td className={list.itemClass} onClick={list.action}>
                {list.indent &&
                <span className={"glyphicon list-item list-item-glyph"} aria-hidden="true">
                        {' '}
					</span>
                }
                <span className={"glyphicon list-item list-item-glyph glyphicon-folder-open"}
                      aria-hidden="true">
					</span>
                {list.name}
            </td>
            <td className="actions">
                {list.deletable &&
                <span className="glyphicon glyphicon-trash action-button"
                      aria-hidden="true"
                      onClick={this.props.removeList.bind(this, list._id)}>
					</span>
                }
            </td>
            <td className="right-align">
                (<strong>{list.noOfTasks}</strong>)
                {' '}
                {list.updatedDateOrTime}
            </td>
        </tr>
    );

    prepareListForDisplaying = (list) => {
        let item = {
            _id: list._id,
            tasks: list.tasks,
            noOfTasks: list.tasks ? JSON.parse(list.tasks).length : 0,
            name: this.hotKeyedListName(list.name),
            itemClass: "list-item",
            action: this.props.openList.bind(this, list._id, list.name),
            deletable: list.tasks ? (list.tasks === '[]' && !list.immutable) : true,
            updatedDateOrTime:
                Utils.grabDate(new Date().toISOString()) === Utils.grabDate(list.updatedAt) ?
                    Utils.grabTime(list.updatedAt) : Utils.grabDate(list.updatedAt)
        };

        if (list.immutable) {
            item.itemClass += " list-item-immutable"
        }

        if (list.name === CONFIG.user.settings.openListIfExists) {
            item.itemClass += " list-item-current"
        }

        return item;
    };

    displayList = (list, i) => {

        if (list.isList) return this.contractedList(list, i);
        let item = this.prepareListForDisplaying(list);

        return this.displayListRow(item, i);
    };

    render() {
        return (
            <table className="table table-hover">
                <tbody>
                {this.props.lists.map(this.displayList)}
                </tbody>
            </table>
        );
    }
}

export default ListOfLists;
