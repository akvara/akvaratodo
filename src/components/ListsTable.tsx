import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Utils from '../utils/utils.js';
import { hotKeyedListName } from '../utils/stringUtils';
import { HotKey } from '../store/types';
import Icon from '../shared/Icon';

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
    return (
      <div
        className="list-card list-card-group"
        key={'c' + i}
        onClick={this.props.toggleContracted?.bind(this, list.contractedTitle, !list.isContracted)}
      >
        <span className="list-card-main">
          <Icon name={list.isContracted ? 'plus' : 'minus'} className="list-item-glyph" />
          {list.contractedTitle}
        </span>
        <span className="list-card-meta">
          <strong>{list.list.length}</strong>
        </span>
      </div>
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
    <div className={list.itemClass} key={'c' + i}>
      <span className="list-card-main" onClick={list.action}>
        {list.indent && <span className="indent-spacer" aria-hidden="true" />}
        <Icon name="folder" className="list-item-glyph" />
        {list.name}
      </span>
      <span className="list-card-meta">
        <span className="less-useful">{list.updatedDateOrTime}</span>
        <span className="list-card-count">{list.noOfTasks}</span>
        {list.deletable && <Icon name="trash" className="action-button" onClick={this.props.removeList?.bind(this, list.id)} />}
      </span>
    </div>
  );

  prepareListForDisplaying = (list): ListRow => {
    const item: ListRow = {
      id: list.id,
      tasks: list.tasks,
      noOfTasks: list.tasks ? JSON.parse(list.tasks).length : 0,
      name: hotKeyedListName(list.name, this.props.hotKeys),
      itemClass: 'list-card',
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
    return <div className="list-cards">{this.props.lists.map(this.displayList)}</div>;
  }
}

export default ListsTable;
