import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CONFIG from '../config.js';
import {getAList, moveToList, prependToAList} from '../actions/list-actions';

class Move extends Component {
	constructor(props, context) {
	    super(props, context);
        this.state = {
            newListName: '',
            movingItem: props.task
        }
	}

    /* Returns back to the same list with no changes */
    back = () => {
        this.props.actions.getAList(this.props.from_list.listId);
    };

	/* Moves item to another list */
	move = (toListId) => {
        this.props.actions.moveToList({
            listId: toListId,
            fromListId: this.props.from_list.listId,
            task: this.props.task
        });
	};

	/* Copies item to another list byt its id*/
	copy = (toListId) => {
        this.props.actions.prependToAList({listId: toListId, task: this.props.task});
	};

	/* To List */
  	displayToButton = (list) => {
  		if (list._id === this.props.from_list.listId) return null;
  		return (
            <tr key={'tr' + list._id}>
                <td>
                    To: <strong>{list.name}</strong>
                </td>
                <td>
                    <button onClick={this.move.bind(this, list._id, list.name, false)}>Move</button>
                    {' '}
                    <button onClick={this.copy.bind(this, list._id)}>Copy</button>
                 </td>
            </tr>
        )
  	};


    handleSubmit = (e) => {
        e.preventDefault();
        // ToDo: Create or open list

    };

    onListInputChange = (e) => {
        this.setState({ newListName: e.target.value });
    };

  	/* The Renderer */
	render() {
		return (
			<div>
                <hr />
                <h2>{this.state.movingItem.substring(0, CONFIG.maxTaskLength)}</h2>
                <table className="table table-hover">
                    <tbody>
                        { this.props.lists.map((list) => this.displayToButton(list)) }
                    </tbody>
                </table>
                <hr />
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input className="list-input" value={this.state.newListName} onChange={this.onListInputChange} />
                    <button disabled={!this.state.newListName.trim()}>Move to new list</button>
                    <button disabled={!this.state.newListName.trim()}>Copy to new list</button>
                </form>
				<hr />
                <button onClick={this.back} >Back to {this.props.from_list.name}</button>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            getAList: getAList,
            moveToList: moveToList,
            prependToAList: prependToAList,
        }, dispatch),
    }
};

export default connect(
    null,
    mapDispatchToProps
)(Move);
