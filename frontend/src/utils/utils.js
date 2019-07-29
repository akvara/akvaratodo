import _ from 'underscore';
import CONFIG from '../config/config.js';

export const sortArrOfObjectsByParam = (arrToSort, sortBy, sortDesc) => {
  if (!sortDesc) {
    return arrToSort.sort(function(a, b) {
      return a[sortBy] < b[sortBy] ? -1 : 1;
    });
  } else {
    return arrToSort.sort(function(a, b) {
      return a[sortBy] > b[sortBy] ? -1 : 1;
    });
  }
};

export const moveToAnother = (fromA, toB, i, toTop) => {
  let trans = fromA[i];
  fromA.splice(i, 1);
  if (toTop) {
    toB = _.unique([trans].concat(toB));
  } else {
    toB = _.unique(toB.concat([trans]));
  }

  return { A: fromA, B: toB };
};

export const moveToEnd = (items, i) => {
  let trans = items[i];
  items.splice(i, 1);

  return items.concat([trans]);
};

export const moveToTop = (items, i) => {
  let trans = items[i];
  items.splice(i, 1);

  return [trans].concat(items);
};

export const moveFromTo = (items, fromPos, toPos) => {
  let trans = items[fromPos];
  items.splice(fromPos, 1);
  items.splice(toPos, 0, trans);

  return items;
};

export const removeItem = (items, i) => {
  items.splice(i, 1);

  return items;
};

export const concatTwoJSONs = (json1, json2) => {
  return JSON.stringify(_.unique(JSON.parse(json1).concat(JSON.parse(json2))));
};

export const prependToJSON = (strng, jsn) => {
  return JSON.stringify(_.unique([strng].concat(JSON.parse(jsn))));
};

export const removeTask = (strng, jsn) => {
  return JSON.stringify(JSON.parse(jsn).filter((item) => item !== strng));
};

export const overLength = (which, items) => {
  return items.length > CONFIG.user.settings[which];
};

export const grabDate = (someDateStr) => {
  return toLocalTime(someDateStr).substr(0, 10);
};

export const grabTime = (someDateStr) => {
  return toLocalTime(someDateStr).substr(11, 5);
};

export const toLocalTime = (utcDateStr) => {
  return new Date(new Date(utcDateStr).toString().replace(/GMT.*/g, '') + ' UTC').toISOString();
};
