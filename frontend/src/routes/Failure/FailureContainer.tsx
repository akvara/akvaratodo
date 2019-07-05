import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { defaultProps, compose } from 'recompose';

import { RootState } from '../../store/reducers';
import { getAListAction } from '../../store/list/list.actions';
import Failure, { FailureProps } from './Failure';

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

export default compose<FailureProps>(
  defaultProps({
    msg: 'Ooops, something went wrong...',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Failure);
