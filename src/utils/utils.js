var sortArrOfObjectsByParam = function (arrToSort, sortBy, sortDesc) {
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

module.exports = sortArrOfObjectsByParam;