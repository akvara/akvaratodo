import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import App from './App';
import { RootState } from '../store/reducers';
import { appActions } from '../store/actions';

const mapStateToProps = (state: RootState) => ({
  mode: state.app.mode,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      startupRequest: appActions.startup,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
