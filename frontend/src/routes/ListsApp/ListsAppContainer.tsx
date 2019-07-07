import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../store/reducers';
import ListsPage, { ListsPageProps } from '../../components/ListsPage';
import { appActions, listActions } from '../../store/actions';
import { listSelector } from '../../store/selectors';

const mapStateToProps = (state: RootState) => ({
  lists: listSelector.getListOfLists(state),
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      getAList: listActions.getAListAction.started,
      getListOfLists: listActions.getListOfListsAction.started,
      removeList: listActions.removeListAction.started,
      addOrOpenAList: appActions.addOrOpenListByNameAction,
      planWeek: appActions.planWeekAction,
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
