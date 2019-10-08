import * as React from 'react';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';

import { appActions } from '../../../store/actions';
import { hotKeyedListName } from '../../../utils/stringUtils';
import { grabDate, grabTime } from '../../../utils/utils';
import { TodoList } from '../../../store/types';

export interface TableRowProps {
  listRow: TodoList;
  indented: boolean;
  hotKeys: [];
}

interface TableRowHandlers {
  listOpenHandler: (listId: string) => () => void;
  listRemoveHandler: (listId: string) => () => void;
}

interface TableRowPrivateProps extends TableRowProps, TableRowHandlers {
  removeListRequest: typeof appActions.deleteAList;
  openAListRequest: typeof appActions.openAList,
}

const TableRow: React.FC<TableRowPrivateProps> = ({ listRow, hotKeys, indented, listOpenHandler,listRemoveHandler }) => {
  const noOfTasks = listRow.tasks ? JSON.parse(listRow.tasks).length : 0;
  const deletable = listRow.tasks ? listRow.tasks === '[]' && !listRow.immutable : true;
  const updatedDateOrTime =
    grabDate(new Date().toISOString()) === grabDate(listRow.updatedAt)
      ? grabTime(listRow.updatedAt)
      : grabDate(listRow.updatedAt);
  const className = 'list-item' + (listRow.immutable ? ' list-item-immutable' : '');

  return (
    <tr key={listRow._id}>
      <td className={className} onClick={listOpenHandler(listRow._id)}>
        {indented && (
          <span className={'glyphicon list-item list-item-glyph'} aria-hidden="true">
            {' '}
          </span>
        )}
        <span className={'glyphicon list-item list-item-glyph glyphicon-folder-open'} aria-hidden="true" />
        {hotKeyedListName(listRow.name, hotKeys)}
      </td>
      <td className="actions">
        {deletable && (
          <span
            className="glyphicon glyphicon-trash action-button"
            aria-hidden="true"
            onClick={listRemoveHandler(listRow._id)}
          />
        )}
      </td>
      <td className="right-align">
        (<strong>{noOfTasks}</strong>) {updatedDateOrTime}
      </td>
    </tr>
  );
};

export default compose<TableRowProps, TableRowProps>(
  withHandlers<TableRowPrivateProps, TableRowHandlers>({
    listRemoveHandler: ({ removeListRequest }) => (listId) => () => {
      removeListRequest(listId);
    },
    listOpenHandler: ({ openAListRequest }) => (listId) => () => {
      openAListRequest(listId);
    },
  }),
)(TableRow);
