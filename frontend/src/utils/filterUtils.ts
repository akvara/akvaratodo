export const filterByString = (str: string = '', criteria: string) =>
  str.toLocaleLowerCase().indexOf(criteria.toLocaleLowerCase()) > -1;
