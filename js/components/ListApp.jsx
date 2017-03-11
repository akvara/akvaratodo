var ListApp = React.createClass({

	getInitialState: function() {

		return {
			lists: [], // generate with: Array.from(Array(40)).map((e,i)=>(i).toString()),
			listName: '',
			listContent: '', 
			loaded: false
		}
	},

	handleSubmit: function (e) {
 		e.preventDefault(); 		

 		$.post(
 			this.props.config.listsapi + "lists",
 			{
 				'name': this.state.listName,
 				'tasks': this.state.listContent,
 			}
 		)
		.done(function(data, textStatus, jqXHR) {
			this.loadData();
        }.bind(this))
        .fail(function(jqXHR, textStatus, errorThrown) {
        	console.log(textStatus);
    	});

    	this.setState({ 
			listName: '',
			listContent: ''
		});
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
			this.setState({ 
				lists: data ,
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
// console.log('ListApp items done~', this.props.itemsDone);
		if (!this.state.loaded)	{
			return (<div>Loading...</div>);
		}	

		return (
			<div>
				<h1>Lists</h1>v0310-1
				<hr />
				<ListList 
					lists={this.state.lists} 
					delete={this.removeList} 
					itemsDone={this.props.itemsDone}
					config={CONFIG}
				/>
				<hr />
				<form onSubmit={this.handleSubmit}>
					<input value={this.state.listName} onChange={this.onNameChange} />
					<button disabled={this.state.listName.trim()==''}>Add list</button>
				</form>
				<hr />
			</div>
		);
	}
});
