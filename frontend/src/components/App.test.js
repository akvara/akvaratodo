import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const loading = document.createElement('loading');
  const user = document.createElement('user');
  const app = document.createElement('app');
  ReactDOM.render(<App />, app);
});
