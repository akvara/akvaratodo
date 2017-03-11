var Move = React.createClass({
	getInitialState: function() {

		return {
			lists: [],
			loaded: false
		}
	},

	toAnoter: function (listId) {
		React.render(<TaskApp 
			config={CONFIG} 
			listId={listId} 
			receiving={this.props.item} 
			immutables={this.state.lists.filter((item) => item.immutable)}
			itemsDone={this.props.itemsDone} 
		/>, document.getElementById("app"));
	},

  	displayToButton: function (item) {
  		var listName = item.name;
  		var id = item._id;

  		return <button onClick={this.toAnoter.bind(this, id)} >To <strong>{ listName }</strong></button>
  	},

	loadData: function () {
		$.get(this.props.config.listsapi + "lists")
		.done(function(data, textStatus, jqXHR) {
			this.setState({ 
				lists: data,
				loaded: true
			});
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
				<h2>{this.props.item}</h2>
				{ this.state.lists.map((list) => this.displayToButton(list)) }
			</div>
		);
	}
});
