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

	/* Display list line */
	displayList(list, i) {
		var itemClass = "list-item",
			action = null,
			glyph = "";

        switch(this.props.action) {
            case 'open':
                action = this.openList.bind(this, list._id, list.name);
                glyph = "glyphicon-folder-open";
                break;
            case 'move':
                action = this.openList.bind(this, list._id, list.name);
                glyph = "glyphicon-forward";
                break;
            default:
                console.log("Error - ListList has no action")
        }

		if (list.immutable) {
			itemClass += " list-item-immutable"
		}

		if (list.name === CONFIG.user.settings.openListIfExists) {
			itemClass += " list-item-current"
		}

		let deletable = list.tasks ? (list.tasks === '[]' && !list.immutable && this.props.action === 'open') : true;
		var updatedDateOrTime = Utils.grabDate(new Date().toISOString()) === Utils.grabDate(list.updatedAt) ?
			Utils.grabTime(list.updatedAt) : Utils.grabDate(list.updatedAt);
		return (
			<tr key={'tr'+i}>
				<td className={itemClass} onClick={action} >
					<span className={"glyphicon list-item list-item-glyph " + glyph} aria-hidden="true"></span>
				{ list.name }
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
