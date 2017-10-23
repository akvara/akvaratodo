export function makeContractableList(listOfLists) {

    let contractedList = [];

    listOfLists.map(list => {
        let dashPos = list.name.indexOf(' - ');
        if (dashPos > -1) {
            let contractedTitle = list.name.substring(0, dashPos);
            if (!contractedList[contractedTitle]) {
                contractedList[contractedTitle] = {used: false, list: []}
            }
            contractedList[contractedTitle].list.push(list)
        }
        return null;
    });

    let displayList = [];

    listOfLists.map((list) => {
        let dashPos = list.name.indexOf(' - ');
        if (dashPos > -1) {
            let contractedTitle = list.name.substring(0, dashPos);
            if (contractedList[contractedTitle].list.length > 1) {
                if (!contractedList[contractedTitle].used) {
                    contractedList[contractedTitle].used = true;
                    displayList.push({
                        isList: true,
                        isContracted: true,
                        contractedTitle: contractedTitle,
                        list: contractedList[contractedTitle].list
                    });
                }
            } else {
                displayList.push(list)
            }
        } else {
            displayList.push(list)
        }
        return null;
    });
    console.log(displayList);
    return displayList;
}
