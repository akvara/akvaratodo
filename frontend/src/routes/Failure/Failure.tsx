import * as React from 'react';
import { defaultProps } from 'recompose';

import { getAListAction } from '../../store/list/list.actions';
import { TodoList } from '../../store/types';

export interface FailureProps {
  msg: string;
}

interface FailurePrivateProps extends FailureProps {
  getAList: typeof getAListAction.started;
  aList: TodoList;
}

const Failure: React.FunctionComponent<FailurePrivateProps> = (props) => {
  const { msg, getAList, aList } = props;
  return (
    <div>
      <br />
      {msg}
      <br />
      Please <button onClick={() => getAList(aList._id)}>reload</button>
    </div>
  );
};

export default Failure;
