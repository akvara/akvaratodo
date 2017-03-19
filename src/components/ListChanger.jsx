import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TaskApp from './TaskApp';

class ListChanger extends Component {

    componentDidMount() {
        ReactDOM.render(<TaskApp
            list={this.props.toList}
            previousList={this.props.previousList}
            immutables={this.props.immutables}
            itemsDone={this.props.itemsDone}
            />, this.props.appNode
        );
    }

    /* The Renderer */
    render() {
        return null;
    }
}

export default ListChanger;
