import * as React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { RootState } from '../store/reducers';
import { getAListAction } from '../store/actions/list-actions';
import { defaultProps } from 'recompose';
import { TodoList } from '../store/types';

// const defaultReload = () => {
//   window.location.reload();
// };

export interface FailureProps {
  msg: string;
  getAList: typeof getAListAction.started;
  aList: TodoList;
}

const Failure: React.FunctionComponent<FailureProps> = (props: FailureProps) => {
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

const mapStateToProps = (state: RootState) => ({
  aList: state.app.aList,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAList: getAListAction.started,
    },
    dispatch,
  );
};

export default compose(
  defaultProps({
    msg: 'Ooops, something went wrong...',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Failure);
