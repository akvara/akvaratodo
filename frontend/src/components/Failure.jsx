import React, { Component } from 'react';

class Failure extends Component {

    /* The Renderer */
    render() {
        let msg = this.props.msg ? this.props.msg : "Ooops, something went wrong...";
        return (
            <div>
            <br />
                {msg}
            <br />
            Please <button onClick={()=> window.location.reload()}>reload</button>
            </div>
        );
    }
}

export default Failure;
