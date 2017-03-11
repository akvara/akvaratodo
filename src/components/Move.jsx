import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from './Loadable';
import TaskApp from './TaskApp';

class Move extends Loadable {

	constructor(props, context) {
	    super(props, context);

	    this.state = {
			lists: [],
			listName: '',
			notYetLoaded: true
	    };
	}

	componentDidMount() {
console.log('Move Did Mount');
    }

    componentWillUnmount() {
console.log('Move Did Un');
    }

	toAnoter (listId) {
		ReactDOM.render(<TaskApp
			listId={listId}
			prepend={this.props.item}
			// immutables={this.state.lists.filter((item) => item.immutable)}
			itemsDone={this.props.itemsDone}
		/>, this.appNode);
	}

  	displayToButton (item) {
  		return <button key={'btn'+item._id} onClick={this.toAnoter.bind(this, item._id)} >To <strong>{ item.name }</strong></button>
  	}

    loadData() {
        this.load(this.loadListsRequest, this.loadListsCallback.bind(this), 'Loading lists');
    }

	render() {
		if (this.state.notYetLoaded) {
			return (
				<div>
					<h1>Please wait</h1>
				</div>
			);
		}

		return (
			<div>
				<h2>{this.props.item}</h2>
				{ this.state.lists.filter((item) => !item.immutable).map((list) => this.displayToButton(list)) }
			</div>
		);
	}
}

export default Move;
