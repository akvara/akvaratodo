var CONFIG = {
    cookieTodo: 'backup-data-todo',
    postponeBy: 15,
    addNewAt: 5
};

var App = React.createClass({

    render: function() {
        console.log('Starting ...');

        return (
            <div>
                <TaskApp config={CONFIG} />
            </div>
        );
    }
});

React.render(<App />, document.getElementById("app"));