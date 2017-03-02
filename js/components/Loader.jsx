var Loader = React.createClass({

	render: function() {

		return (
			<div>
				Loading ...
			</div>
		);
	}
});

var	loadTxt = function () {

	var client = new XMLHttpRequest();

	console.log("Loading daily...");
	client.open('GET', '/daily.txt?<?php echo time(); ?>', true);
	client.onreadystatechange = function() {
		var loadedText = client.responseText; //
		console.log("daily loaded. Loading postponed");
			client.open('GET', '/postponed.txt?<?php echo time(); ?>', true);
			client.onreadystatechange = function() {
				console.log("Postponed loaded.");

				loadedText += client.responseText;
				var itemsTodo = loadedText.split(/\r?\n/).filter(entry => entry.trim() != '');

				React.render(<TaskApp items={itemsTodo}/>,  document.querySelector('#app'));
			}
	}
	client.send();
};

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
}

var getFileContents = function (fileName) {
	console.log("Loading " + fileName + "...");
	return request('GET', fileName + '.txt', './' + fileName + '.txt?<?php echo time(); ?>');
}

Promise.all([
    getFileContents('daily'),
    getFileContents('postponed'),
])
.then(function([result1, result2]) {
	console.log("Files loaded.");

	var loadedText = result1 + "\n" + result2;
	var itemsTodo = loadedText.split(/\r?\n/).filter(entry => entry.trim() != '');

	React.render(<TaskApp items={itemsTodo}/>,  document.querySelector('#app'));
})
.catch(err => {
    alert("File load error: " + err);
    console.log("File load error:", err);
});

React.render(<Loader />, document.querySelector('#app'));
