import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../store/reducers';
import ListsPage, { ListsPageProps } from '../../components/ListsPage';
import { appActions } from '../../store/actions';
import { listSelector } from '../../store/selectors';

const mapStateToProps = (state: RootState) => ({
  lists: listSelector.selectListOfLists(state),
  legacyExists: listSelector.findLegacyExists(state),
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAListRequest: appActions.openAList,
      startupRequest: appActions.startup,
      removeList: appActions.deleteAList,
      addOrOpenAList: appActions.addOrOpenListByNameAction,
      planWeek: appActions.planWeekAction,
      collectPastDaysRequest: appActions.collectPastDays,
    },
    dispatch,
  );
};

export default compose<ListsPageProps, ListsPageProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ListsPage);
