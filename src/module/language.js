import fetcher from "./fetcher.js";

const language = (() => {
    let data = null;

    async function cache(lang) {
        data ||= await fetcher.load(`../src/lan/${lang}.json`).catch(() => fetcher.load(`../src/lan/en-ZA.json`));
        return data;
    }

    return {
        cache
    }
})();

export default language;