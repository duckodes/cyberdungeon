import authData from "./auth.data.js";

import fetcher from "./fetcher.js";

const items = (() => {
    async function get(languageData) {
        const categories = ['helmet', 'jacket', 'weapon', 'legstrap', 'boots'];
        const dataPromises = categories.map(category =>
            fetcher.load(`../src/data/${category}.json`)
        );

        const itemDataArray = await Promise.all(dataPromises);

        const itemData = {};
        categories.forEach((category, index) => {
            itemData[category] = itemDataArray[index][category];
        });

        for (const category of categories) {
            itemData[category]?.forEach((item, i) => {
                item.name = languageData.items[category][i] || item.name;
            });
        }
        function readOnly(obj) {
            if (obj === null || typeof obj !== 'object') {
                return;
            }
            Object.freeze(obj);
            Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    readOnly(value);
                }
            });
        }
        readOnly(itemData);
        return itemData;
    }
    function parse(itemData, callback) {
        for (const [key, data] of Object.entries(itemData)) {
            callback(key, data);
        }
    }
    async function getUserItems(itemData) {
        return userItems(await authData.getData('userItemData'), itemData);
    }
    function userItems(userItemData, itemData) {
        return Object.entries(userItemData).reduce(function (acc, entry) {
            const category = entry[0];
            const indices = entry[1];

            acc[category] = indices.map(function (index) {
                return itemData[category][index];
            });

            return acc;
        }, {});
    }

    return {
        get: get,
        parse: parse,
        getUserItems: getUserItems
    }
})();

export default items;