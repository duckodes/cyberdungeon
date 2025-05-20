import language from "./language.js";

import auth from "./auth.js";
import authSign from "./auth.sign.js";

import audioSource from "./audio.source.js";
import items from "./items.js";

const main = (async () => {
    let lang = navigator.language;
    document.documentElement.lang = lang;
    console.warn("welcome to cyberdungeon !!");

    const languageData = await language.cache(document.documentElement.lang);

    auth.init(languageData);
    audioSource.init();

    const itemData = await items.init(languageData);
    console.log(itemData);

    function render(languageData) {
        const title = document.createElement('title');
        title.textContent = languageData.appname;
        document.head.appendChild(title);
    }
    render(languageData);

    registerWindowEvent();
    function registerWindowEvent() {
        authSign.registerWindowEvent();
        audioSource.registerWindowEvent();
    }
})();