import { bindActionCreators, compose } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { getFormValues } from 'redux-form';

import { appActions, listActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import MovePage from './MovePage';
import { appSelector, listSelector } from '../../store/selectors';
import { Forms } from '../../store/forms';

const mapStateToProps = (state: RootState) => {
  const searchFormValues = getFormValues(Forms.listsFilter)(state);
  return {
    lists: listSelector.getFilteredListOfLists(state),
    task: appSelector.getSelectedTask(state),
    fromList: state.app.fromList,
    newListName: searchFormValues ? searchFormValues.searchInput : '',
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAList: listActions.getAListAction.started,
      moveToListByName: appActions.moveToListByNameAction,
      moveToList: appActions.moveToListAction,
      copyToAList: appActions.copyToListAction,
      reloadListOfListsPage: appActions.reloadListOfListsPageAction,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MovePage);
