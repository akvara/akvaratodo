import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const status = document.createElement('status');
  const user = document.createElement('user');
  const app = document.createElement('app');
  ReactDOM.render(<App />, app);
});
