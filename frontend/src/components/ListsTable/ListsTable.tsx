import React, { Component } from 'react';
import TableRow from './TableRow';

class ListsTable extends Component {
  contractedListItemHeader = (list, i) => {
    let sign = 'glyphicon-minus';
    if (list.isContracted) {
      sign = 'glyphicon-plus';
    }
    return (
      <tr key={'tr' + i}>
        <td colSpan={2} onClick={this.props.toggleContracted.bind(this, list.contractedTitle, !list.isContracted)}>
          <span className={'glyphicon list-item list-item-glyph glyphicon ' + sign} aria-hidden="true" />
          {list.contractedTitle}
        </td>
        <td className="right-align">
          <strong>{list.list.length}</strong>
        </td>
      </tr>
    );
  };

  contractedListItems = (list) => {
    if (list.isContracted) {
      return null;
    }
    return list.list.map(this.displayIndentedListRow);
  };

  contractedList = (list, i) => {
    return [this.contractedListItemHeader(list, i), this.contractedListItems(list, i)];
  };

  displayIndentedListRow = (list, i) => <TableRow listRow={list} hotKeys={this.props.hotKeys} indented={true} key={i}/>;

  displayList = (list, i) => {
    if (list.isList) return this.contractedList(list, i);

    return <TableRow listRow={list} hotKeys={this.props.hotKeys} key={i}/>;
  };

  render() {
    return (
      <table className="table table-hover">
        <tbody>{this.props.lists.map(this.displayList)}</tbody>
      </table>
    );
  }
}

export default ListsTable;
