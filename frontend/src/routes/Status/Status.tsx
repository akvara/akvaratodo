import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';

import { RootState } from '../../store/reducers';

export interface StatusProps {
  message: string;
}

const Status: React.FunctionComponent<StatusProps> = ({ message }) => <div> {message}</div>;

const mapStateToProps: MapStateToProps<StatusProps, void, RootState> = (state: RootState) => ({
  message: state.status.message,
});

export default connect(mapStateToProps)(Status);
