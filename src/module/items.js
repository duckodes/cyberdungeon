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
        if (!itemData) return;
        for (const [key, data] of Object.entries(itemData)) {
            callback(key, data);
        }
    }

    // user items
    const userItemDataKey = 'userItemData';
    async function setUserItems(key, data) {
        const currentUserItemData = await authData.getData(userItemDataKey + '/' + key) || [];
        authData.setData(userItemDataKey + '/' + key, [...currentUserItemData, data]);
    }
    async function getUserItems(itemData) {
        const userItemData = await authData.getData(userItemDataKey);
        if (!userItemData) return;
        return userItems(userItemData, itemData);
    }
    async function removeUserItems(key, data) {
        const currentUserItemData = await authData.getData(userItemDataKey + '/' + key) || [];
        currentUserItemData.splice(data, 1);
        authData.setData(userItemDataKey + '/' + key, currentUserItemData);
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

    // Equip
    const equipDataKey = 'equip';
    async function setEquipData(index, data) {
        let equipData = await authData.getData(equipDataKey);
        equipData[index] = data;
        authData.setData(equipDataKey, equipData);
    }
    async function getEquipData(itemData) {
        const categories = Object.keys(itemData);
        const result = {};
        let equipData = await authData.getData(equipDataKey);
        if (!equipData) {
            equipData = [-1, -1, -1, -1, -1];
            authData.setData(equipDataKey, equipData);
        }

        categories.forEach((category, index) => {
            const equipIndex = equipData[index];
            result[category] = equipIndex !== -1 ? [itemData[category][equipIndex]] : [];
        });

        return result;
    }

    return {
        get: get,
        parse: parse,
        setUserItems: setUserItems,
        getUserItems: getUserItems,
        removeUserItems: removeUserItems,
        setEquipData: setEquipData,
        getEquipData: getEquipData
    }
})();

export default items;