import auth from "./auth.js";
import carousel from "./carousel.js";
import items from "./items.js";
import language from "./language.js";

const main = (() => {
    let lang = navigator.language;

    async function init() {
        console.log("welcome to cyberdungeon !!");
        document.documentElement.lang = lang;
        //await auth.init(lang);
        const itemData = await items.init(lang);
        const languageData = await language.cache(lang);
        render(languageData);
        const infiniteCarousel = carousel.render();
        carousel.add(infiniteCarousel);
    }

    function render(languageData) {
        const title = document.createElement('title');
        title.textContent = languageData.appname;
        document.head.appendChild(title);
    }

    return {
        init
    }
})();

await main.init();