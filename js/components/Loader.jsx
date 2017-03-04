var Loader = React.createClass({

	loadData: function () {
		let backupData = $.cookie('backup-data-todo');

		if (backupData) {
			console.log('Loading from backup');
			return renderTaskApp(JSON.parse(backupData));
		} else {
			return readFromFiles();
		}
	},

	render: function() {

		return (
			<div>
				{ this.props.message }
			</div>
		);
	}
});

function request(method, resource, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText + " : " + resource);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
};

function getFileContents (fileName) {
	console.log("Loading " + fileName + "...");
	return request('GET', fileName + '.txt', './' + fileName + '.txt?<?php echo time(); ?>');
};


var saveBackup = function (items) {
	$.cookie('backup-data-todo', JSON.stringify(items));
}

var clear = function () {
	$.cookie('backup-data-todo', '');
}

function renderTaskApp (items) {
	React.render(<TaskApp items={items} backup={saveBackup} loadDaily={loadDaily} clear={clear} /> ,  document.querySelector('#app'));	
}

function textToArray (text) {
	return text.split(/\r?\n/).filter(entry => entry.trim() != '')
}

function loadDaily () {
	readFromFile("daily");
}

function readFromFile (fileName) {
    getFileContents(fileName)
	.then(function (result) {
		items = []; // textToArray(result).concat(items).concat("aga");
		console.log(fileName + " loaded.");
		this.setState({ 
			itemsToDo: items
		});
	})
	.catch(err => {
	    console.log("File load error:", err);
	});
}

function readFromFiles () {
	Promise.all([
	    getFileContents('daily'),
	    getFileContents('postponed'),
	])
	.then(function([result1, result2]) {
		console.log("Files loaded.");

		var items = textToArray(result1).concat(textToArray(result2)).concat(['------------------------------']);
		
		renderTaskApp(items);
	})
	.catch(err => {
	    console.log("File load error:", err);
		React.render(<Loader message="File load error" />, document.querySelector('#app'));
	});
}

React.render(<Loader message="Loading..." />, document.querySelector('#app'));
Loader.loadData();
