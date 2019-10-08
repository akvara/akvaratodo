import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { compose } from 'recompose';

import { RootState } from '../../../store/reducers';
import { appActions } from '../../../store/actions';
import TableRow, { TableRowProps } from './TableRow';

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => {
  return bindActionCreators(
    {
      removeListRequest: appActions.deleteAList,
      openAListRequest: appActions.openAList,
    },
    dispatch,
  );
};

export default compose<TableRowProps, TableRowProps>(
  connect(
    null,
    mapDispatchToProps,
  ),
)(TableRow);
