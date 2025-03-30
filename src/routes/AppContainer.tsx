import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';

import App, { AppProps } from './App';
import { RootState } from '../store/reducers';
import { appActions } from '../store/actions';

interface AppPrivateProps extends AppProps {
  startupRequest: typeof appActions.startup;
}

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

export default compose<AppPrivateProps, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);
