import * as React from 'react';
import { Field, reduxForm } from 'redux-form';

import { Forms } from '../../../store/forms';
import { disableHotKeys, registerHotKeys } from '../../../utils/hotkeys';

export interface ListsFilterProps {
  pageHotKeys: (e: any) => void;
}

const ListsFilterInput: React.FunctionComponent<ListsFilterProps> = ({ pageHotKeys }) => {
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

export default reduxForm<{}, ListsFilterProps>({
  form: Forms.listsFilter,
  initialValues: {
    searchInput: '',
  },
})(ListsFilterInput);
