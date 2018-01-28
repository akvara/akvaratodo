import _ from 'underscore';
import CONFIG from '../config.js';


exports.sortArrOfObjectsByParam = function (arrToSort, sortBy, sortDesc) {
    if (!sortDesc) {
        return arrToSort.sort(function (a, b) {
            return a[sortBy] < b[sortBy] ? -1 : 1;
        });
    }
    else {
        return arrToSort.sort(function (a, b) {
            return a[sortBy] > b[sortBy] ? -1 : 1;
        });
    }
};

exports.moveToAnother = function (fromA, toB, i, toTop) {
    let trans = fromA[i];
    fromA.splice(i, 1);
    if (toTop) {
        toB = _.unique([trans].concat(toB));
    } else {
        toB = _.unique(toB.concat([trans]));
    }

    return {A: fromA, B: toB};
};

exports.moveToEnd = function (items, i) {
    let trans = items[i];
    items.splice(i, 1);

    return items.concat([trans]);
};

exports.moveToTop = function (items, i) {
    let trans = items[i];
    items.splice(i, 1);

    return [trans].concat(items);
};

exports.moveFromTo = function (items, fromPos, toPos) {
    let trans = items[fromPos];
    items.splice(fromPos, 1);
    items.splice(toPos, 0, trans);

    return items;
};

exports.removeItem = function (items, i) {
    items.splice(i, 1);

    return items;
};

exports.textToArray = function (text) {
    return text.split(/\r?\n/).filter(entry => entry.trim() !== '');
};

exports.overLength = function (which, items) {
    return items.length > CONFIG.user.settings[which];
};

exports.grabDate = function (someDateStr) {
    return toLocalTime(someDateStr).substr(0, 10);
};

exports.grabTime = function (someDateStr) {
    return toLocalTime(someDateStr).substr(11, 5);
};

function toLocalTime(utcDateStr) {
    return new Date(new Date(utcDateStr).toString().replace(/GMT.*/g, "") + " UTC").toISOString();
}

exports.toLocalTime = toLocalTime;
