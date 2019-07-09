import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../store/reducers';
import { appActions, listActions } from '../../store/actions';
import TasksPage from '../../components/TasksPage';
import { appSelector, listSelector } from '../../store/selectors';

const mapStateToProps = (state: RootState) => ({
  lists: listSelector.selectListOfLists(state),
  aList: listSelector.selectAList(state),
  task: state.app.task,
  fromList: state.app.fromList,
  immutables: listSelector.selectImmutableLists(state),
  exportables: listSelector.selectExportables(state),
  previousList: appSelector.selectPreviousList(state),
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      openAList: appActions.openAList,
      startupRequest: appActions.startup,
      checkAndSave: appActions.checkAndSaveAction,
      importList: appActions.importListAction,
      exportList: appActions.exportListAction,
      addOrOpenAList: appActions.addOrOpenListByNameAction,
      moveOutside: appActions.moveInitiationAction,
    },
    dispatch,
  );
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TasksPage);
