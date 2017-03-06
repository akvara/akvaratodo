
var CONFIG = {
    listsapi: 'http://akvaratodoapi.link:3000/',
};

var ListApp = React.createClass({

	getInitialState: function() {

		return {
			lists: [], // generate with: Array.from(Array(40)).map((e,i)=>(i).toString()),
			listName: '',
			listContent: ''
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault();

 	// 	this.state.itemsToDo.splice(this.props.config.addNewAt - 1, 0, this.state.task.replace(/(^\s+|\s+$)/g, ''));

		// this.setState({ 
		// 	itemsToDo: _.unique(this.state.itemsToDo),
		// 	task: ''
		// });
	},

    removeList: function(id) {
		$.ajax({
			url: this.props.config.listsapi + "lists/" + id,
			type: 'DELETE'
		})
		.success(function(result) {
			this.loadData();
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
   	},	

	onNameChange: function (e) {
		this.setState({ listName: e.target.value });
	},

	onContentChange: function (e) {
		this.setState({ listContent: e.target.value });
	},

	loadData: function () {
		$.get(this.props.config.listsapi + "lists")
		.done(function(data, textStatus, jqXHR) {
			this.setState({ lists: data });
         	// console.log(data, textStatus);
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});
	},

	componentWillMount: function() {
    	this.loadData();
  	},

	render: function() {
		
		return (
			<div>
				<h1>Lists</h1>
				<hr />
				<ListList 
					lists={this.state.lists} 
					delete={this.removeList} 
					config={CONFIG}
				/>
			</div>
		);
	}
});

React.render(<ListApp config={CONFIG}/>, document.getElementById("app"))