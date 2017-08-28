import React, { Component } from 'react';

class Success extends Component {

    /* The Renderer */
    render() {
        console.log('props:', this.props);
        return (
            <div>Success!!...</div>
        );
    }
}

export default Success;
