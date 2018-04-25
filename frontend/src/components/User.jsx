import React, {Component} from 'react';
import CONFIG from '../config.js';

class User extends Component {
    /* Inherited */
    renderSettings(lists) {
        this.props.renderSettings(lists);
    }

    normaliser = (val, base) => {
        return ("00" + Math.floor(val * 256 / base).toString(16)).substr(-2, 2);
    };

    versionColor = () => {
        let str = CONFIG.version.replace(/-/g, "");
        return '#'
            + this.normaliser(str.substring(2, 4), 31)
            + this.normaliser(str.substring(0, 2), 12)
            + this.normaliser(str.substring(4, 6), 24)
    };

    /* The Renderer */
    render() {
        return <div>
			<span className="list-item">
                <span style={{color: this.versionColor()}}> {CONFIG.version}</span>
                {' '}
                <small><b>{process.env.NODE_ENV}</b></small>
			</span>
            <span className="glyphicon glyphicon-cog action-button"
                  aria-hidden="true"
                  onClick={this.renderSettings.bind(this, this.props.lists)}>
			</span>
            <span className="action-button">{CONFIG.user.name}
			</span>
            <audio id="clickSound" src={CONFIG.clickSound}>
            </audio>
            <hr/>
        </div>
    }
}

export default User;
