import fetcher from "./fetcher.js";

const language = (() => {
    let data = null;

    async function set(lang) {
        data = await fetcher.load(`../src/lan/${lang}.json`).catch(() => fetcher.load(`../src/lan/en-ZA.json`));
        return data;
    }

    async function cache(lang) {
        data ||= await fetcher.load(`../src/lan/${lang}.json`).catch(() => fetcher.load(`../src/lan/en-ZA.json`));
        return data;
    }

    return {
        set,
        cache
    }
})();

export default language;