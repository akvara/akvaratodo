import { bindActionCreators, compose } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { getFormValues } from 'redux-form';

import { appActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import MovePage from './MovePage';
import { appSelector, listSelector } from '../../store/selectors';
import { Forms } from '../../store/forms';
import { dayString } from '../../utils/calendar';

const mapStateToProps = (state: RootState) => {
  const searchFormValues = getFormValues(Forms.listsFilter)(state);
  return {
    lists: listSelector.getFilteredListOfLists(state),
    task: appSelector.selectSelectedTask(state),
    fromList: state.app.fromList,
    newListName: searchFormValues ? searchFormValues.searchInput : '',
    tomorrowListName: dayString(new Date(new Date().setDate(new Date().getDate() + 1))),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      openAList: appActions.openAList,
      moveToListByName: appActions.moveToListByNameAction,
      moveToList: appActions.moveToListAction,
      copyToAList: appActions.copyToListAction,
      reloadListOfListsPage: appActions.reloadListOfLists,
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
