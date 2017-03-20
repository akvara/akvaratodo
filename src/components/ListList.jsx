import React, { Component } from 'react';
import CONFIG from '../config.js';

class ListList extends Component {

	/* Inherited */
	removeList(id) {
		this.props.removeList(id);
	}

	/* Inherited */
	goToList(...params) {
		this.props.goToList(...params);
	}

	/* Display list line */
	displayList(list, i) {
		var itemClass = "list-item",
			action = null,
			glyph = "";

        switch(this.props.action) {
            case 'open':
                action = this.goToList.bind(this, list._id, list.name);
                glyph = "glyphicon-folder-open";
                break;
            case 'move':
                action = this.goToList.bind(this, list._id, list.name);
                glyph = "glyphicon-forward";
                break;
            default:
                console.log("Error - ListList has no action")
        }


		if (list.immutable) {
			itemClass += " list-item-immutable"
		}

		if (list.name === CONFIG.user.settings.goToListIfExists) {
			itemClass += " list-item-current"
		}

		let deletable = list.tasks ? (list.tasks === '[]' && !list.immutable) : true;
		var updatedDateOrTime = new Date().toISOString().substr(0, 10) === list.updatedAt.substr(0, 10) ?
			list.updatedAt.substr(11, 5) : list.updatedAt.substr(0, 10);
		return (
			<tr key={'tr'+i}>
				<td className={itemClass} onClick={action} >
					<span className={"glyphicon list-item list-item-glyph " + glyph} aria-hidden="true"></span>
				{ list.name }
				</td>
				<td className="actions">
				{deletable && action === 'open' &&
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
				<tr></tr>
					{this.props.lists.map(this.displayList.bind(this))}
				</tbody>
			</table>
		);
	}
}

export default ListList;
