import { connect, Dispatch, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';

import * as listActions from '../store/list/list.actions';
import { RootState } from '../store/reducers';
import App from './App';

export interface AppPrivateProps {
  mode: string;
}

interface AppContainerProps extends AppPrivateProps {
  getListOfLists: typeof listActions.getListOfListsAction.started;
}

const mapStateToProps: MapStateToProps<AppPrivateProps, AppContainerProps, RootState> = (state: RootState) => ({
  mode: state.app.mode,
});

const mapDispatchToProps: MapDispatchToProps<any, AppPrivateProps> = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getListOfLists: listActions.getListOfListsAction.started,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);
