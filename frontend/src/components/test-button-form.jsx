import React from 'react';
import PropTypes from 'prop-types';

class TestForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    onSubmit(values) {
        return this.props.onSubmit(values);
    }


    render() {
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>

                <div>
                    <button submit={true} >
                        Test
                    </button>
                </div>
            </form>
        );
    }
}

// TestForm = reduxForm({
    // form: 'debt_form',
    // validate
// })(TestForm);
export default TestForm;
