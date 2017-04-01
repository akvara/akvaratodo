import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';
import Loadable from './Loadable';

class ListChanger extends Loadable {
    loadData() {
        console.log('this.props.toList:', this.props.toList);
    }

    componentDidMount() {
        ReactDOM.render(<TaskApp
            list={this.props.toList}
            immutables={this.props.immutables}
            />, this.props.appNode
        );
    }

    /* The Renderer */
    render() {
        return null;
    }
}

export default ListChanger;
