import React from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';
import Loadable from './Loadable';

class ListChanger extends Loadable {
    loadData() {
    }

    componentDidMount() {
        ReactDOM.render(<TaskApp
            list={this.props.toList}
            immutables={this.props.immutables}
            />, this.appNode
        );
    }

    /* The Renderer */
    render() {
        return null;
    }
}

export default ListChanger;
