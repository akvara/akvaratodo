import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { RootState } from '../store/reducers';

export interface StatusProps {
  statusMsg: string;
}

const Status: React.FunctionComponent<StatusProps> = (props: StatusProps) => <div>{props.statusMsg}</div>;

const mapStateToProps: MapStateToProps<StatusProps, void, RootState> = (state: RootState) => ({
  statusMsg: state.app.statusMsg,
});

export default connect(mapStateToProps)(Status);
