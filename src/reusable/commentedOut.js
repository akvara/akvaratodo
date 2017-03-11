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

    React.unmountComponentAtNode(mountNode);



    
    loadListCallback(data) { 
          let itemsToDo = data.tasks ? JSON.parse(data.tasks) : [];

            if (this.state.prepend) {
                itemsToDo = [this.state.prepend].concat(itemsToDo);
            }

            this.setState({
                listName: data.name, 
                immutable: data.immutable,
                itemsToDo: itemsToDo,
                prepend: null,
                notYetLoaded: false,
            }, this.state.prepend ? this.save : null)

        ReactDOM.render(<Messenger info="Loaded." />, this.loaderNode);    
    }