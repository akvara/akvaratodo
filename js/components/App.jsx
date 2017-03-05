var CONFIG = {
    cookieTodo: 'backup-data-todo',
    postponeBy: 15,
    addNewAt: 7,
    maxTaskLength: 45,
    displayFirst: 15,
    displayLast: 4,
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