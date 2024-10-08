import fetcher from "./fetcher.js";

const items = (() => {
    async function init(languageData) {
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
        return itemData;
    }

    return {
        init
    }
})();

export default items;