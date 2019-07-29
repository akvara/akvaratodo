import * as React from 'react';
import CONFIG from '../../config/config.js';

const base256 = (val: number, base: number) => {
  return ('00' + Math.floor((val * 256) / base).toString(16)).substr(-2, 2);
};

const substrToNum = (dateString: string, indexStart: number, indexEnd: number): number =>
  parseInt(dateString.substring(indexStart, indexEnd), 10);

const versionColor = () => {
  const dateString = CONFIG.version.replace(/-/g, '');
  const r = base256(substrToNum(dateString, 2, 4), 31);
  const g = base256(substrToNum(dateString, 0, 2), 12);
  const b = base256(substrToNum(dateString, 4, 6), 24);
  return `#${r}${g}${b}`;
};

const User: React.FunctionComponent<{}> = () => (
  <div>
    <span className="list-item">
      <span style={{ color: versionColor() }}> {CONFIG.version}</span>{' '}
      <small>
        <b>{process.env.NODE_ENV}</b>
      </small>
    </span>
    <span className="glyphicon glyphicon-cog action-button" aria-hidden="true" />
    <span className="action-button">{CONFIG.user.name}</span>
    <audio id="clickSound" src={CONFIG.clickSound} />
    <hr />
  </div>
);

export default User;
