import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose, defaultProps } from 'recompose';

import { RootState } from '../../store/reducers';
import Failure, { FailureProps } from './Failure';
import * as appActions from '../../store/app/app.actions';

const mapStateToProps = (state: RootState) => ({
  aList: state.app.aList,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      openAListRequest: appActions.openAList,
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
