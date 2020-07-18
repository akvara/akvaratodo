import * as React from 'react';
import { defaultProps } from 'recompose';

import { TodoList } from '../../store/types';
import { appActions } from '../../store/actions';

export interface FailureProps {
  msg: string;
}

interface FailurePrivateProps extends FailureProps {
  openAListRequest: typeof appActions.openAList;
  aList: TodoList;
}

const Failure: React.FunctionComponent<FailurePrivateProps> = (props) => {
  const { msg, openAListRequest, aList } = props;
  return (
    <div>
      <br />
      {msg}
      <br />
      Please <button onClick={() => openAListRequest(aList.id)}>reload</button>
    </div>
  );
};

export default Failure;
