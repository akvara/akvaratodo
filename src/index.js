import React from 'react';
import ReactDOM from 'react-dom';
import Loader from './components/Loader';
// import TestComponent from './components/TestComponent';

console.log('Starting ...');

var callback = function() { return console.log('Baigta') }

var p = new Promise(function(resolve, reject) {  
   setTimeout(() => resolve(4), 2000);
});

var wait2000 = function(resolve, reject) {return setTimeout(() => resolve(4), 2000)};

var promiseWrapper = function(wrappable) {  
  return new Promise((resolve, reject) => {
    wrappable();
  });
}

ReactDOM.render(<Loader request={wait2000} callback={callback} />, document.getElementById('app'));

// $.getJSON(url)
// 	.done((result) => resolve(result))
// 	.fail((xhr, status, err) => reject(status + err.message))

// => Loader =>