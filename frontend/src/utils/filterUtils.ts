export const filterByString = (str: string = '', criteria: string) =>
  str.toLocaleLowerCase().indexOf(criteria.toLocaleLowerCase()) > -1;

// export const filterListBy = (list) => (criteria: any) => {
//   if (criteria > -1) {
//     return list && list.indexOf(+criteria) > -1;
//   }
//   return true;
// };
//
// export const filterById = (id, criteria) => {
//   if (criteria > -1) {
//     return id === criteria;
//   }
//   return true;
// };
