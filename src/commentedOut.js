// import TestComponent from './components/TestComponent';


var callback = function() { return console.log('Baigta') }

var p = new Promise(function(resolve, reject) {  
   setTimeout(() => resolve(4), 2000);
});

var wait2000 = function(resolve, reject) {return setTimeout(() => resolve(4), 2500)};

var promiseWrapper = function(wrappable) {  
  return new Promise((resolve, reject) => {
    wrappable(resolve, reject);
  });
}