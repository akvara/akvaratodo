// import TestComponent from './components/TestComponent';


var callback = function() { return console.log('Baigta') }

var p = new Promise(function(resolve, reject) {  
   setTimeout(() => resolve(4), 2000);
});

var wait2500 = function(resolve, reject) {return setTimeout(() => resolve(4), 2500)};

var promiseWrapper = function(wrappable) {  
  return new Promise((resolve, reject) => {
    wrappable(resolve, reject);
  });
}



	componentWillMount() {
console.log('Whatever Will Mount');
	}

	componentDidMount() {
console.log('Whatever Did Mount');
	}

	componentWillUnmount() {
console.log('Whatever Did Un');
	}