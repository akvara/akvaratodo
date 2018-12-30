import * as React from 'react';
import CONFIG from '../config.js';

const base256 = (val: number, base: number) => {
  return ('00' + Math.floor((val * 256) / base).toString(16)).substr(-2, 2);
};

const substrToNum = (dateString: string, indexStart: number, indexEnd: number): number =>
  parseInt(dateString.substring(indexStart, indexEnd), 10);

const versionColor = () => {
  const dateString = CONFIG.version.replace(/-/g, '');
  return (
    '#' +
    base256(substrToNum(dateString, 2, 4), 31) +
    base256(substrToNum(dateString, 0, 2), 12) +
    base256(substrToNum(dateString, 4, 6), 24)
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