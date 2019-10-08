import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Field, reduxForm } from 'redux-form';

import { Forms } from '../../../store/forms';
import { disableHotKeys, registerHotKeys } from '../../../utils/hotkeys';

export interface ListsFilterProps {
  pageHotKeys: () => void;
}

interface ListsFilterPrivateProps extends ListsFilterProps {}

const ListsFilterInput: React.FunctionComponent<ListsFilterPrivateProps> = ({ pageHotKeys }) => {
  return (
    <Field
      className="list-input"
      name="searchInput"
      placeholder={''}
      component="input"
      onFocus={disableHotKeys.bind(this)}
      onBlur={registerHotKeys.bind(this, pageHotKeys)}
    />
  );
};

export default compose<ListsFilterPrivateProps, ListsFilterProps>(
  reduxForm({
    form: Forms.listsFilter,
    initialValues: {
      searchInput: '',
    },
  }),
)(ListsFilterInput);
