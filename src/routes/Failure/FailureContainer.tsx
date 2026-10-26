import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { RootState } from '../../store/reducers';
import Failure from './Failure';
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

export default connect(mapStateToProps, mapDispatchToProps)(Failure);
