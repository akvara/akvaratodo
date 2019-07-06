import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';

import { RootState } from '../../store/reducers';

export interface StatusProps {
  statusMsg: string;
  message: string;
}

const Status: React.FunctionComponent<StatusProps> = (props: StatusProps) => <div>{props.statusMsg} | {props.message}</div>;

const mapStateToProps: MapStateToProps<StatusProps, void, RootState> = (state: RootState) => ({
  message: state.status.message,
  statusMsg: state.app.statusMsg,
});

export default connect(mapStateToProps)(Status);
