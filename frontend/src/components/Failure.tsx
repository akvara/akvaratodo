import React, { Component } from 'react';

class Failure extends Component {
  defaultReload = () => {
    window.location.reload();
  };

  render() {
    let msg = this.props.msg ? this.props.msg : 'Ooops, something went wrong...';
    let onClick = this.props.onClick ? this.props.onClick : this.defaultReload;
    return (
      <div>
        <br />
        {msg}
        <br />
        Please
        <button onClick={onClick}>reload</button>
      </div>
    );
  }
}

export default Failure;