import React from 'react';
import { HotKey } from '../store/types';
import { restrictions, secsPerDay } from '../config/constants';
import { dayString } from './calendar';

/**
 *  Returns string with underlined first of given letter
 *
 */
export const strongify = (str: string, letter: string) => {
  const n = str.toLowerCase().indexOf(letter);

  if (n === -1) {
    return str;
  }

  return (
    <span>
      {str.substring(0, n)}
      <u>{str.substring(n, n + 1)}</u>
      {str.substring(n + 1, str.length)}
    </span>
  );
};

export const hotKeyedListName = (listName: string, hotKeys: HotKey[]) => {
  if (!hotKeys) {
    return listName;
  }

  const corresponding = hotKeys.filter((item) => item.listName === listName);

  if (!corresponding.length) {
    return listName;
  }

  return strongify(listName, corresponding[0].key);
};

export const getPreviousDays = () =>
  Array.from({ length: restrictions.collectDaysBefore }, (e, i) =>
    dayString(new Date(Date.now() - secsPerDay * (i + 1))),
  );
