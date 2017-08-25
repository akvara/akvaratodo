import _ from 'underscore';
import CONFIG from '../config.js';

export function sortArrOfObjectsByParam(arrToSort, sortBy, sortDesc) {
    if(!sortDesc) {
        return arrToSort.sort(function (a, b) {
            return a[sortBy] < b[sortBy] ? -1 : 1;
        });
    }
    else {
        return arrToSort.sort(function (a, b) {
            return a[sortBy] > b[sortBy] ? -1 : 1;
        });
    }
}

export function moveToAnother(fromA, toB, i, toTop) {
    let trans = fromA[i];
    fromA.splice(i, 1);
    if (toTop) {
        toB = _.unique([trans].concat(toB));
    } else {
        toB = _.unique(toB.concat([trans]));
    }

    return {A: fromA, B: toB};
}

export function moveToEnd(items, i) {
    let trans = items[i];
    items.splice(i, 1);

    return items.concat([trans]);
}

export function moveToTop(items, i) {
    let trans = items[i];
    items.splice(i, 1);

    return [trans].concat(items);
}

export function moveFromTo(items, fromPos, toPos) {
    let trans = items[fromPos];
    items.splice(fromPos, 1);
    items.splice(toPos, 0, trans);

    return items;
}

export function removeItem(items, i) {
    items.splice(i, 1);

    return items;
}

export function textToArray(text) {
    return text.split(/\r?\n/).filter(entry => entry.trim() !== '');
}

export function overLength(which, items) {
    return items.length > CONFIG.user.settings[which];
}

export function grabDate(someDateStr) {
    return toLocalTime(someDateStr).substr(0, 10);
}

export function grabTime(someDateStr) {
    return toLocalTime(someDateStr).substr(11, 5);
}

export function toLocalTime(utcDateStr) {
    return new Date(new Date(utcDateStr).toString() + " UTC").toISOString();
}
