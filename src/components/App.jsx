import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoadingDecorator from './LoadingDecorator';
import config from '../config.js';
import $ from 'jquery';

class App extends Component {
	loadLists(resolve, reject) {
		return $.get(config.apiHost + config.listsAddon)
			.done((data) => {
				resolve(data);
				  
			})
	        .fail((err) => {
	        	reject(err)
	        });
	}

	callback(data) { 
		return this.setState({ 
				lists: data
			})	 
	}

	componentWillMount() {
		ReactDOM.render(<LoadingDecorator request={this.loadLists} callback={this.callback} />)
	}

	render() {
		return null
	}

}

export default App;