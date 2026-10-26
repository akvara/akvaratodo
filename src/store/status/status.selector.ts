import { RootState } from '../reducers';

export const getCurrentMessage = (state: RootState): string => state.status.message;
