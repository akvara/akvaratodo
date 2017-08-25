import React, { Component } from 'react';

class Loading extends Component {

    /* The Renderer */
    render() {
        return (
            <div>Ooops, something wen wrong..
            <br />
            Please <button onClick={()=> window.location.reload()}>reload</button>
            </div>
        );
    }
}

export default Loading;
