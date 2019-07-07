import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';

import * as listActions from '../store/list/list.actions';
import { RootState } from '../store/reducers';
import App from './App';

interface AppProps {}

interface AppPrivateProps extends AppProps {
  mode: string;
  getListOfLists: typeof listActions.getListOfListsAction.started;
}

const mapStateToProps = (state: RootState) => ({
  mode: state.app.mode,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getListOfLists: listActions.getListOfListsAction.started,
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
