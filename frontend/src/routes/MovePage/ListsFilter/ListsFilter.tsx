import * as React from 'react';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';

import { Forms } from '../../../store/forms';

export interface ListsFilterProps {}

interface ListsFilterPrivateProps extends ListsFilterProps {}

const ListsFilter: React.FunctionComponent<ListsFilterPrivateProps> = () => {
  return <Field className="list-input" name="searchInput" placeholder={''} component="input" />;
};

export default compose<ListsFilterPrivateProps, ListsFilterProps>(
  reduxForm({
    form: Forms.listsFilter,
    initialValues: {
      searchInput: '',
    },
  }),
)(ListsFilter);
