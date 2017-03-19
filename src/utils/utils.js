exports.sortArrOfObjectsByParam = function(arrToSort, sortBy, sortDesc) {
    if(!sortDesc) {
        return arrToSort.sort(function (a, b) {
            return a[sortBy] > b[sortBy];
        });
    }
    else {
        return arrToSort.sort(function (a, b) {
            return a[sortBy] < b[sortBy];
        });
    }
}

exports.moveToAnother = function(fromA, toB, i, toTop) {
    let trans = fromA[i];
    fromA.splice(i, 1);
    if (toTop) {
        toB = [trans].concat(toB);
    } else {
        toB = toB.concat([trans]);
    }

    return {A: fromA, B: toB};
}

exports.moveToEnd = function(items, i) {
    let trans = items[i];
    items.splice(i, 1);

    return items.concat([trans]);
}

exports.moveToTop = function(items, i) {
    let trans = items[i];
    items.splice(i, 1);

    return [trans].concat(items);
}

exports.moveFromTo = function(items, fromPos, toPos) {
    let trans = items[fromPos];
    items.splice(fromPos, 1);
    items.splice(toPos, 0, trans);

    return items;
}

exports.removeItem = function(items, i) {
    items.splice(i, 1);

    return items;
}

exports.textToArray = function(text) {
    return text.split(/\r?\n/).filter(entry => entry.trim() !== '');
}
