import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../store/reducers';
import ListsPage, { ListsPageProps } from '../../../../old/ListsPage';
import { appActions } from '../../store/actions';
import { listSelector } from '../../store/selectors';
import ListsApp from './ListsApp';

const mapStateToProps = (state: RootState) => ({
  lists: listSelector.selectListOfLists(state),
  legacyExists: listSelector.findLegacyExists(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => {
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
// )(ListsPage);
)(ListsApp);
