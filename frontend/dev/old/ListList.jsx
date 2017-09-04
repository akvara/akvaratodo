import React, { Component } from 'react';
import * as Utils from '../utils/utils.js';
import CONFIG from '../config.js';

class ListList extends Component {

	/* Inherited */
	removeList(id) {
		this.props.removeList(id);
	}

	/* Inherited */
	openList(...params) {
		this.props.openList(...params);
	}

    hotKeyedListName(listName) {
        if (!this.props.hotKeys) return listName;
    	var corresponding = this.props.hotKeys.filter((elem) => elem.listName === listName);
        if (!corresponding.length) return listName;
		return this.strongify(listName, corresponding[0].key)
    }

    /* underline first of given letters */
    strongify(str, letter) {
    	var n = str.toLowerCase().indexOf(letter);
  		if (n === -1) return str;

  		return <span>{str.substring(0, n)}<u>{str.substring(n, n + 1)}</u>{str.substring(n + 1, str.length)}</span>;
	}

	/* Display list line */
	displayList(list, i) {
		var itemClass = "list-item",
			action = null,
			glyph = "";

        action = this.openList.bind(this, list._id, list.name);
        glyph = "glyphicon-folder-open";

		if (list.immutable) {
			itemClass += " list-item-immutable"
		}

		if (list.name === CONFIG.user.settings.openListIfExists) {
			itemClass += " list-item-current"
		}

		let deletable = list.tasks ? (list.tasks === '[]' && !list.immutable) : true;
		var updatedDateOrTime = Utils.grabDate(new Date().toISOString()) === Utils.grabDate(list.updatedAt) ?
			Utils.grabTime(list.updatedAt) : Utils.grabDate(list.updatedAt);
		return (
			<tr key={'tr'+i}>
				<td className={itemClass} onClick={action} >
					<span className={"glyphicon list-item list-item-glyph " + glyph} aria-hidden="true"></span>
				{ this.hotKeyedListName(list.name) }
				</td>
				<td className="actions">
				{deletable  &&
					<span className="glyphicon glyphicon-trash action-button" aria-hidden="true" onClick={this.removeList.bind(this, list._id)}></span>
				}
				</td>
				<td className="right-align">
					(<strong>{ list.tasks ? JSON.parse(list.tasks).length : 0 }</strong>)
					&nbsp;
					{ updatedDateOrTime }
				</td>
			</tr>
		);
	}


    /* The Renderer */
	render() {
		return (
			<table className="table table-hover">
				<tbody>
					{this.props.lists.map(this.displayList.bind(this))}
				</tbody>
			</table>
		);
	}
}

export default ListList;