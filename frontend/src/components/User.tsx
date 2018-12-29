import * as React from 'react';
import CONFIG from '../config.js';

const normaliser = (val: number, base: number) => {
  return ('00' + Math.floor((val * 256) / base).toString(16)).substr(-2, 2);
};

const versionColor = () => {
  let str = CONFIG.version.replace(/-/g, '');
  return (
    '#' +
    normaliser(parseInt(str.substring(2, 4)), 31) +
    normaliser(parseInt(str.substring(0, 2)), 12) +
    normaliser(parseInt(str.substring(4, 6)), 24)
  );
};

const User: React.FunctionComponent<{}> = () => (
  <div>
    <span className="list-item">
      <span style={{ color: versionColor() }}> {CONFIG.version}</span>{' '}
      <small>
        <b>{process.env.NODE_ENV}</b>
      </small>
    </span>
    <span
      className="glyphicon glyphicon-cog action-button"
      aria-hidden="true"
      // onClick={this.renderSettings.bind(this, this.props.lists)}
    />
    <span className="action-button">{CONFIG.user.name}</span>
    <audio id="clickSound" src={CONFIG.clickSound} />
    <hr />
  </div>
);

export default User;
