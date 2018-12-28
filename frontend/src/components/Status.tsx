import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../store/reducers';

export interface StatusProps {
  status_msg: string;
}

const Status: React.FunctionComponent<StatusProps> = (props: StatusProps) => <div>{props.status_msg}</div>;

const mapStateToProps: MapStateToProps<StatusProps, void, RootState> = (state: RootState) => ({
  status_msg: state.app.status_msg,
});

export default connect(mapStateToProps)(Status);
