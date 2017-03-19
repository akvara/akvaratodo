import React, { Component } from 'react';
import CONFIG from '../config.js';

class Settings extends Component {

	constructor(props, context) {
	    super(props, context);

	    this.state = this.props.extractSettings(props.user.settings);

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

	setMin(property) {
		var obj  = {}
		obj[property] = CONFIG.settingsConfig[property].min;
		this.setState(obj)
	}

	setMax(property) {
		var obj  = {}
		obj[property] = CONFIG.settingsConfig[property].max;
		this.setState(obj)
	}

	handleSelectChange(e) {
    	this.setState({loadListIfExists: e.target.value })
	}

	saveSettings() {
		this.props.saveSettings(this.state);
	}

	displayList(listItem, i) {
		return <option key={"o"+ i}>{{listItem}}</option>
	}

	displaySelect(property) {
		return React.createElement(
			"select",
			{
				value: this.state[property], onChange: this.handleSelectChange.bind(this)
			},
			this.props.lists.map((item) => React.createElement("option", { value: item.name, key: "o" + item.name }, item.name ))
         )
	}

	displayRow(property) {
		if (CONFIG.settingsConfig[property].handler === 'numeric') {
			return <tr key={"tr" + property}>
				<td className="table-description-cell">{CONFIG.settingsConfig[property].explain}</td>
				<td className="table-control-button-cell" onClick={this.setMin.bind(this, property)}>
					{CONFIG.settingsConfig[property].min}&nbsp;&le;
				</td>
				<td className="table-control-button-cell">
					<button key={"sub" + property} onClick={this.sub.bind(this, property)}>-</button>
				</td>
				<td className="table-control-button-cell settings-item">
					{this.state[property]}
				</td>
				<td className="table-control-button-cell">
					<button key={"add" + property} onClick={this.add.bind(this, property)}>+</button>
				</td>
				<td className="table-control-button-cell" onClick={this.setMax.bind(this, property)}>
					&le;&nbsp;{CONFIG.settingsConfig[property].max}
				</td>
			</tr>
		} else {
			return <tr key={"tr" + property}>
				<td>{CONFIG.settingsConfig[property].explain}</td>
				<td colSpan="5">
					<span className="right-align">
				      { this.displaySelect(property) }
					</span>
				</td>
			</tr>

		}
	}

	render() {
		return <div>
			<h1>Settings</h1>
			<table className="table table-condensed table-hover table-bordered">
				<tbody>
				{ Object.keys(CONFIG.settingsConfig).map(this.displayRow.bind(this)) }
				</tbody>
			</table>

			<button onClick={this.saveSettings.bind(this)}>
				<span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span> Save
			</button>
		</div>
	}
}

export default Settings;
