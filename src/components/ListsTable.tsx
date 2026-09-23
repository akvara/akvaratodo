import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Utils from '../utils/utils.js';
import { hotKeyedListName } from '../utils/stringUtils';
import { HotKey } from '../store/types';

interface ListsTableProps {
  hotKeys?: HotKey[];
  lists: any[];
  openList: (listId: string, listName?: string) => void;
  removeList?: (listId: string) => void;
  toggleContracted?: (listTitle: string, beContracted: boolean) => void;
}

interface ListRow {
  id: string;
  tasks: string;
  noOfTasks: number;
  name: string | React.ReactElement;
  itemClass: string;
  action: (...args: any[]) => void;
  deletable: boolean;
  updatedDateOrTime: string;
  indent?: boolean;
}

class ListsTable extends Component<ListsTableProps> {
  static propTypes = {
    hotKeys: PropTypes.array,
    lists: PropTypes.array,
    openList: PropTypes.func.isRequired,
    removeList: PropTypes.func,
  };

  contractedListItemHeader = (list, i) => {
    let sign = 'glyphicon-minus';
    if (list.isContracted) {
      sign = 'glyphicon-plus';
    }
    return (
      <tr key={'tr' + i}>
        <td colSpan={2} onClick={this.props.toggleContracted?.bind(this, list.contractedTitle, !list.isContracted)}>
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
    return [this.contractedListItemHeader(list, i), this.contractedListItems(list)];
  };

  displayIndentedListRow = (list, i) => {
    const item = this.prepareListForDisplaying(list);
    item.indent = true;
    return this.displayListRow(item, i);
  };

  displayListRow = (list, i) => (
    <tr key={'tr' + i}>
      <td className={list.itemClass} onClick={list.action}>
        {list.indent && (
          <span className={'glyphicon list-item list-item-glyph'} aria-hidden="true">
            {' '}
          </span>
        )}
        <span className={'glyphicon list-item list-item-glyph glyphicon-folder-open'} aria-hidden="true" />
        {list.name}
      </td>
      <td className="actions">
        {list.deletable && (
          <span
            className="glyphicon glyphicon-trash action-button"
            aria-hidden="true"
            onClick={this.props.removeList?.bind(this, list.id)}
          />
        )}
      </td>
      <td className="right-align">
        <span>
          (<strong>{list.noOfTasks}</strong>)
        </span>
        <span className="less-useful">{list.updatedDateOrTime}</span>
      </td>
    </tr>
  );

  prepareListForDisplaying = (list): ListRow => {
    const item: ListRow = {
      id: list.id,
      tasks: list.tasks,
      noOfTasks: list.tasks ? JSON.parse(list.tasks).length : 0,
      name: hotKeyedListName(list.name, this.props.hotKeys),
      itemClass: 'list-item',
      action: this.props.openList.bind(this, list.id, list.name),
      deletable: list.tasks ? list.tasks === '[]' && !list.immutable : true,
      updatedDateOrTime:
        Utils.grabDate(new Date().toISOString()) === Utils.grabDate(list.updatedAt)
          ? Utils.grabTime(list.updatedAt)
          : Utils.grabDate(list.updatedAt),
    };

    if (list.immutable) {
      item.itemClass += ' list-item-immutable';
    }

    return item;
  };

  displayList = (list, i) => {
    if (list.isList) {
      return this.contractedList(list, i);
    }
    const item = this.prepareListForDisplaying(list);

    return this.displayListRow(item, i);
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
