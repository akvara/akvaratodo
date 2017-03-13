import React, { Component } from 'react';
import CONFIG from '../config.js';

class Settings extends Component {

	constructor(props, context) {
	    super(props, context);

	    var obj = {};

		Object.keys(CONFIG.settingsConfig).map((property) => obj[property] = CONFIG.settingsConfig[property].default);

	    this.state = obj;
	}

	add(property) {
		var obj  = {}
		obj[property] = this.state[property] + 1;
		if (obj[property]<=CONFIG.settingsConfig[property].max) this.setState(obj)
	}

	sub(property) {
		var obj  = {}
		obj[property] = this.state[property] - 1;
		if (obj[property]>=CONFIG.settingsConfig[property].min) this.setState(obj)
	}

	handleChange() {

	}

	back() {
		this.props.back();
	}

	displayList(listItem, i) {
		return <option key={"o"+ i}>nufak</option>
	}

	displayRow(property) {
		// console.log(CONFIG.settingsConfig);
		// console.log(property);
		// console.log(CONFIG.settingsConfig[property]);
		if (CONFIG.settingsConfig[property].handler === 'numeric') {
			var sub = () => this.sub(property);
			var add = () => this.add(property);
			return <tr key={"tr" + property}>
				<td>{CONFIG.settingsConfig[property].explain}</td>
				<td>
					<span>
						<button key={"sub" + property} onClick={sub}>-</button>
						<span className="settings-item">{this.state[property]}</span>
						<button key={"add" + property} onClick={add}>+</button>
					</span>
				</td>
			</tr>
		} else {
			return <tr key={"tr" + property}>
				<td>{CONFIG.settingsConfig[property].explain}</td>
				<td>
					<span>
						<select value={this.state[property]} onChange={this.handleChange}>
							{ this.props.lists.map(this.displayList.bind(this)) }
					    </select>
					</span>
				</td>
			</tr>

		}
	}

	render() {
		return <div>
			<h1>Settings</h1>
			<table className="table table-condensed table-hover">
				<tbody>
				{ Object.keys(CONFIG.settingsConfig).map(this.displayRow.bind(this)) }
				</tbody>
			</table>

			<button onClick={this.back.bind(this)}>
				<span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Save
			</button>
		</div>
	}
}

export default Settings;
