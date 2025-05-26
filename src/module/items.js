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
            for (let i = 0; i < data.length; i++) {
                callback(key, data, i);
            }
        }
    }

    return {
        get: get,
        parse: parse
    }
})();

export default items;